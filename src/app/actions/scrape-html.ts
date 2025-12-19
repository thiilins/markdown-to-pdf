'use server'

import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { Readability } from '@mozilla/readability'
import TurndownService from 'turndown'

/**
 * Server Action para extrair conteúdo de uma URL e converter para Markdown
 * Usa Readability para extrair conteúdo principal e Turndown para conversão
 */
export async function scrapeHtmlToMarkdown(url: string): Promise<ScrapeHtmlResponse> {
  try {
    // Valida URL
    const validation = isValidWebUrl(url)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'URL inválida',
      }
    }

    // Faz fetch do HTML (server-side resolve CORS)
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 15000) // 15s timeout

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

      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Timeout ao buscar conteúdo. O site pode estar lento ou inacessível.',
        }
      }

      return {
        success: false,
        error: `Erro ao buscar conteúdo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao buscar conteúdo: ${response.status} ${response.statusText}`,
      }
    }

    // Lê o HTML
    let html = await response.text()

    // Valida tamanho (máximo 10MB)
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (html.length > MAX_SIZE) {
      return {
        success: false,
        error: 'Conteúdo muito grande (máximo 10MB)',
      }
    }

    // --- CORREÇÃO DEFINITIVA DO CRASH ---
    // Limpamos os atributos 'style' e tags 'style' da STRING antes de criar o JSDOM.
    // Isso evita que o parser interno do JSDOM tente processar as variáveis CSS do GE e quebre.
    html = html
      .replace(/style\s*=\s*["'][^"']*["']/gi, '') // Remove todos os style="..."
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove blocos <style>

    // Importação dinâmica de jsdom para evitar problemas ESM/CommonJS na Vercel
    const { JSDOM } = await import('jsdom')
    // Usa JSDOM e Readability para extrair apenas o conteúdo relevante
    const dom = new JSDOM(html, { url })

    // Normaliza imagens no HTML original ANTES do Readability
    const originalDoc = dom.window.document
    originalDoc.querySelectorAll('img, picture source').forEach((img: any) => {
      // Para elementos source dentro de picture
      if (img.tagName === 'SOURCE') {
        const srcset = img.getAttribute('srcset')
        if (srcset) {
          const match = srcset.match(/([^\s,]+)/)
          if (match) {
            const parent = img.closest('picture')
            if (parent) {
              const imgElement = parent.querySelector('img')
              if (imgElement && !imgElement.getAttribute('src')) {
                imgElement.setAttribute('src', match[1])
              }
            }
          }
        }
      } else {
        // Para elementos img normais
        let src = img.getAttribute('src')

        // Tenta múltiplas fontes de lazy loading (Adicionado data-original-src para GE)
        if (
          !src ||
          src === '' ||
          src === 'data:image' ||
          src.includes('placeholder') ||
          src.includes('blank')
        ) {
          src =
            img.getAttribute('data-src') ||
            img.getAttribute('data-original-src') ||
            img.getAttribute('data-lazy-src') ||
            img.getAttribute('data-original') ||
            img.getAttribute('data-image-src') ||
            img.getAttribute('data-url')
        }

        // Se ainda não tiver, tenta do srcset
        if ((!src || src === '') && img.getAttribute('srcset')) {
          const srcset = img.getAttribute('srcset') || ''
          const match = srcset.match(/([^\s,]+)/)
          if (match) src = match[1]
        }

        // Se encontrou uma URL válida, normaliza
        if (src && src !== '' && !src.startsWith('data:image')) {
          // Converte para URL absoluta se necessário
          try {
            if (
              !src.startsWith('http://') &&
              !src.startsWith('https://') &&
              !src.startsWith('//')
            ) {
              if (src.startsWith('/')) {
                const urlObj = new URL(url)
                src = `${urlObj.protocol}//${urlObj.host}${src}`
              } else {
                const baseUrl = new URL(url)
                src = new URL(src, baseUrl).href
              }
            } else if (src.startsWith('//')) {
              src = new URL(url).protocol + src
            }
            img.setAttribute('src', src)
            // Remove atributos de lazy loading após normalizar
            img.removeAttribute('data-src')
            img.removeAttribute('data-original-src')
            img.removeAttribute('data-lazy-src')
            img.removeAttribute('data-original')
          } catch {
            // Se der erro na conversão, mantém o original
          }
        }
      }
    })

    const reader = new Readability(originalDoc)
    const article = reader.parse()

    if (!article) {
      return {
        success: false,
        error:
          'Não foi possível extrair o conteúdo principal deste site. O site pode ter uma estrutura não suportada.',
      }
    }

    // Remove estilos inline e limpa HTML antes de processar
    const articleContent = article.content
    if (articleContent) {
      const tempDom = new JSDOM(articleContent)
      const tempDoc = tempDom.window.document

      // Remove elementos problemáticos primeiro
      tempDoc
        .querySelectorAll('script, style, iframe, embed, object, noscript')
        .forEach((el) => el.remove())

      // Remove atributos style e outros atributos problemáticos de todos os elementos
      const allElements = tempDoc.querySelectorAll('*')
      allElements.forEach((el) => {
        // Remove style
        el.removeAttribute('style')
        // Remove atributos de evento, mas mantém data-src para imagens
        Array.from(el.attributes).forEach((attr) => {
          if (
            attr.name.startsWith('on') ||
            (attr.name.startsWith('data-') &&
              ![
                'data-src',
                'data-alt',
                'data-lazy-src',
                'data-original',
                'data-original-src',
              ].includes(attr.name) &&
              el.tagName !== 'IMG')
          ) {
            el.removeAttribute(attr.name)
          }
        })

        // Para divs e spans, se contiverem apenas texto, converte para parágrafo
        if ((el.tagName === 'DIV' || el.tagName === 'SPAN') && el.children.length === 0) {
          const text = el.textContent?.trim()
          if (text && text.length > 0) {
            const p = tempDoc.createElement('p')
            p.textContent = text
            el.parentNode?.replaceChild(p, el)
          }
        }
      })

      // Garante que todas as imagens tenham src válido
      tempDoc.querySelectorAll('img').forEach((img) => {
        let src = img.getAttribute('src')

        // Se não tiver src ou for placeholder, tenta outras fontes
        if (
          !src ||
          src === '' ||
          src.includes('placeholder') ||
          src.includes('blank') ||
          src.startsWith('data:image/svg')
        ) {
          src =
            img.getAttribute('data-src') ||
            img.getAttribute('data-original-src') ||
            img.getAttribute('data-lazy-src') ||
            img.getAttribute('data-original') ||
            img.getAttribute('data-image-src') ||
            img.getAttribute('data-url')
        }

        // Se ainda não tiver, tenta do srcset
        if ((!src || src === '') && img.getAttribute('srcset')) {
          const srcset = img.getAttribute('srcset') || ''
          const match = srcset.match(/([^\s,]+)/)
          if (match) src = match[1]
        }

        // Se encontrou uma URL, normaliza para absoluta
        if (src && src !== '' && !src.startsWith('data:image/svg')) {
          try {
            // Converte para URL absoluta se necessário
            if (
              !src.startsWith('http://') &&
              !src.startsWith('https://') &&
              !src.startsWith('//')
            ) {
              if (src.startsWith('/')) {
                const urlObj = new URL(url)
                src = `${urlObj.protocol}//${urlObj.host}${src}`
              } else {
                const baseUrl = new URL(url)
                src = new URL(src, baseUrl).href
              }
            } else if (src.startsWith('//')) {
              src = new URL(url).protocol + src
            }
            img.setAttribute('src', src)
          } catch {
            // Se der erro, mantém o original
          }
        }
      })

      // Processa elementos picture para extrair imagens
      tempDoc.querySelectorAll('picture').forEach((picture) => {
        const img = picture.querySelector('img')
        if (img) {
          let src = img.getAttribute('src')
          if (!src || src === '') {
            // Tenta pegar do source dentro do picture
            const source = picture.querySelector('source')
            if (source) {
              const srcset = source.getAttribute('srcset')
              if (srcset) {
                const match = srcset.match(/([^\s,]+)/)
                if (match) src = match[1]
              }
            }
          }
          if (src && src !== '') {
            try {
              if (
                !src.startsWith('http://') &&
                !src.startsWith('https://') &&
                !src.startsWith('//')
              ) {
                if (src.startsWith('/')) {
                  const urlObj = new URL(url)
                  src = `${urlObj.protocol}//${urlObj.host}${src}`
                } else {
                  const baseUrl = new URL(url)
                  src = new URL(src, baseUrl).href
                }
              } else if (src.startsWith('//')) {
                src = new URL(url).protocol + src
              }
              img.setAttribute('src', src)
            } catch {
              // Ignora erro
            }
          }
        }
      })

      article.content = tempDoc.body.innerHTML
    }

    // Se o Readability não capturou imagens, tenta buscar no HTML original
    if (article.content) {
      const contentDom = new JSDOM(article.content)
      const contentDoc = contentDom.window.document
      const imagesInContent = contentDoc.querySelectorAll('img')

      // Se não houver imagens no conteúdo extraído, busca no HTML original
      if (imagesInContent.length === 0) {
        const originalDoc = dom.window.document
        const articleImages = originalDoc.querySelectorAll(
          'article img, main img, [role="article"] img, .article img, .content img, .post img',
        )

        if (articleImages.length > 0) {
          // Adiciona as imagens ao conteúdo
          const contentBody = contentDoc.body
          articleImages.forEach((img: any) => {
            const clonedImg = img.cloneNode(true)
            // Garante que tenha src válido
            let src =
              clonedImg.getAttribute('src') ||
              clonedImg.getAttribute('data-src') ||
              clonedImg.getAttribute('data-original-src') ||
              clonedImg.getAttribute('data-lazy-src')

            if (src && src !== '') {
              try {
                if (
                  !src.startsWith('http://') &&
                  !src.startsWith('https://') &&
                  !src.startsWith('//')
                ) {
                  if (src.startsWith('/')) {
                    const urlObj = new URL(url)
                    src = `${urlObj.protocol}//${urlObj.host}${src}`
                  } else {
                    const baseUrl = new URL(url)
                    src = new URL(src, baseUrl).href
                  }
                } else if (src.startsWith('//')) {
                  src = new URL(url).protocol + src
                }
                clonedImg.setAttribute('src', src)
                // Insere a imagem antes do primeiro parágrafo ou no início
                const firstP = contentBody.querySelector('p')
                if (firstP) {
                  firstP.parentNode?.insertBefore(clonedImg, firstP)
                } else {
                  contentBody.insertBefore(clonedImg, contentBody.firstChild)
                }
              } catch {
                // Ignora erro
              }
            }
          })
          article.content = contentDoc.body.innerHTML
        }
      }
    }

    // Configura o Turndown para converter HTML em Markdown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    })

    // Adiciona regra para converter divs com conteúdo em parágrafos
    turndownService.addRule('divToParagraph', {
      filter: (node: any) => {
        return node.nodeName === 'DIV' && node.textContent && node.textContent.trim() !== ''
      },
      replacement: (content) => {
        // Se o div contém apenas texto, converte para parágrafo
        const trimmed = content.trim()
        if (trimmed) {
          return `\n\n${trimmed}\n\n`
        }
        return '\n\n'
      },
    })

    // Adiciona plugin customizado para converter URLs de imagens relativas para absolutas
    turndownService.addRule('images', {
      filter: 'img',
      replacement: (content, node: any) => {
        // Tenta pegar src de várias fontes
        let src =
          node.getAttribute('src') ||
          node.getAttribute('data-src') ||
          node.getAttribute('data-original-src') ||
          node.getAttribute('data-lazy-src') ||
          node.getAttribute('data-original')

        // Se não tiver src, tenta pegar do srcset
        if (!src && node.getAttribute('srcset')) {
          const srcset = node.getAttribute('srcset') || ''
          const match = srcset.match(/([^\s,]+)/)
          if (match) src = match[1]
        }

        if (!src || src.trim() === '') return ''

        const alt = node.getAttribute('alt') || node.getAttribute('data-alt') || ''
        const title = node.getAttribute('title') || ''

        // Converte URL relativa para absoluta
        let imageUrl = src.trim()
        try {
          // Se já for URL absoluta, mantém
          if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            imageUrl = imageUrl
          } else if (imageUrl.startsWith('//')) {
            // Protocol-relative URL
            imageUrl = new URL(url).protocol + imageUrl
          } else if (imageUrl.startsWith('/')) {
            // URL absoluta no domínio
            const urlObj = new URL(url)
            imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`
          } else {
            // URL relativa
            const baseUrl = new URL(url)
            imageUrl = new URL(imageUrl, baseUrl).href
          }
        } catch (err) {
          // Se der erro, tenta construir URL baseada no domínio
          try {
            const urlObj = new URL(url)
            if (imageUrl.startsWith('/')) {
              imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`
            } else {
              imageUrl = `${urlObj.protocol}//${urlObj.host}/${imageUrl}`
            }
          } catch {
            // Se ainda der erro, mantém a URL original
            imageUrl = src
          }
        }

        const titlePart = title ? ` "${title}"` : ''
        return `![${alt}](${imageUrl}${titlePart})`
      },
    })

    // Converte HTML para Markdown com tratamento de erros
    let markdown = ''
    try {
      markdown = turndownService.turndown(article?.content || '')
    } catch (turndownError) {
      console.error('Erro no Turndown:', turndownError)
      // Tenta novamente removendo mais elementos problemáticos
      try {
        const cleanDom = new JSDOM(article?.content || '')
        const cleanDoc = cleanDom.window.document

        // Remove elementos problemáticos
        cleanDoc
          .querySelectorAll('script, style, iframe, embed, object')
          .forEach((el) => el.remove())

        // Remove todos os atributos exceto src, alt, href, title
        cleanDoc.querySelectorAll('*').forEach((el) => {
          const allowedAttrs = ['src', 'alt', 'href', 'title']
          Array.from(el.attributes).forEach((attr) => {
            if (!allowedAttrs.includes(attr.name)) {
              el.removeAttribute(attr.name)
            }
          })
        })

        markdown = turndownService.turndown(cleanDoc.body.innerHTML)
      } catch (retryError) {
        console.error('Erro no retry do Turndown:', retryError)
        return {
          success: false,
          error:
            'Erro ao converter HTML para Markdown. O site pode ter uma estrutura muito complexa ou incompatível.',
        }
      }
    }

    // Limpa markdown (remove espaços extras, linhas vazias excessivas, HTML residual)
    markdown = markdown
      .replace(/\n{3,}/g, '\n\n') // Remove mais de 2 quebras de linha
      // Remove tags HTML que não foram convertidas (fallback)
      .replace(/<(\/?)(div|span)([^>]*)>/gi, '') // Remove divs e spans não convertidos
      .replace(/<strong([^>]*)>/gi, '**') // Converte <strong> para **
      .replace(/<\/strong>/gi, '**')
      .replace(/<b([^>]*)>/gi, '**') // Converte <b> para **
      .replace(/<\/b>/gi, '**')
      .replace(/<em([^>]*)>/gi, '*') // Converte <em> para *
      .replace(/<\/em>/gi, '*')
      .replace(/<i([^>]*)>/gi, '*') // Converte <i> para *
      .replace(/<\/i>/gi, '*')
      .replace(/<p([^>]*)>/gi, '\n\n') // Converte <p> para quebra de linha
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<h1([^>]*)>/gi, '\n\n# ') // Converte headers
      .replace(/<\/h1>/gi, '\n\n')
      .replace(/<h2([^>]*)>/gi, '\n\n## ')
      .replace(/<\/h2>/gi, '\n\n')
      .replace(/<h3([^>]*)>/gi, '\n\n### ')
      .replace(/<\/h3>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n') // Converte <br> para quebra de linha
      .replace(/&nbsp;/gi, ' ') // Converte &nbsp; para espaço
      .replace(/&amp;/gi, '&') // Converte &amp; para &
      .replace(/&lt;/gi, '<') // Converte &lt; para <
      .replace(/&gt;/gi, '>') // Converte &gt; para >
      .replace(/&quot;/gi, '"') // Converte &quot; para "
      .trim()

    // Adiciona título no início se disponível
    const title = article.title || 'Artigo Importado'
    const finalMarkdown = `# ${title}\n\n${markdown}`

    return {
      success: true,
      markdown: finalMarkdown,
      title: article.title || undefined,
      excerpt: article.excerpt || undefined,
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)

    // Mensagens de erro mais amigáveis
    let errorMessage = 'Erro ao processar a URL'

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()

      if (errorMsg.includes('timeout') || errorMsg.includes('abort')) {
        errorMessage =
          'O site demorou muito para responder. Tente novamente ou verifique se a URL está correta.'
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet ou se o site está acessível.'
      } else if (errorMsg.includes('parse') || errorMsg.includes('invalid')) {
        errorMessage =
          'Não foi possível processar o conteúdo do site. O site pode ter uma estrutura incompatível.'
      } else if (errorMsg.includes('border') || errorMsg.includes('style')) {
        errorMessage = 'Erro ao processar estilos do site. Tente novamente ou use outro artigo.'
      } else {
        errorMessage = `Erro ao processar: ${error.message}`
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
