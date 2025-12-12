'use client'

import { useConfig } from '@/hooks/use-config'
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

  // Ref para o container que envolve TODAS as páginas visuais
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

  // Função para abrir a caixa de impressão (Navegador)
  // Imprime exatamente o que está na tela (as páginas fatiadas)
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'documento-exportado',
  })
  const handleDownloadPDF = async () => {
    const ghostElement = document.getElementById('source-html-for-pdf')

    const sourceElement = ghostElement || contentRef.current

    if (!sourceElement) {
      alert('Conteúdo não encontrado para exportação.')
      return
    }

    // Pega o HTML interno
    const htmlContent = sourceElement.innerHTML

    // Feedback visual simples no botão que foi clicado
    const btn = document.activeElement as HTMLButtonElement | null
    const originalText = btn?.innerText || ''
    if (btn) {
      btn.innerText = 'Gerando...'
      btn.disabled = true
      btn.style.cursor = 'wait'
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          config: config, // Envia a config atual (cores, fontes, etc)
        }),
      })
      console.log(JSON.stringify(config, null, 2))
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Erro na geração do PDF')
      }

      // 2. Extrai o nome do arquivo (com timestamp) enviado pelo servidor
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'documento.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      // 3. Transforma a resposta em Blob e força o download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename // Usa o nome correto (ex: documento_2023-10-10...)
      document.body.appendChild(a)
      a.click()

      // Limpeza da memória
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar PDF. Verifique se o backend está rodando corretamente.')
    } finally {
      // Restaura o botão para o estado original
      if (btn) {
        btn.innerText = originalText
        btn.disabled = false
        btn.style.cursor = 'pointer'
      }
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
