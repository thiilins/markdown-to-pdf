'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { ZoomButtonsComponent } from '@/components/layout-components/zoom-buttons'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ENVIROMENT } from '@/env'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import {
  ChevronLeft,
  ChevronRight,
  CloudDownload,
  Edit,
  FileDown,
  Github,
  Loader2,
  Maximize2,
  Plus,
  Printer,
  RefreshCcw,
  Save,
  Trash,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FilesManager } from './editor-files-manager'
import { HeaderFooterBtns } from './header-footer-btns'
import { CreateMetaModal } from './modals/create-meta-modal'
import { DeleteDocumentModal } from './modals/delete-document-modal'
import { DownloadDocumentModal } from './modals/download-document-modal'
import { EditMetaModal } from './modals/edit-meta-modal'
import { ImportUrlButton } from './modals/import-url-modal'

interface EnableTools {
  additional?: { component: React.ReactNode }[]
  headerFooter?: boolean
}

/**
 * Componente profissional de toolbar com scroll horizontal
 * - Scrollbar sutil mas visível para desktop
 * - Botões de navegação quando há scroll disponível
 * - Gradientes como indicadores visuais adicionais
 * - Suporte a gestos de toque em mobile
 */
function ToolbarWithScrollIndicators({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)

  const updateScrollState = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const hasScroll = scrollWidth > clientWidth
    const canLeft = scrollLeft > 0
    const canRight = scrollLeft < scrollWidth - clientWidth - 1

    setCanScrollLeft(canLeft)
    setCanScrollRight(canRight)
    setShowNavigation(hasScroll)
  }

  const scrollLeft = () => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    // Atualiza na montagem e redimensionamento
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    scrollElement.addEventListener('scroll', updateScrollState)

    // Observer para detectar mudanças no conteúdo
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(scrollElement)

    return () => {
      window.removeEventListener('resize', updateScrollState)
      scrollElement.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className='relative flex h-14 w-full items-center'>
      {/* Botão de navegação esquerdo */}
      {showNavigation && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className='bg-background/80 hover:bg-background absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-r-md p-1.5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg active:scale-95'
          aria-label='Rolar para esquerda'>
          <ChevronLeft className='text-foreground h-4 w-4' />
        </button>
      )}

      {/* Gradiente esquerdo (indicador visual sutil) */}
      {canScrollLeft && (
        <div className='from-background/95 via-background/60 pointer-events-none absolute top-0 left-0 z-10 h-full w-8 bg-gradient-to-r to-transparent transition-opacity duration-200' />
      )}

      {/* Container com scroll (scrollbar oculta, navegação via botões) */}
      <div
        ref={scrollRef}
        className='no-scrollbar flex h-full w-full touch-pan-x items-center gap-2 overflow-x-auto scroll-smooth px-3'>
        {children}
      </div>

      {/* Gradiente direito (indicador visual sutil) */}
      {canScrollRight && (
        <div className='from-background/95 via-background/60 pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l to-transparent transition-opacity duration-200' />
      )}

      {/* Botão de navegação direito */}
      {showNavigation && canScrollRight && (
        <button
          onClick={scrollRight}
          className='bg-background/80 hover:bg-background absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-l-md p-1.5 shadow-md backdrop-blur-sm transition-all hover:shadow-lg active:scale-95'
          aria-label='Rolar para direita'>
          <ChevronRight className='text-foreground h-4 w-4' />
        </button>
      )}
    </div>
  )
}

