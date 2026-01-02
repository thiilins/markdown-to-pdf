'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Bold,
  CheckSquare,
  Code,
  CodeXml,
  FileText,
  Image,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  MoreHorizontal,
  Quote,
  Redo,
  RefreshCcw,
  Search,
  Sparkles,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { useState } from 'react'
import { CalloutsMenu, HeadingsToolbar, MarkdownToolbarItem, TableGenerator } from './actions'
import { useToolbarActions } from './useToolbarActions'

export function MarkdownToolbar({ editor, onResetEditorData }: MarkdownToolbarProps) {
  const { actions } = useToolbarActions(editor)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  // Estilo padrão para os botões da toolbar
  const btnClass =
    'h-8 w-8 shrink-0 p-0 flex items-center justify-center transition-all hover:bg-accent hover:text-accent-foreground sm:w-9'

  // Botões principais (sempre visíveis)
  const primaryButtons = (
    <>
      {/* Grupo 1: Undo/Redo */}
      <div className='flex shrink-0 items-center border-r pr-1'>
        <MarkdownToolbarItem
          icon={Undo}
          tooltip='Desfazer (Ctrl+Z)'
          onClick={actions.undo}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={Redo}
          tooltip='Refazer (Ctrl+Y)'
          onClick={actions.redo}
          className={btnClass}
        />
      </div>

      {/* Grupo 2: Formatação de Texto */}
      <div className='flex shrink-0 items-center border-r px-1'>
        <HeadingsToolbar actions={actions} />
        <MarkdownToolbarItem
          icon={Bold}
          tooltip='Negrito (Ctrl+B)'
          onClick={actions.insertBold}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={Italic}
          tooltip='Itálico (Ctrl+I)'
          onClick={actions.insertItalic}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={Strikethrough}
          tooltip='Riscado (Ctrl+S)'
          onClick={actions.insertStrikethrough}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={Code}
          tooltip='Código Inline'
          onClick={actions.insertInlineCode}
          className={btnClass}
        />
      </div>

      {/* Grupo 3: Listas e Citações */}
      <div className='flex shrink-0 items-center border-r px-1'>
        <MarkdownToolbarItem
          icon={List}
          tooltip='Lista não ordenada'
          onClick={actions.insertUnorderedList}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={ListOrdered}
          tooltip='Lista ordenada'
          onClick={actions.insertOrderedList}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={CheckSquare}
          tooltip='Tarefa (Checkbox)'
          onClick={actions.insertCheckbox}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={Quote}
          tooltip='Citação'
          onClick={actions.insertBlockquote}
          className={btnClass}
        />
      </div>

      {/* Grupo 4: Inserções principais */}
      <div className='flex shrink-0 items-center border-r px-1'>
        <MarkdownToolbarItem
          icon={Link}
          tooltip='Inserir Link'
          onClick={actions.insertLink}
          className={btnClass}
        />
        <MarkdownToolbarItem
          icon={Image}
          tooltip='Inserir Imagem'
          onClick={actions.insertImage}
          className={btnClass}
        />
        <TableGenerator onInsert={actions.insertTableDynamic} />
        <CalloutsMenu onInsert={actions.insertCallout} />
      </div>
    </>
  )

  // Botões secundários (no menu "Mais" em mobile, visíveis em desktop)
  const secondaryButtons = (
    <>
      <MarkdownToolbarItem
        icon={CodeXml}
        tooltip='Bloco de Código'
        onClick={actions.insertCodeBlock}
        className={btnClass}
      />
      <MarkdownToolbarItem
        icon={Minus}
        tooltip='Linha Horizontal'
        onClick={actions.insertHorizontalRule}
        className={btnClass}
      />
      <MarkdownToolbarItem
        icon={ListChecks}
        tooltip='Gerar Sumário (TOC)'
        onClick={actions.generateTOC}
        className={btnClass}
      />
      <MarkdownToolbarItem
        icon={FileText}
        tooltip='Quebra de Página'
        onClick={actions.insertPageBreak}
        className={btnClass}
      />
      <MarkdownToolbarItem
        icon={Search}
        tooltip='Buscar (Ctrl+F)'
        onClick={actions.openFind}
        className={btnClass}
      />
      <MarkdownToolbarItem
        icon={Sparkles}
        tooltip='Formatar (Prettier)'
        onClick={actions.formatDocument}
        className={btnClass}
      />
    </>
  )

  return (
    <TooltipProvider>
      <div className='bg-background sticky top-0 z-20 flex w-full flex-col border-b backdrop-blur-md'>
        <div className='flex h-auto min-h-12 w-full flex-wrap items-center gap-1 px-2 py-1'>
          {primaryButtons}

          {/* Botões secundários: sempre visíveis em desktop, quebram linha se necessário */}
          <div className='hidden shrink-0 items-center border-r px-1 md:flex'>
            {secondaryButtons}
          </div>

          {/* Menu "Mais" para mobile (apenas em telas muito pequenas) */}
          <div className='flex shrink-0 items-center border-r px-1 md:hidden'>
            <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          btnClass,
                          'rounded-md',
                          moreMenuOpen && 'bg-accent text-accent-foreground',
                        )}>
                        <MoreHorizontal className='h-4 w-4' />
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side='bottom' className='px-2 py-1 text-[12px] font-medium'>
                    Mais opções
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenuContent
                align='end'
                collisionPadding={16}
                className='w-56 max-w-[calc(100vw-2rem)] p-1.5'>
                <div className='text-muted-foreground mb-1 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
                  Mais Ferramentas
                </div>
                <DropdownMenuItem
                  onClick={() => {
                    actions.insertCodeBlock()
                    setMoreMenuOpen(false)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs'>
                  <CodeXml className='h-4 w-4' />
                  <span>Bloco de Código</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    actions.insertHorizontalRule()
                    setMoreMenuOpen(false)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs'>
                  <Minus className='h-4 w-4' />
                  <span>Linha Horizontal</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    actions.generateTOC()
                    setMoreMenuOpen(false)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs'>
                  <ListChecks className='h-4 w-4' />
                  <span>Gerar Sumário (TOC)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    actions.insertPageBreak()
                    setMoreMenuOpen(false)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs'>
                  <FileText className='h-4 w-4' />
                  <span>Quebra de Página</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    actions.openFind()
                    setMoreMenuOpen(false)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs'>
                  <Search className='h-4 w-4' />
                  <span>Buscar (Ctrl+F)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    actions.formatDocument()
                    setMoreMenuOpen(false)
                  }}
                  className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs'>
                  <Sparkles className='h-4 w-4' />
                  <span>Formatar (Prettier)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Botão de Reset (separado visualmente) */}
          {onResetEditorData && (
            <div className='flex shrink-0 items-center pl-1'>
              <MarkdownToolbarItem
                icon={RefreshCcw}
                tooltip='Resetar Tudo'
                onClick={onResetEditorData}
                className={cn(
                  btnClass,
                  'text-destructive hover:bg-destructive/10 hover:text-destructive',
                )}
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
