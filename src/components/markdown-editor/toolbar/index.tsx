'use client'

import { TooltipProvider } from '@/components/ui/tooltip'

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
import { CalloutsMenu, MarkdownToolbarItem, TableGenerator } from './actions'
import { useToolbarActions } from './useToolbarActions'

export function MarkdownToolbar({ editor, onResetEditorData }: MarkdownToolbarProps) {
  const { actions } = useToolbarActions(editor)
  const options: ToolbarOption[] = [
    { type: 'action', icon: Undo, tooltip: 'Desfazer (Ctrl+Z)', onClick: actions.undo },
    { type: 'action', icon: Redo, tooltip: 'Refazer (Ctrl+Y)', onClick: actions.redo },
    {
      type: 'action',
      icon: CodeXml,
      tooltip: 'Código block',
      onClick: actions.insertCodeBlock,
    },
    {
      type: 'action',
      icon: CheckSquare,
      tooltip: 'Checkbox',
      onClick: actions.insertCheckbox,
    },
    {
      type: 'action',
      icon: List,
      tooltip: 'Lista não ordenada',
      onClick: actions.insertUnorderedList,
    },
    {
      type: 'action',
      icon: ListOrdered,
      tooltip: 'Lista ordenada',
      onClick: actions.insertOrderedList,
    },
    {
      type: 'action',
      icon: Quote,
      tooltip: 'Citação',
      onClick: actions.insertBlockquote,
    },
    { type: 'action', icon: Link, tooltip: 'Link', onClick: actions.insertLink },
    { type: 'action', icon: Image, tooltip: 'Imagem', onClick: actions.insertImage },
    { type: 'action', icon: ListChecks, tooltip: 'TOC', onClick: actions.generateTOC },
    { type: 'action', icon: Bold, tooltip: 'Negrito (Ctrl+B)', onClick: actions.insertBold },
    { type: 'action', icon: Italic, tooltip: 'Itálico (Ctrl+I)', onClick: actions.insertItalic },
    {
      type: 'action',
      icon: Strikethrough,
      tooltip: 'Riscado (Ctrl+S)',
      onClick: actions.insertStrikethrough,
    },
    {
      type: 'action',
      icon: Code,
      tooltip: 'Código inline',
      onClick: actions.insertInlineCode,
    },
    {
      type: 'action',
      icon: Minus,
      tooltip: 'Linha horizontal',
      onClick: actions.insertHorizontalRule,
    },
    {
      type: 'action',
      icon: FileText,
      tooltip: 'Quebra de página',
      onClick: actions.insertPageBreak,
    },

    {
      type: 'component',
      component: <TableGenerator onInsert={actions.insertTableDynamic} key='table-generator' />,
    },
    {
      type: 'component',
      component: <CalloutsMenu onInsert={actions.insertCallout} key='callouts-menu' />,
    },

    {
      type: 'component',
      component: (
        <MarkdownToolbarItem
          icon={RefreshCcw}
          key='reset-editor-data'
          tooltip='Resetar Markdown'
          onClick={onResetEditorData}
        />
      ),
      condition: onResetEditorData !== undefined,
    },
    {
      type: 'action',
      icon: Sparkles,
      tooltip: 'Formatar com Prettier (Shift+Alt+F)',
      onClick: actions.formatDocument,
    },
    {
      type: 'action',
      icon: Search,
      tooltip: 'Buscar (Ctrl+F)',
      onClick: actions.openFind,
    },
  ]
  return (
    <TooltipProvider>
      <div className='border-border bg-muted/30 flex border-b'>
        <div className='flex min-w-0 flex-1 flex-wrap items-start justify-start gap-1.5 px-1.5 py-1.5'>
          {options.map((option: ToolbarOption) => {
            if (option.type === 'action') {
              return (
                <MarkdownToolbarItem
                  key={option.tooltip}
                  icon={option.icon}
                  tooltip={option.tooltip}
                  onClick={option.onClick}
                />
              )
            }
            if (option.type === 'separator') {
              return <div className='h-1 w-1 bg-gray-300' />
            }
            if (
              option.type === 'component' &&
              (option.condition || option.condition === undefined)
            ) {
              return option.component
            }
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
