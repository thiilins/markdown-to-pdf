'use server'

import { stripHTML } from '@/shared/utils/strip-html'
import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
// @ts-ignore
import { NodeHtmlMarkdown } from 'node-html-markdown'

/**
 * Server Action para extrair conteúdo de uma URL e converter para Markdown
 * Otimizado para G1, Carrefour, Amazon e outros (Alta Resolução e JSON-LD)
 */
export async function scrapeHtmlToMarkdown(url: string): Promise<ScrapeHtmlResponse> {
  try {
    const validation = isValidWebUrl(url)
    if (!validation.valid) {
      return { success: false, error: validation.error || 'URL inválida' }
    }

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 20000) // Aumentado para 20s para e-commerce

    let response: Response
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: abortController.signal,
      })
      clearTimeout(timeoutId)
    } catch (error) {
      clearTimeout(timeoutId)
      return {
        success: false,
        error: `Erro de conexão: ${error instanceof Error ? error.message : 'Desconhecido'}`,
      }
    }

    if (!response.ok) {
      return { success: false, error: `Erro: ${response.status} ${response.statusText}` }
    }

    let html = await response.text()

    // --- FIX CRÍTICO: LIMPEZA DE STRING ---
    html = html
      .replace(/style\s*=\s*["'][^"']*["']/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    const dom = new JSDOM(html, { url })
    const originalDoc = dom.window.document

    // --- LÓGICA DE CAPTURA DE DADOS ESTRUTURADOS (JSON-LD) ---
    // Essencial para Carrefour e E-commerce: pega as imagens de alta resolução que o Google vê
    let jsonLdImages: string[] = []
    const jsonScripts = originalDoc.querySelectorAll('script[type="application/ld+json"]')
    jsonScripts.forEach((script) => {
      try {
        const json = JSON.parse(script.textContent || '')
        const images =
          json.image ||
          json.images ||
          (json['@graph'] ? json['@graph'].map((i: any) => i.image).filter(Boolean) : [])
        if (Array.isArray(images)) {
          jsonLdImages.push(...images.map((img: any) => (typeof img === 'string' ? img : img.url)))
        } else if (typeof images === 'string') {
          jsonLdImages.push(images)
        }
      } catch (e) {
        /* ignore parse errors */
      }
    })

    // Captura Meta Tags de imagem
    const metaImage =
      originalDoc.querySelector('meta[property="og:image:secure_url"]')?.getAttribute('content') ||
      originalDoc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      originalDoc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')

    if (metaImage) jsonLdImages.unshift(metaImage)

    // --- LÓGICA DE IMAGENS EM ALTA RESOLUÇÃO ---
    originalDoc.querySelectorAll('img, picture source').forEach((img: any) => {
      let bestSrc = ''

      // 1. Prioriza o maior srcset
      const srcset = img.getAttribute('srcset')
      if (srcset) {
        const sources = srcset.split(',').map((s: string) => s.trim().split(' '))
        bestSrc = sources[sources.length - 1][0]
      }

      // 2. Fallbacks e Data Attributes (Comum em Carrefour/VTEX)
      if (!bestSrc) {
        bestSrc =
          img.getAttribute('data-original-src') ||
          img.getAttribute('data-src') ||
          img.getAttribute('data-lazy') ||
          img.getAttribute('src')
      }

      if (bestSrc && !bestSrc.startsWith('data:image')) {
        try {
          // Normalização de URL absoluta
          if (!bestSrc.startsWith('http') && !bestSrc.startsWith('//')) {
            bestSrc = new URL(bestSrc, url).href
          } else if (bestSrc.startsWith('//')) {
            bestSrc = new URL(url).protocol + bestSrc
          }

          // --- TRATAMENTO PARA E-COMMERCE (Carrefour/VTEX) ---
          // Remove redimensionadores de imagem (ex: /width/height/ ou -200-200)
          // Isso força a imagem a vir na resolução original
          bestSrc = bestSrc
            .replace(/\/\d+-\d+\//g, '/') // Remove /200-200/
            .replace(/-\d+-\d+\./g, '.') // Remove -200-200.jpg
            .replace(/\?v=\d+/, '') // Remove query strings de versão

          img.setAttribute('src', bestSrc)

          if (img.tagName === 'SOURCE') {
            const parent = img.closest('picture')
            const mainImg = parent?.querySelector('img')
            if (mainImg) mainImg.setAttribute('src', bestSrc)
          }
        } catch {
          /* ignore */
        }
      }

      // Limpeza de lixo visual
      img.removeAttribute('width')
      img.removeAttribute('height')
      img.removeAttribute('srcset')
      img.removeAttribute('sizes')
    })

    const reader = new Readability(originalDoc)
    const article = reader.parse()

    if (!article || !article.content) {
      return { success: false, error: 'Não foi possível extrair o conteúdo principal.' }
    }

    const tempDom = new JSDOM(article.content)
    const tempDoc = tempDom.window.document

    // Limpeza profunda e fix para NotFoundError
    tempDoc
      .querySelectorAll(
        'script, style, iframe, embed, object, noscript, .hidden, [style*="display:none"]',
      )
      .forEach((el) => el.remove())

    const allElements = Array.from(tempDoc.querySelectorAll('*'))
    allElements.forEach((el: any) => {
      if (!el.isConnected) return
      el.removeAttribute('style')

      if ((el.tagName === 'DIV' || el.tagName === 'SPAN') && el.children.length === 0) {
        const text = el.textContent?.trim()
        if (text && text.length > 0) {
          const p = tempDoc.createElement('p')
          p.textContent = text
          if (el.parentNode && el.parentNode.contains(el)) el.parentNode.replaceChild(p, el)
        }
      }
    })

    // --- REINJEÇÃO DE IMAGENS DE ALTA RESOLUÇÃO ---
    // Se for e-commerce, a Readability pode ter removido as fotos do produto.
    // Nós as colocamos de volta no topo de forma organizada.
    const uniqueImages = Array.from(new Set(jsonLdImages)).filter((img) => img.startsWith('http'))

    if (uniqueImages.length > 0) {
      // Criamos uma seção de galeria se houver muitas fotos (comum em produtos)
      const galleryDiv = tempDoc.createElement('div')
      uniqueImages.slice(0, 5).forEach((imgUrl) => {
        // Verifica se a imagem já não está no conteúdo para evitar duplicatas
        if (!tempDoc.body.innerHTML.includes(imgUrl.split('/').pop() || 'nothing')) {
          const newImg = tempDoc.createElement('img')
          newImg.setAttribute('src', imgUrl)
          newImg.setAttribute('alt', article.title || '')
          galleryDiv.appendChild(newImg)
        }
      })
      tempDoc.body.prepend(galleryDiv)
    }

    article.content = tempDoc.body.innerHTML

    // Conversão Final com NHM
    const nhm = new NodeHtmlMarkdown({
      bulletMarker: '-',
      codeFence: '```',
    })

    let markdown = nhm.translate(article.content || '')

    // Limpeza de excessos de quebra de linha e HTML residual
    markdown = markdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/<(\/?)(div|span|section|header|footer)([^>]*)>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .trim()

    return {
      success: true,
      markdown: `# ${article.title || 'Produto/Artigo'}\n\n${markdown}`,
      title: article.title || '',
      excerpt: stripHTML(article.excerpt || ''),
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)
    return { success: false, error: 'Ocorreu um erro ao processar o conteúdo do site.' }
  }
}
