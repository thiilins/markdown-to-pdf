import { JSDOM } from 'jsdom'

/**
 * Remove tags HTML e retorna apenas o texto
 * Funciona tanto no servidor (Node.js) quanto no cliente (browser)
 */
export const stripHTML = (html: string): string => {
  if (typeof window !== 'undefined') {
    // Cliente (browser)
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  } else {
    // Servidor (Node.js)
    const dom = new JSDOM(html)
    return dom.window.document.body.textContent || dom.window.document.body.innerText || ''
  }
}
