'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Copy, Download, MoreVertical, RefreshCcw, Trash2 } from 'lucide-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'

export type ToolShellLayout = 'split' | 'tabs' | 'single' | 'resizable'
export type ToolShellOrientation = 'horizontal' | 'vertical'

export interface ToolShellAction {
  label: string
  icon?: React.ElementType
  onClick: () => void | Promise<void>
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive'
  disabled?: boolean
  tooltip?: string
}

export interface ToolShellStat {
  label: string
  value: string | number
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export interface ToolShellProps {
  // Informações básicas
  title: string
  description?: string
  icon?: React.ElementType

  // Layout
  layout?: ToolShellLayout
  orientation?: ToolShellOrientation
  defaultPanelSizes?: number[] // Para resizable layout

  // Labels
  inputLabel?: string
  outputLabel?: string
  inputPlaceholder?: string
  outputPlaceholder?: string

  // Componentes principais
  inputComponent: ReactNode
  outputComponent: ReactNode

  // Ações
  actions?: ToolShellAction[]
  primaryAction?: ToolShellAction
  showCopyButton?: boolean
  showDownloadButton?: boolean
  showClearButton?: boolean
  showResetButton?: boolean

  // Callbacks
  onCopyOutput?: () => void | Promise<void>
  onDownloadOutput?: () => void | Promise<void>
  onClear?: () => void
  onReset?: () => void

  // Slots customizáveis
  headerSlot?: ReactNode
  footerSlot?: ReactNode
  sidebarSlot?: ReactNode
  inputHeaderSlot?: ReactNode
  outputHeaderSlot?: ReactNode

  // Estatísticas
  stats?: ToolShellStat[]

  // Opções
  hideHeader?: boolean
  hideInputLabel?: boolean
  hideOutputLabel?: boolean
  fullHeight?: boolean
  className?: string
  inputClassName?: string
  outputClassName?: string

  // Mobile
  mobileTabs?: boolean
  mobileDefaultTab?: 'input' | 'output'
}

export function ToolShell({
  title,
  description,
  icon: Icon,
  layout = 'split',
  orientation = 'horizontal',
  defaultPanelSizes = [50, 50],
  inputLabel = 'Input',
  outputLabel = 'Output',
  inputPlaceholder,
  outputPlaceholder,
  inputComponent,
  outputComponent,
  actions = [],
  primaryAction,
  showCopyButton = true,
  showDownloadButton = false,
  showClearButton = true,
  showResetButton = false,
  onCopyOutput,
  onDownloadOutput,
  onClear,
  onReset,
  headerSlot,
  footerSlot,
  sidebarSlot,
  inputHeaderSlot,
  outputHeaderSlot,
  stats = [],
  hideHeader = false,
  hideInputLabel = false,
  hideOutputLabel = false,
  fullHeight = true,
  className,
  inputClassName,
  outputClassName,
  mobileTabs = true,
  mobileDefaultTab = 'input',
}: ToolShellProps) {
  const [isDesktop, setIsDesktop] = useState(true)
  const [mobileTab, setMobileTab] = useState<'input' | 'output'>(mobileDefaultTab)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const handleCopy = async () => {
    try {
      if (onCopyOutput) {
        await onCopyOutput()
      }
      toast.success('Copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar')
    }
  }

  const handleDownload = async () => {
    try {
      if (onDownloadOutput) {
        await onDownloadOutput()
      }
    } catch (error) {
      toast.error('Erro ao baixar')
    }
  }

  const handleClear = () => {
    if (onClear) {
      onClear()
      toast.success('Limpo com sucesso!')
    }
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
      toast.success('Resetado com sucesso!')
    }
  }

