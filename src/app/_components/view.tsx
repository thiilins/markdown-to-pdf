'use client'

import { useConfig } from '@/hooks/use-config'
import { generatePDF } from '@/lib/pdf-utils'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { AppHeader } from './app-header'
import { DEFAULT_MARKDOWN } from './constants'
import { MarkdownEditor } from './markdown-editor'
import { PreviewPanel } from './preview-panel'
import { PrintStyle } from './print-style'

export default function HomeViewComponent() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN)
  const [zoom, setZoom] = useState(1)
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    config,
    updateConfig,
    updatePageSize,
    updateOrientation,
    resetConfig,
    applyMarginPreset,
    applyThemePreset,
  } = useConfig()

  // Função para abrir a caixa de impressão
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'documento-exportado',
    pageStyle: `@page {
      size: ${config.page.width} ${config.page.height};
      margin: ${config.page.margin.top} ${config.page.margin.right} ${config.page.margin.bottom} ${config.page.margin.left};
    }
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .print-content {
        transform: none !important;
        scale: 1 !important;
      }
    }`,
  })

  // Função para baixar PDF diretamente
  // Dentro de src/app/_components/view.tsx

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

    // Pegamos apenas o HTML interno (o conteúdo Markdown)
    // Usamos .prose para garantir que pegamos apenas o texto, sem wrappers extras
    const contentElement = contentRef.current.querySelector('.prose') || contentRef.current
    const htmlContent = contentElement.innerHTML

    // Feedback visual de carregamento
    // const toastId =
    //   (window as any).toast?.loading?.('Gerando PDF...', { duration: 10000 }) || 'loading-pdf'
    // Se não tiver toast configurado na window, pode usar um alert simples ou console.log provisório

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          config: config, // <--- IMPORTANTE: Enviando a configuração atual do usuário
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Erro na geração do PDF')
      }

      // Processa o download do arquivo
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'documento.pdf'
      document.body.appendChild(a)
      a.click()

      // Limpeza
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Sucesso (se estiver usando sonner/toast)
      // toast.success('PDF gerado com sucesso!', { id: toastId })
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar PDF. Verifique se o servidor está rodando corretamente.')
      // toast.error('Erro ao gerar PDF', { id: toastId })
    }
  }

  return (
    <div className='bg-background text-foreground flex h-screen flex-col overflow-hidden font-sans'>
      <AppHeader
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        config={config}
        onConfigChange={updateConfig}
        onPageSizeChange={updatePageSize}
        onOrientationChange={updateOrientation}
        onReset={resetConfig}
        onApplyMarginPreset={applyMarginPreset}
        onApplyThemePreset={applyThemePreset}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      <div className='flex min-h-0 flex-1'>
        {/* Editor - 40% */}
        <div className='flex h-full w-[40%] flex-col border-r'>
          <div className='border-border bg-muted/50 flex h-10 shrink-0 items-center border-b px-4'>
            <span className='text-muted-foreground text-sm font-medium'>Editor Markdown</span>
          </div>
          <div className='min-h-0 flex-1'>
            <MarkdownEditor
              value={markdown}
              onChange={(value) => setMarkdown(value || '')}
              config={config.editor}
            />
          </div>
        </div>

        {/* Preview - 60% */}
        <div className='flex h-full w-[60%] flex-col'>
          <div className='border-border bg-muted/50 flex h-10 shrink-0 items-center border-b px-4'>
            <span className='text-muted-foreground text-sm font-medium'>Preview</span>
          </div>
          <div className='min-h-0 flex-1'>
            <PreviewPanel
              markdown={markdown}
              pageConfig={config.page}
              typographyConfig={config.typography}
              themeConfig={config.theme}
              zoom={zoom}
              contentRef={contentRef}
            />
          </div>
        </div>
      </div>

      {/* Estilos de Impressão */}
      <PrintStyle config={config} />

      {/* Carregar fontes do Google */}
      <link
        rel='stylesheet'
        href={`https://fonts.googleapis.com/css2?${[
          ...new Set([
            config.typography.headings,
            config.typography.body,
            config.typography.code,
            config.typography.quote,
          ]),
        ]
          .map((font) => `family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700`)
          .join('&')}&display=swap`}
      />
    </div>
  )
}
