'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { ENVIROMENT } from '@/env'
import { cn } from '@/lib/utils'
import { CloudDownload, Loader2, Printer } from 'lucide-react'
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
  const btnBaseClass =
    'h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors'

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
