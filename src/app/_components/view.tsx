'use client'

import { useConfig } from '@/hooks/use-config'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { AppHeader } from './app-header'
import { DEFAULT_MARKDOWN } from './constants'
import { MarkdownEditor } from './markdown-editor'
import { PreviewPanel } from './preview-panel'
import { PrintStyle } from './print-style'
import { useLoading } from '@/contexts/loadingContext'
import moment from 'moment-timezone'
export default function HomeViewComponent() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN)
  const [zoom, setZoom] = useState(1)
  const now = () => moment().format('YYYY-MM-DD HH:mm:ss')
  // Ref para o container que envolve TODAS as páginas visuais
  const contentRef = useRef<HTMLDivElement>(null)
  const { setLoading } = useLoading()
  const {
    config,
    updateConfig,
    updatePageSize,
    updateOrientation,
    resetConfig,
    applyMarginPreset,
    applyThemePreset,
  } = useConfig()

  // Função para abrir a caixa de impressão (Navegador)
  // Imprime exatamente o que está na tela (as páginas fatiadas)
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `documento_${now()}`,
  })

  // src/app/_components/view.tsx

  const handleDownloadPDF = async () => {
    // CORREÇÃO: Usamos contentRef.current diretamente.
    // Ele contém as divs .print-page (páginas já quebradas e estilizadas visualmente).
    const sourceElement = contentRef.current

    if (!sourceElement) {
      alert('Conteúdo não encontrado para exportação.')
      return
    }

    // Pega o HTML interno (que contém as <div class="print-page">...</div>)
    const htmlContent = sourceElement.innerHTML
    setLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent, // Envia o HTML já paginado
          config: config, // Envia configs para definir tamanho da folha no @page
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Erro na geração do PDF')
      }

      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'documento.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setLoading(false)
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
