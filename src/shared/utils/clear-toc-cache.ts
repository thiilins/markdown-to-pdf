/**
 * Utilitário para limpar cache do TOC do localStorage
 * Execute isso no console do navegador se o TOC ainda aparecer do lado direito
 */
export function clearTOCCache() {
  const config = localStorage.getItem('md-to-pdf-config')
  if (config) {
    try {
      const parsed = JSON.parse(config)
      if (parsed.preview) {
        parsed.preview.tocPosition = 'left'
        localStorage.setItem('md-to-pdf-config', JSON.stringify(parsed))
        console.log('✅ Cache do TOC atualizado para posição esquerda')
      }
    } catch (e) {
      console.error('Erro ao atualizar cache:', e)
    }
  }
}

// Auto-executa na importação
if (typeof window !== 'undefined') {
  clearTOCCache()
}
