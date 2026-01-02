'use server'

import { stripHTML } from '@/shared/utils/strip-html'
import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export interface ScrapeHtmlResponse {
  success: boolean
  html?: string
  title?: string
  excerpt?: string
  error?: string
}

export async function scrapperHtmlV2(url: string): Promise<ScrapeHtmlResponse> {
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
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          Referer: 'https://www.google.com/',
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

    // --- LIMPEZA DE CHOQUE PARA EVITAR CRASH DO JSDOM ---
    // Remove scripts, iframes e principalmente ESTILOS que causam erro no parser do JSDOM
    html = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gim, '')
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gim, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gim, '') // Remove blocos CSS
      .replace(/style\s*=\s*["'][^"']*["']/gim, '') // Remove estilos inline (Causa do erro)

    const dom = new JSDOM(html, { url })
    const doc = dom.window.document

    // === 2. CAPTURA DA IMAGEM DE CAPA (METADATA) ===
    const ogImage =
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
      doc.querySelector('link[rel="image_src"]')?.getAttribute('href')

    // === 3. RESGATE DE IMAGENS DO CORPO (LAZY LOAD) ===
    doc.querySelectorAll('img').forEach((img: any) => {
      const potentialSources = [
        img.getAttribute('data-src'),
        img.getAttribute('data-original'),
        img.getAttribute('data-original-src'),
        img.getAttribute('data-lazy-src'),
        img.getAttribute('srcset')?.split(',')[0]?.split(' ')[0],
      ]

      const bestSrc = potentialSources.find((src) => src && src.trim() !== '')
      if (bestSrc) img.setAttribute('src', bestSrc)

      img.removeAttribute('srcset')
      img.removeAttribute('loading')
      img.style.display = 'block' // Garante visibilidade já que removemos estilos globais

      const currentSrc = img.getAttribute('src')
      if (currentSrc) {
        try {
          const absoluteUrl = new URL(currentSrc, url).href
          img.setAttribute('src', absoluteUrl)
        } catch (e) {}
      }
    })

    doc.querySelectorAll('a').forEach((a: any) => {
      if (a.hasAttribute('href')) {
        try {
          a.setAttribute('href', new URL(a.getAttribute('href'), url).href)
        } catch (e) {}
      }
      a.removeAttribute('target')
    })

    // === 4. PROCESSAMENTO READABILITY ===
    const reader = new Readability(doc, {
      keepClasses: false,
      debug: false,
    })

    const article = reader.parse()

    if (!article || !article.content) {
      return {
        success: true,
        html: `<div class="raw-content-fallback">${doc.body.innerHTML}</div>`,
        title: doc.title,
        excerpt: '',
      }
    }

    let finalHtml = article.content

    // === 5. INJEÇÃO DA CAPA (FEATURED IMAGE) ===
    if (ogImage) {
      try {
        const imageName = ogImage.split('/').pop()?.split('?')[0] || 'xyz-aleatorio'

        if (!finalHtml.includes(imageName) && !finalHtml.includes(ogImage)) {
          const absoluteOgImage = new URL(ogImage, url).href

          const featuredImageHtml = `
              <figure style="margin: 0 0 2rem 0; width: 100%;">
                <img src="${absoluteOgImage}" alt="${article.title}" style="width: 100%; height: auto; border-radius: 8px; object-fit: cover; max-height: 500px;" referrerpolicy="no-referrer" />
              </figure>
            `
          finalHtml = featuredImageHtml + finalHtml
        }
      } catch (e) {
        // ignore error
      }
    }

    return {
      success: true,
      html: finalHtml,
      title: article.title || '',
      excerpt: stripHTML(article.excerpt || ''),
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)
    return { success: false, error: 'Ocorreu um erro ao processar o conteúdo do site.' }
  }
}
