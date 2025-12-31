'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
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
  Quote,
  Redo,
  RefreshCcw,
  Search,
  Sparkles,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { CalloutsMenu, HeadingsToolbar, MarkdownToolbarItem, TableGenerator } from './actions'
import { useToolbarActions } from './useToolbarActions'

export function MarkdownToolbar({ editor, onResetEditorData }: MarkdownToolbarProps) {
  const { actions } = useToolbarActions(editor)

  // Estilo padrão para os botões da toolbar (seguindo o padrão do action-toolbar)
  const btnClass =
    'h-8 w-9 p-0 flex items-center justify-center transition-all hover:bg-accent hover:text-accent-foreground'

  return (
    <TooltipProvider>
      <div className='bg-background sticky top-0 z-20 flex w-full flex-col backdrop-blur-md'>
        <div className='flex h-12 w-full flex-1 flex-wrap items-center gap-1 px-2 py-1'>
          <div className='flex items-center border-r pr-1'>
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

          <div className='flex items-center border-r px-1'>
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

          <div className='flex items-center border-r px-1'>
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

          <div className='flex items-center border-r px-1'>
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
          </div>

          {/* Grupo 5: Utilitários e Ferramentas */}
          <div className='flex items-center border-r px-1'>
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
          </div>

          {/* Botão de Reset (separado visualmente) */}
          {onResetEditorData && (
            <>
              <MarkdownToolbarItem
                icon={RefreshCcw}
                tooltip='Resetar Tudo'
                onClick={onResetEditorData}
                className={cn(
                  btnClass,
                  'text-destructive hover:bg-destructive/10 hover:text-destructive',
                )}
              />
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
