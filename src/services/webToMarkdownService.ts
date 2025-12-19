import { scrapeHtmlToMarkdown } from '@/app/actions/scrapper-html-v2'

/**
 * Service para conversão de HTML para Markdown
 */
export const WebToMarkdownService = {
  /**
   * Converte uma URL de site/blog para Markdown
   */
  scrape: async ({ url }: ScrapeHtmlParams): Promise<ScrapeHtmlResponse> => {
    try {
      const result = await scrapeHtmlToMarkdown(url)
      return result
    } catch (error) {
      console.error('Erro no WebToMarkdownService:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao converter HTML',
      }
    }
  },
}
