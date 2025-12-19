'use client'
import { ENVIROMENT } from '@/env'
import { PdfService } from '@/services/pdfService'
import { toast } from 'sonner'

/**
 * Handler de download de PDF com feedback visual (toasts)
 * Usa o PdfService para gerar e baixar o PDF
 */
export const handleDownloadPDFApi = async (
  config: AppConfig,
  htmlContent?: string,
  filename?: string,
) => {
  if (!ENVIROMENT.ENABLE_EXPORT) {
    return
  }

  if (!htmlContent) {
    toast.error('Conteúdo não encontrado para exportação.', {
      duration: 3000,
    })
    return
  }

  try {
    toast.loading('Gerando PDF...', {
      id: 'download-pdf',
      style: {
        backgroundColor: 'var(--secondary)',
        color: 'var(--secondary-foreground)',
      },
    })

    const result = await PdfService.generate({
      html: htmlContent,
      config,
    })

    if (!result.success || !result.blob) {
      throw new Error(result.error || 'Erro na geração do PDF')
    }

    // Usa o filename fornecido ou o retornado pela API
    const downloadFilename = filename ? `${filename}.pdf` : result.filename || 'documento.pdf'

    PdfService.downloadBlob(result.blob, downloadFilename)

    toast.success('PDF gerado com sucesso.', {
      id: 'download-pdf',
      style: {
        backgroundColor: 'var(--success-bg)',
        color: 'var(--success-text)',
        borderColor: 'var(--success-border)',
      },
    })
  } catch (error) {
    console.error('Erro:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF'

    toast.error(errorMessage, {
      id: 'download-pdf',
      style: {
        backgroundColor: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
      },
    })
  } finally {
    setTimeout(() => {
      toast.dismiss('download-pdf')
    }, 1000)
  }
}
