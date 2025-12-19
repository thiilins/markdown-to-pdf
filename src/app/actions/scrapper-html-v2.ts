'use server'

import { stripHTML } from '@/shared/utils/strip-html'
import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { Readability } from '@mozilla/readability'
// @ts-ignore
import { NodeHtmlMarkdown } from 'node-html-markdown'

/**
 * Server Action para extrair conteúdo de uma URL e converter para Markdown
 * Otimizado para G1/Globo, máxima resolução de imagens e correção de erros de DOM.
 */
export async function scrapeHtmlToMarkdown(url: string): Promise<ScrapeHtmlResponse> {
  try {
    const validation = isValidWebUrl(url)
    if (!validation.valid) {
      return { success: false, error: validation.error || 'URL inválida' }
    }

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 15000)

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

    // --- LIMPEZA DE STRING (Crash Fix) ---
    html = html
      .replace(/style\s*=\s*["'][^"']*["']/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

    // Importação dinâmica de jsdom para evitar problemas ESM/CommonJS na Vercel
    const { JSDOM } = await import('jsdom')
    const dom = new JSDOM(html, { url })
    const originalDoc = dom.window.document

    // Captura a imagem principal via Meta Tags (G1 usa isso para a capa)
    const metaImage =
      originalDoc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      originalDoc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')

    // --- LÓGICA DE IMAGENS EM ALTA RESOLUÇÃO ---
    originalDoc.querySelectorAll('img, picture source').forEach((img: any) => {
      let bestSrc = ''

      // 1. Prioriza o maior srcset
      const srcset = img.getAttribute('srcset')
      if (srcset) {
        const sources = srcset.split(',').map((s: string) => s.trim().split(' '))
        bestSrc = sources[sources.length - 1][0]
      }

      // 2. Fallback para atributos de alta do G1/Globo
      if (!bestSrc) {
        bestSrc =
          img.getAttribute('data-original-src') ||
          img.getAttribute('data-src') ||
          img.getAttribute('src')
      }

      // Ignora thumbnails de vídeo conhecidos do G1
      const isThumb =
        bestSrc?.includes('thumb') ||
        img.className?.includes('thumb') ||
        img.className?.includes('video')

      if (bestSrc && !isThumb && !bestSrc.startsWith('data:image')) {
        try {
          if (!bestSrc.startsWith('http') && !bestSrc.startsWith('//')) {
            bestSrc = new URL(bestSrc, url).href
          } else if (bestSrc.startsWith('//')) {
            bestSrc = new URL(url).protocol + bestSrc
          }

          if (img.tagName === 'SOURCE') {
            const parent = img.closest('picture')
            const mainImg = parent?.querySelector('img')
            if (mainImg) mainImg.setAttribute('src', bestSrc)
          } else {
            img.setAttribute('src', bestSrc)
          }
        } catch {
          /* ignore */
        }
      }

      img.removeAttribute('width')
      img.removeAttribute('height')
      img.removeAttribute('srcset')
      img.removeAttribute('sizes')
    })

    const reader = new Readability(originalDoc)
    const article = reader.parse()

    if (!article || !article.content) {
      return { success: false, error: 'Não foi possível extrair o conteúdo.' }
    }

    const tempDom = new JSDOM(article.content)
    const tempDoc = tempDom.window.document

    // Limpeza profunda e fix para NotFoundError
    tempDoc
      .querySelectorAll('script, style, iframe, embed, object, noscript')
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

    // Injeta a imagem de capa (og:image) se ela for válida e não estiver no conteúdo
    if (metaImage && !tempDoc.body.innerHTML.includes(metaImage)) {
      const mainImg = tempDoc.createElement('img')
      mainImg.setAttribute('src', metaImage)
      mainImg.setAttribute('alt', 'Imagem de capa')
      tempDoc.body.prepend(mainImg)
    }

    article.content = tempDoc.body.innerHTML

    // Conversão Final com NHM
    const nhm = new NodeHtmlMarkdown({ bulletMarker: '-', codeFence: '```' })
    let markdown = nhm.translate(article.content || '')

    markdown = markdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/<(\/?)(div|span)([^>]*)>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .trim()

    return {
      success: true,
      markdown: `# ${article.title || 'Artigo Importado'}\n\n${markdown}`,
      title: article.title || '',
      excerpt: await stripHTML(article.excerpt || ''),
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)
    return { success: false, error: 'Ocorreu um erro ao processar o conteúdo.' }
  }
}
