'use server'

import { stripHTML } from '@/shared/utils/strip-html'
import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { Readability } from '@mozilla/readability'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'

export interface IntegrityReport {
  warnings: string[]
  errors: string[]
  stats: {
    imagesFound: number
    imagesRecovered: number
    linksProcessed: number
    contentLength: number
    usedFallback: boolean
    readabilityScore?: number
  }
}

export interface ScrapeHtmlResponse {
  success: boolean
  html?: string
  title?: string
  excerpt?: string
  error?: string
  integrity?: IntegrityReport
}

export async function scrapperHtmlV2(url: string): Promise<ScrapeHtmlResponse> {
  // Inicializa relatório de integridade
  const warnings: string[] = []
  const errors: string[] = []
  let imagesFound = 0
  let imagesRecovered = 0
  let linksProcessed = 0
  let usedFallback = false

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

    if (html.length < 500) {
      warnings.push('Conteúdo muito curto (< 500 caracteres)')
    }

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
      imagesFound++
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
        imagesRecovered++
      }

      $img.removeAttr('srcset').removeAttr('loading')

      const currentSrc = $img.attr('src')
      if (currentSrc) {
        try {
          const absoluteUrl = new URL(currentSrc, url).href
          $img.attr('src', absoluteUrl)
        } catch (e) {
          warnings.push(`Imagem com URL inválida: ${currentSrc}`)
        }
      } else {
        warnings.push('Imagem sem atributo src encontrada')
      }
    })

    if (imagesFound === 0) {
      warnings.push('Nenhuma imagem encontrada no conteúdo')
    }

    // === 4. PROCESSAMENTO DE LINKS COM CHEERIO ===
    $('a').each((_, link) => {
      const $link = $(link)
      const href = $link.attr('href')
      if (href) {
        linksProcessed++
        try {
          $link.attr('href', new URL(href, url).href)
        } catch (e) {
          warnings.push(`Link com URL inválida: ${href}`)
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
      // Fallback Aprimorado: usa o body processado pelo Cheerio com limpeza adicional
      usedFallback = true
      warnings.push('Readability falhou - usando fallback inteligente')

      // Remove elementos indesejados do fallback
      $('header, nav, footer, aside, .sidebar, .menu, .navigation, .ads, .advertisement, .social-share, .comments, #comments, .related-posts').remove()
      $('[class*="cookie"], [class*="popup"], [class*="modal"], [id*="cookie"]').remove()
      
      // Tenta encontrar o main content
      let fallbackHtml = 
        $('article').html() || 
        $('main').html() || 
        $('.content, .post-content, .article-content, .entry-content').first().html() ||
        $('body').html() || 
        $('html').html() || 
        ''
      
      if (!fallbackHtml) {
        errors.push('Nenhum conteúdo encontrado no HTML')
      } else {
        warnings.push('Conteúdo extraído de fallback pode conter elementos indesejados')
      }

      // Aplica formatação básica ao fallback
      const $fallback = cheerio.load(`<div>${fallbackHtml}</div>`)
      
      // Remove atributos de estilo inline
      $fallback('[style]').removeAttr('style')
      $fallback('[class]').removeAttr('class')
      
      // Limita largura de imagens
      $fallback('img').each((_, img) => {
        const $img = $fallback(img)
        $img.attr('style', 'max-width: 100%; height: auto; display: block; margin: 20px auto;')
      })

      fallbackHtml = $fallback.html() || ''

      return {
        success: true,
        html: `<div class="reader-fallback-content">${fallbackHtml}</div>`,
        title: title,
        excerpt: '',
        integrity: {
          warnings,
          errors,
          stats: {
            imagesFound,
            imagesRecovered,
            linksProcessed,
            contentLength: fallbackHtml.length,
            usedFallback,
          },
        },
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

    // Validações finais
    if (finalHtml.length < 100) {
      warnings.push('Conteúdo extraído muito curto (< 100 caracteres)')
    }

    if (!article.title) {
      warnings.push('Título não encontrado')
    }

    return {
      success: true,
      html: finalHtml,
      title: article.title || title,
      excerpt: stripHTML(article.excerpt || ''),
      integrity: {
        warnings,
        errors,
        stats: {
          imagesFound,
          imagesRecovered,
          linksProcessed,
          contentLength: finalHtml.length,
          usedFallback,
          readabilityScore: article.length || 0,
        },
      },
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)
    return { 
      success: false, 
      error: 'Ocorreu um erro ao processar o conteúdo do site.',
      integrity: {
        warnings: [],
        errors: ['Erro crítico durante o processamento'],
        stats: {
          imagesFound: 0,
          imagesRecovered: 0,
          linksProcessed: 0,
          contentLength: 0,
          usedFallback: false,
        },
      },
    }
  }
}
