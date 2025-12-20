'use client'

import moment from 'moment'

/**
 * Processador de placeholders para documentos PDF.
 * @param text - O conteúdo HTML ou texto bruto contendo as tags.
 * @param pageNumber - Número da página atual.
 * @param totalPages - Total de páginas do documento.
 * @param logoBase64 - String da imagem em formato Base64.
 * @param logoSize - Objeto contendo largura e altura (ex: { width: '50px', height: '50px' }).
 */
export function parseHeaderFooterText(
  text: string,
  pageNumber?: number,
  totalPages?: number,
  logoBase64?: string,
  logoSize?: { width: string; height: string },
): string {
  if (!text) return ''

  const now = moment()

  const tags: Record<string, string> = {
    '{datetime}': now.format('DD/MM/YYYY HH:mm'),
    '{date}': now.format('DD/MM/YYYY'),
    '{time}': now.format('HH:mm'),
    '{page}': pageNumber !== undefined ? String(pageNumber) : '',
    '{totalPages}': totalPages !== undefined ? String(totalPages) : '',
    '{logo}': logoBase64
      ? `<img src="${logoBase64}"
              alt="Logo"
              style="width: ${logoSize?.width || '50px'};
                     height: ${logoSize?.height || '50px'};
                     object-fit: contain;
                     display: inline-block;
                     vertical-align: middle;" />`
      : '',
  }

  let parsed = text

  Object.entries(tags).forEach(([key, value]) => {
    parsed = parsed.split(key).join(value)
  })

  return parsed
}
