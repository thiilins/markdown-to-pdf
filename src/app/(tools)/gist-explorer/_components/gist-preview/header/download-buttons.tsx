'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { ENVIROMENT } from '@/env'
import { cn } from '@/lib/utils'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { useGist } from '@/shared/contexts/gistContext'
import { CloudDownload, ImageUp, Loader2, Printer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { FaMarkdown } from 'react-icons/fa'
import { FaFilePdf } from 'react-icons/fa6'

interface DownloadGistButtonsProps {
  onDownloadOriginal: () => void
  onDownloadPackageMD: () => void
  handleDownloadPDF: () => void
  isMD: boolean
  isLoading: boolean
  handlePrint: () => void
  className?: string // Adicionado para controle externo
}

export const DownloadGistButtons = ({
  onDownloadOriginal,
  onDownloadPackageMD,
  handleDownloadPDF,
  isMD,
  isLoading,
  handlePrint,
  className,
}: DownloadGistButtonsProps) => {
  const { setCode } = useCodeSnapshot()
  const router = useRouter()
  const { selectedFile, fileContents } = useGist()
  const btnBaseClass =
    'h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors'

  const handleGenerateCodeSnapshot = useCallback(() => {
    const code = fileContents[selectedFile?.filename ?? '']
    if (!code) return
    setCode(code)
    router.push('/code-snapshot')
  }, [fileContents, selectedFile?.filename, setCode, router])
  return (
    <div
      className={cn(
        'bg-background/50 flex items-center rounded-md border p-0.5 shadow-sm backdrop-blur-sm',
        className,
      )}>
      {/* Grupo: Download Original */}
      <IconButtonTooltip
        content='Baixar Original'
        onClick={onDownloadOriginal}
        icon={CloudDownload}
        className={{ button: btnBaseClass }}
      />

      {/* Grupo: Markdown (Se aplicável) */}
      {isMD && (
        <IconButtonTooltip
          content='Baixar Markdown'
          onClick={onDownloadPackageMD}
          icon={FaMarkdown}
          className={{ button: btnBaseClass }}
        />
      )}

      <Separator orientation='vertical' className='mx-1 h-5' />

      {/* Grupo: Exportação */}
      {isMD && ENVIROMENT.ENABLE_EXPORT && (
        <IconButtonTooltip
          onClick={handleDownloadPDF}
          content={isLoading ? 'Processando...' : 'Exportar PDF'}
          disabled={isLoading}
          icon={isLoading ? Loader2 : FaFilePdf}
          className={{
            button: cn(
              btnBaseClass,
              isLoading && 'animate-spin cursor-not-allowed opacity-70',
              'hover:text-red-500', // Destaque sutil para PDF
            ),
          }}
        />
      )}

      {!isMD && (
        <IconButtonTooltip
          onClick={handleGenerateCodeSnapshot}
          content={isLoading ? 'Processando...' : 'Gerar Snapshot'}
          disabled={isLoading}
          icon={isLoading ? Loader2 : ImageUp}
          className={{
            button: cn(
              btnBaseClass,
              isLoading && 'animate-spin cursor-not-allowed opacity-70',
              'hover:text-blue-500', // Destaque sutil para PDF
            ),
          }}
        />
      )}
      <IconButtonTooltip
        onClick={handlePrint}
        content='Imprimir'
        icon={Printer}
        disabled={isLoading}
        className={{ button: btnBaseClass }}
      />
    </div>
  )
}
