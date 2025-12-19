/**
 * Tipos para o módulo Web to Markdown
 */

interface ScrapeHtmlParams {
  url: string
}

interface ScrapeHtmlResponse {
  success: boolean
  markdown?: string
  title?: string
  excerpt?: string
  error?: string
}

interface WebToMarkdownState {
  url: string
  isLoading: boolean
  result: ScrapeHtmlResponse | null
  error: string | null
}
