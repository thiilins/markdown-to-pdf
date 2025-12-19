'use client'
import { generatePDF } from '@/app/actions/pdf'
import { ENVIROMENT } from '@/env'
import { toast } from 'sonner'

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

    const result = await generatePDF(htmlContent, config)

    if (!result.success) {
      throw new Error('Erro na geração do PDF')
    }

    const binaryString = window.atob(result.data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const blob = new Blob([bytes], { type: result.contentType || 'application/pdf' })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.pdf` || result.filename
    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

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
    toast.error('Erro ao gerar PDF. Tente novamente.', {
      id: 'download-pdf',
      style: {
        backgroundColor: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
      },
    })
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        toast.error(
          'Tempo de espera esgotado. O servidor pode estar em hot reload. Aguarde alguns segundos e tente novamente.',
          {
            id: 'download-pdf',
            style: {
              backgroundColor: 'var(--destructive)',
              color: 'var(--destructive-foreground)',
            },
          },
        )
      } else if (error.message.includes('hot reload') || error.message.includes('indisponível')) {
        alert(error.message)
      } else {
        alert(`Erro ao gerar PDF: ${error.message}`)
      }
    } else {
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  } finally {
    setTimeout(async () => {
      toast.dismiss('download-pdf')
    }, 1000)
  }
}
