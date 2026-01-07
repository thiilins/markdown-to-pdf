'use server'

import { stripHTML } from '@/shared/utils/strip-html'
import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { Readability } from '@mozilla/readability'
import * as cheerio from 'cheerio'
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
    // Reduzido para 8.5s para evitar timeout da Vercel (limite de 10s)
    const timeoutId = setTimeout(() => abortController.abort(), 8500)

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

    // === 1. PROCESSAMENTO INICIAL COM CHEERIO (MUITO MAIS LEVE QUE JSDOM) ===
    // Cheerio é ~10x mais rápido e usa menos memória que JSDOM
    // decodeEntities é true por padrão, então não precisa especificar
    const $ = cheerio.load(html)

    // Remove scripts, iframes e estilos (mais eficiente com Cheerio)
    $('script').remove()
    $('iframe').remove()
    $('style').remove()
    // Remove estilos inline
    $('[style]').removeAttr('style')

    // === 2. CAPTURA DA IMAGEM DE CAPA (METADATA) COM CHEERIO ===
    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') ||
      null

    // === 3. RESGATE DE IMAGENS DO CORPO (LAZY LOAD) COM CHEERIO ===
    $('img').each((_, img) => {
      const $img = $(img)
      const potentialSources = [
        $img.attr('data-src'),
        $img.attr('data-original'),
        $img.attr('data-original-src'),
        $img.attr('data-lazy-src'),
        $img.attr('srcset')?.split(',')[0]?.split(' ')[0],
      ]

      const bestSrc = potentialSources.find((src) => src && src.trim() !== '')
      if (bestSrc) {
        $img.attr('src', bestSrc)
      }

      $img.removeAttr('srcset').removeAttr('loading')

      const currentSrc = $img.attr('src')
      if (currentSrc) {
        try {
          const absoluteUrl = new URL(currentSrc, url).href
          $img.attr('src', absoluteUrl)
        } catch (e) {
          // Ignora erros de URL inválida
        }
      }
    })

    // === 4. PROCESSAMENTO DE LINKS COM CHEERIO ===
    $('a').each((_, link) => {
      const $link = $(link)
      const href = $link.attr('href')
      if (href) {
        try {
          $link.attr('href', new URL(href, url).href)
        } catch (e) {
          // Ignora erros de URL inválida
        }
      }
      $link.removeAttr('target')
    })

    // === 5. EXTRAIR TÍTULO COM CHEERIO ===
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || ''

    // === 6. PROCESSAMENTO READABILITY (PRECISA DE DOM REAL) ===
    // Cria JSDOM apenas com o HTML já processado pelo Cheerio (muito mais leve)
    const processedHtml = $.html()
    const dom = new JSDOM(processedHtml, { url })
    const doc = dom.window.document

    const reader = new Readability(doc, {
      keepClasses: false,
      debug: false,
    })

    const article = reader.parse()

    if (!article || !article.content) {
      // Fallback: usa o body processado pelo Cheerio
      const bodyHtml = $('body').html() || $('html').html() || ''
      return {
        success: true,
        html: `<div class="raw-content-fallback">${bodyHtml}</div>`,
        title: title,
        excerpt: '',
      }
    }

    let finalHtml = article.content

    // === 7. INJEÇÃO DA CAPA (FEATURED IMAGE) ===
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
      title: article.title || title,
      excerpt: stripHTML(article.excerpt || ''),
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)
    return { success: false, error: 'Ocorreu um erro ao processar o conteúdo do site.' }
  }
}