  // Renderizar ações
  const renderActions = () => {
    const actionButtons: ReactNode[] = []

    if (showCopyButton && onCopyOutput) {
      actionButtons.push(
        <IconButtonTooltip
          key='copy'
          variant='ghost'
          icon={Copy}
          onClick={handleCopy}
          content='Copiar'
          className={{ button: 'h-8 w-8' }}
        />,
      )
    }

    if (showDownloadButton && onDownloadOutput) {
      actionButtons.push(
        <IconButtonTooltip
          key='download'
          variant='ghost'
          icon={Download}
          onClick={handleDownload}
          content='Baixar'
          className={{ button: 'h-8 w-8' }}
        />,
      )
    }

    if (showClearButton && onClear) {
      actionButtons.push(
        <IconButtonTooltip
          key='clear'
          variant='ghost'
          icon={Trash2}
          onClick={handleClear}
          content='Limpar'
          className={{ button: 'text-destructive hover:text-destructive h-8 w-8' }}
        />,
      )
    }

    if (showResetButton && onReset) {
      actionButtons.push(
        <IconButtonTooltip
          key='reset'
          variant='ghost'
          icon={RefreshCcw}
          onClick={handleReset}
          content='Resetar'
          className={{ button: 'h-8 w-8' }}
        />,
      )
    }

    // Ações customizadas
    actions.forEach((action, index) => {
      const ActionIcon = action.icon
      actionButtons.push(
        <IconButtonTooltip
          key={`action-${index}`}
          variant={action.variant || 'ghost'}
          icon={ActionIcon || MoreVertical}
          onClick={action.onClick}
          content={action.tooltip || action.label}
          disabled={action.disabled}
          className={{ button: 'h-8 w-8' }}
        />,
      )
    })

    // Ação primária
    if (primaryAction) {
      const PrimaryIcon = primaryAction.icon
      actionButtons.push(
        <Button
          key='primary'
          variant={primaryAction.variant || 'default'}
          onClick={primaryAction.onClick}
          disabled={primaryAction.disabled}
          className='h-8'>
          {PrimaryIcon && <PrimaryIcon className='mr-2 h-4 w-4' />}
          {primaryAction.label}
        </Button>,
      )
    }

    return actionButtons
  }