export const ActionToolbar = ({ additional, headerFooter }: EnableTools) => {
  const { onResetZoom, onPrint, onDownloadPDF, isLoading, disabledDownload } = useApp()
  const { data: session, status: sessionStatus } = useSession()
  const {
    onResetMarkdown,
    setOpenCreateMeta,
    setOpenEditMeta,
    setOpenDeleteDocument,
    setOpenDownloadDocument,
    isGistMode,
    canSaveGist,
    currentGistId,
    gistMetadataMap,
    onUpdateGist,
    onSaveAsGist,
  } = useMarkdown()

  const isAuthenticated = sessionStatus === 'authenticated'

  const gistName = useMemo(() => {
    if (!isGistMode || !currentGistId) return null
    const metadata = Object.values(gistMetadataMap).find((meta) => meta.gistId === currentGistId)
    return metadata?.description || currentGistId.slice(0, 8)
  }, [isGistMode, currentGistId, gistMetadataMap])

  // Estilo padrão garantindo que o ícone não encolha (shrink-0)
  const btnClass =
    'h-9 w-9 p-0 flex items-center justify-center shrink-0 transition-all hover:bg-accent hover:text-accent-foreground'

  return (
    <div className='bg-background/95 sticky top-0 z-10 flex w-full flex-col border-b backdrop-blur-md'>
      {/* Status Bar do Gist - Agora com tratamento de overflow lateral */}
      {isGistMode && (
        <div className='bg-primary/5 animate-in fade-in slide-in-from-top-1 no-scrollbar flex h-9 w-full items-center justify-between overflow-x-auto border-b px-4'>
          <div className='flex shrink-0 items-center gap-2'>
            <Badge
              variant='outline'
              className='bg-background border-primary/20 gap-1.5 py-1 font-normal whitespace-nowrap'>
              <FaGithub className='text-primary h-3.5 w-3.5' />
              <span className='text-[11px]'>
                Editando Gist: <strong className='font-semibold'>{gistName}</strong>
              </span>
              {!canSaveGist && (
                <span className='text-muted-foreground ml-1 text-[10px]'>(View Mode)</span>
              )}
            </Badge>
          </div>

          <div className='flex shrink-0 items-center pl-4'>
            <IconButtonTooltip
              variant='ghost'
              icon={Save}
              onClick={onUpdateGist}
              content={canSaveGist ? 'Atualizar Gist no GitHub' : 'Salvar como Novo Gist'}
              className={{ button: cn(btnClass, 'text-primary hover:bg-primary/10 h-7 w-9') }}
            />
          </div>
        </div>
      )}

      {/* Toolbar Principal com Scroll Horizontal e Indicadores Visuais Dinâmicos */}
      <ToolbarWithScrollIndicators>
        {/* Grupo: Arquivos */}
        <div className='flex shrink-0 items-center gap-1'>
          <IconButtonTooltip
            variant='ghost'
            icon={Plus}
            onClick={() => setOpenCreateMeta(true)}
            content='Novo arquivo'
            className={{ button: btnClass }}
          />
          {/* FilesManager com largura responsiva */}
          <div className='min-w-[120px] shrink-0 sm:min-w-[180px] md:min-w-[240px]'>
            <FilesManager />
          </div>
          <IconButtonTooltip
            variant='ghost'
            icon={Edit}
            onClick={() => setOpenEditMeta(true)}
            content='Renomear/Editar'
            className={{ button: btnClass }}
          />
          <IconButtonTooltip
            variant='ghost'
            icon={Trash}
            onClick={() => setOpenDeleteDocument(true)}
            content='Deletar'
            className={{
              button: cn(
                btnClass,
                'text-destructive hover:bg-destructive/10 hover:text-destructive',
              ),
            }}
          />
        </div>

        <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />

        {/* Grupo: Visualização */}
        <div className='flex shrink-0 items-center gap-1'>
          <ZoomButtonsComponent />
          <IconButtonTooltip
            variant='ghost'
            icon={Maximize2}
            onClick={onResetZoom}
            content='Resetar Zoom'
            className={{ button: btnClass }}
          />
        </div>

        <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />

        {/* Grupo: Exportação */}
        <div className='flex shrink-0 items-center gap-1'>
          <IconButtonTooltip
            variant='ghost'
            icon={FileDown}
            onClick={() => setOpenDownloadDocument(true)}
            content='Exportar como...'
            className={{ button: btnClass }}
          />
          <IconButtonTooltip
            variant='ghost'
            icon={Printer}
            onClick={() => onPrint()}
            content='Imprimir'
            className={{ button: btnClass }}
          />
          <IconButtonTooltip
            variant='ghost'
            onClick={onDownloadPDF}
            content='Gerar PDF'
            className={{
              button: btnClass,
              icon: isLoading ? 'animate-spin' : '',
            }}
            icon={isLoading ? Loader2 : CloudDownload}
            hide={!ENVIROMENT.ENABLE_EXPORT || disabledDownload}
            disabled={isLoading || disabledDownload}
          />
          <div className='shrink-0'>
            <ImportUrlButton />
          </div>
        </div>

        <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />

        {/* Grupo: Sincronização & Reset */}
        <div className='flex shrink-0 items-center gap-1'>
          {isAuthenticated && (
            <IconButtonTooltip
              variant='ghost'
              icon={Github}
              onClick={onSaveAsGist}
              content='Sincronizar Gist'
              className={{ button: cn(btnClass, 'hover:text-primary') }}
            />
          )}
          <IconButtonTooltip
            variant='ghost'
            icon={RefreshCcw}
            content='Limpar Editor'
            onClick={onResetMarkdown}
            className={{ button: btnClass }}
          />

          {headerFooter && (
            <>
              <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />
              <div className='shrink-0'>
                <HeaderFooterBtns />
              </div>
            </>
          )}

          {/* Componentes Adicionais */}
          {additional && additional.length > 0 && (
            <div className='ml-1 flex shrink-0 items-center gap-2 border-l pl-2'>
              {additional.map((item, idx) => (
                <div key={`additional-${idx}`} className='shrink-0'>
                  {item.component}
                </div>
              ))}
            </div>
          )}
        </div>
      </ToolbarWithScrollIndicators>

      {/* Modais */}
      <div className='hidden'>
        <DeleteDocumentModal />
        <DownloadDocumentModal />
        <EditMetaModal />
        <CreateMetaModal />
      </div>
    </div>
  )
}
