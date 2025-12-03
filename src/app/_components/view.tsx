'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
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
  const [zoom, setZoom] = useState(0.7)
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
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

    try {
      await generatePDF(contentRef.current, config.page, 'documento-exportado.pdf', config.theme)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Por favor, tente novamente.')
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

      <ResizablePanelGroup direction='horizontal' className='flex-1'>
        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className='border-border bg-background flex h-full flex-col border-r'>
            <div className='border-border bg-muted/50 flex h-10 items-center border-b px-4'>
              <span className='text-muted-foreground text-sm font-medium'>Editor Markdown</span>
            </div>
            <div className='flex-1 overflow-hidden'>
              <MarkdownEditor
                value={markdown}
                onChange={(value) => setMarkdown(value || '')}
                config={config.editor}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
          <div className='bg-muted/30 flex h-full flex-col'>
            <div className='border-border bg-muted/50 flex h-10 items-center border-b px-4'>
              <span className='text-muted-foreground text-sm font-medium'>Preview</span>
            </div>
            <div className='flex-1 overflow-hidden'>
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
        </ResizablePanel>
      </ResizablePanelGroup>

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