  // Renderizar header
  const renderHeader = () => {
    if (hideHeader) return null

    const hasActions = renderActions().length > 0
    const hasStats = stats.length > 0
    const hasHeaderSlot = !!headerSlot

    return (
      <div className='bg-muted/30 flex shrink-0 flex-col border-b sm:flex-row sm:items-center sm:justify-between'>
        {/* Título e Descrição */}
        <div className='flex items-center gap-3 px-4 py-3 sm:py-3'>
          {Icon && <Icon className='text-primary h-5 w-5 shrink-0' />}
          <div className='flex min-w-0 flex-col'>
            <h1 className='truncate text-base font-semibold tracking-tight sm:text-lg'>{title}</h1>
            {description && <p className='text-muted-foreground truncate text-xs'>{description}</p>}
          </div>
        </div>

        {/* Estatísticas, Ações e Slot */}
        {(hasStats || hasActions || hasHeaderSlot) && (
          <div className='flex flex-row justify-between gap-2 border-t px-4 py-2 sm:items-center sm:justify-start sm:gap-2 sm:border-t-0'>
            {/* Estatísticas */}
            {hasStats && (
              <div className='flex flex-wrap items-center gap-1.5 sm:flex-nowrap'>
                {stats.map((stat, index) => (
                  <Badge
                    key={index}
                    variant={stat.variant || 'outline'}
                    className='shrink-0 text-xs'>
                    {stat.label}:{stat.value}
                  </Badge>
                ))}
              </div>
            )}

            {/* Separador (apenas desktop) */}
            {hasStats && hasActions && (
              <Separator orientation='vertical' className='hidden h-6 sm:block' />
            )}

            {/* Ações */}
            {hasActions && <div className='flex items-center gap-1'>{renderActions()}</div>}

            {/* Slot customizado */}
            {hasHeaderSlot && (
              <>
                {(hasStats || hasActions) && (
                  <Separator orientation='vertical' className='hidden h-6 sm:block' />
                )}
                <div className='flex items-center'>{headerSlot}</div>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Renderizar input header
  const renderInputHeader = () => {
    if (hideInputLabel && !inputHeaderSlot && !showClearButton) return null

    return (
      <div className='flex items-center justify-between px-3 py-2'>
        {!hideInputLabel && (
          <span className='text-muted-foreground text-xs font-medium'>{inputLabel}</span>
        )}
        <div className='flex items-center gap-1'>
          {inputHeaderSlot}
          {showClearButton && onClear && (
            <IconButtonTooltip
              variant='ghost'
              icon={Trash2}
              onClick={handleClear}
              content='Limpar'
              className={{ button: 'h-7 w-7 text-xs' }}
            />
          )}
        </div>
      </div>
    )
  }

  // Renderizar output header
  const renderOutputHeader = () => {
    if (hideOutputLabel && !outputHeaderSlot && !showCopyButton) return null

    return (
      <div className='flex items-center justify-between px-3 py-2'>
        {!hideOutputLabel && (
          <span className='text-muted-foreground text-xs font-medium'>{outputLabel}</span>
        )}
        <div className='flex items-center gap-1'>
          {outputHeaderSlot}
          {showCopyButton && onCopyOutput && (
            <IconButtonTooltip
              variant='ghost'
              icon={Copy}
              onClick={handleCopy}
              content='Copiar'
              className={{ button: 'h-7 w-7 text-xs' }}
            />
          )}
        </div>
      </div>
    )
  }

  // Layout: Single (apenas input ou output)
  if (layout === 'single') {
    return (
      <div
        className={cn(
          'bg-background flex flex-col overflow-hidden',
          fullHeight && 'h-[calc(100vh-4rem)]',
          className,
        )}>
        {renderHeader()}
        <div className='flex flex-1 overflow-hidden'>
          {sidebarSlot && (
            <>
              <div className='bg-muted/20 w-64 shrink-0 border-r'>{sidebarSlot}</div>
              <Separator orientation='vertical' />
            </>
          )}
          <div className='flex flex-1 flex-col overflow-hidden'>
            {renderInputHeader()}
            <div className={cn('flex-1 overflow-auto', inputClassName)}>{inputComponent}</div>
          </div>
        </div>
        {footerSlot}
      </div>
    )
  }

  // Layout: Tabs (mobile ou desktop)
  const useTabs = layout === 'tabs' || (!isDesktop && mobileTabs)

  if (useTabs) {
    return (
      <div
        className={cn(
          'bg-background flex flex-col overflow-hidden',
          fullHeight && 'h-[calc(100vh-4rem)]',
          className,
        )}>
        {renderHeader()}
        <Tabs
          value={mobileTab}
          onValueChange={(v) => setMobileTab(v as 'input' | 'output')}
          className='flex flex-1 flex-col overflow-hidden'>
          <div className='bg-muted/20 flex shrink-0 items-center border-b px-2 py-1'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='input' className='text-xs'>
                {inputLabel}
              </TabsTrigger>
              <TabsTrigger value='output' className='text-xs'>
                {outputLabel}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value='input'
            className='mt-0 flex-1 overflow-hidden data-[state=active]:flex'>
            <div className='flex h-full w-full flex-col'>
              {renderInputHeader()}
              <div className={cn('flex-1 w-full overflow-auto', inputClassName)}>{inputComponent}</div>
            </div>
          </TabsContent>

          <TabsContent
            value='output'
            className='mt-0 flex-1 overflow-hidden data-[state=active]:flex'>
            <div className='flex h-full w-full flex-col'>
              {renderOutputHeader()}
              <div className={cn('flex-1 w-full overflow-auto', outputClassName)}>{outputComponent}</div>
            </div>
          </TabsContent>
        </Tabs>
        {footerSlot}
      </div>
    )
  }

  // Layout: Resizable (painéis redimensionáveis)
  // No mobile com mobileTabs, usar tabs em vez de resizable
  if (layout === 'resizable' && (isDesktop || !mobileTabs)) {
    const PanelGroup = orientation === 'horizontal' ? ResizablePanelGroup : ResizablePanelGroup
    const direction = orientation === 'horizontal' ? 'horizontal' : 'vertical'

    return (
      <div
        className={cn(
          'bg-background flex flex-col overflow-hidden',
          fullHeight && 'h-[calc(100vh-4rem)]',
          className,
        )}>
        {renderHeader()}
        <PanelGroup direction={direction as any} className='flex-1'>
          {/* Sidebar (se fornecido) */}
          {sidebarSlot && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className='bg-muted/20'>
                {sidebarSlot}
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Input Panel */}
          <ResizablePanel
            defaultSize={defaultPanelSizes[0]}
            minSize={25}
            maxSize={75}
            className='bg-background'>
            <div className='flex h-full flex-col'>
              {renderInputHeader()}
              <div className={cn('flex-1 overflow-auto', inputClassName)}>{inputComponent}</div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Output Panel */}
          <ResizablePanel
            defaultSize={defaultPanelSizes[1]}
            minSize={25}
            maxSize={75}
            className='bg-background'>
            <div className='flex h-full flex-col'>
              {renderOutputHeader()}
              <div className={cn('flex-1 overflow-auto', outputClassName)}>{outputComponent}</div>
            </div>
          </ResizablePanel>
        </PanelGroup>
        {footerSlot}
      </div>
    )
  }

  // Layout: Split (padrão - grid simples)
  return (
    <div
      className={cn(
        'bg-background flex flex-col overflow-hidden',
        fullHeight && 'h-[calc(100vh-4rem)]',
        className,
      )}>
      {renderHeader()}
      <div className='grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-2'>
        {/* Input */}
        <Card className='border-muted flex flex-col overflow-hidden'>
          {renderInputHeader()}
          <div className={cn('flex-1 overflow-auto', inputClassName)}>{inputComponent}</div>
        </Card>

        {/* Output */}
        <Card className='border-muted bg-muted/30 flex flex-col overflow-hidden'>
          {renderOutputHeader()}
          <div className={cn('flex-1 overflow-auto', outputClassName)}>{outputComponent}</div>
        </Card>
      </div>
      {footerSlot}
    </div>
  )
}
