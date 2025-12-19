/**
 * Remove tags HTML e retorna apenas o texto
 * Funciona tanto no servidor (Node.js) quanto no cliente (browser)
 * No servidor usa importação dinâmica de jsdom para evitar problemas ESM/CommonJS na Vercel
 */
export const stripHTML = async (html: string): Promise<string> => {
  if (typeof window !== 'undefined') {
    // Cliente (browser) - síncrono
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  } else {
    // Servidor (Node.js) - usa importação dinâmica para evitar problemas ESM/CommonJS
    const { JSDOM } = await import('jsdom')
    const dom = new JSDOM(html)
    return dom.window.document.body.textContent || dom.window.document.body.innerText || ''
  }
}
