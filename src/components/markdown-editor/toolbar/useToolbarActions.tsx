import * as prettierMarkdown from 'prettier/plugins/markdown'
import * as prettier from 'prettier/standalone'
import { useCallback } from 'react'
import type { IToolbarActions } from '../../../shared/@types/markdown-toolbar'
import {
  BLOCKQUOTE,
  BOLD,
  CALLOUT_CAUTION,
  CALLOUT_IMPORTANT,
  CALLOUT_NOTE,
  CALLOUT_TIP,
  CALLOUT_WARNING,
  CHECKBOX,
  CODE_BLOCK,
  generateTable,
  HORIZONTAL_RULE,
  IMAGE,
  INLINE_CODE,
  ITALIC,
  LINK,
  ORDERED_LIST,
  PAGE_BREAK,
  STRIKETHROUGH,
  TABLE,
  UNORDERED_LIST,
} from './constants'

interface IUseToolbarActions {
  insertText: (...props: string[]) => void
  insertAtLineStart: (text: string) => void
  insertBlock: (text: string) => void
  actions: IToolbarActions
}

/**
 * Hook customizado para gerenciar ações do toolbar do editor Markdown
 * Abstrai toda a lógica de inserção de texto, blocos e formatação
 */
export const useToolbarActions = (editor: any): IUseToolbarActions => {
  const insertText = useCallback(
    (...props: string[]) => {
      if (!editor) return
      const [before, after, placeholder] = props
      const selection = editor.getSelection()
      if (!selection) return

      const selectedText = editor.getModel()?.getValueInRange(selection) || ''
      const textToInsert =
        placeholder && !selectedText
          ? `${before}${placeholder}${after}`
          : `${before}${selectedText}${after}`

      editor.executeEdits('markdown-format', [
        {
          range: selection,
          text: textToInsert,
        },
      ])

      // Ajusta a seleção após inserção
      if (placeholder && !selectedText) {
        const newPosition = {
          lineNumber: selection.startLineNumber,
          column: selection.startColumn + before.length + placeholder.length,
        }
        editor.setPosition(newPosition)
        editor.setSelection({
          startLineNumber: newPosition.lineNumber,
          startColumn: newPosition.column - placeholder.length,
          endLineNumber: newPosition.lineNumber,
          endColumn: newPosition.column,
        })
      } else {
        const newPosition = {
          lineNumber: selection.startLineNumber,
          column: selection.startColumn + before.length + selectedText.length + after.length,
        }
        editor.setPosition(newPosition)
      }

      editor.focus()
    },
    [editor],
  )
  const insertAtLineStart = useCallback(
    (text: string) => {
      if (!editor) return
      const selection = editor.getSelection()
      if (!selection) return

      const model = editor.getModel()
      if (!model) return

      const startLine = selection.startLineNumber
      const endLine = selection.endLineNumber

      const edits: any[] = []

      for (let line = startLine; line <= endLine; line++) {
        const lineText = model.getLineContent(line)
        const insertColumn = 1
        edits.push({
          range: {
            startLineNumber: line,
            startColumn: insertColumn,
            endLineNumber: line,
            endColumn: insertColumn,
          },
          text: text,
        })
      }

      editor.executeEdits('markdown-format', edits)
      editor.focus()
    },
    [editor],
  )

  const insertBlock = useCallback(
    (text: string) => {
      if (!editor) return
      const selection = editor.getSelection()
      if (!selection) return

      const model = editor.getModel()
      if (!model) return

      const startLine = selection.startLineNumber
      const endLine = selection.endLineNumber
      const lineCount = endLine - startLine + 1

      const blockText = text.split('\n')
      const edits: any[] = []

      // Insere antes da primeira linha
      edits.push({
        range: {
          startLineNumber: startLine,
          startColumn: 1,
          endLineNumber: startLine,
          endColumn: 1,
        },
        text: blockText.join('\n') + '\n',
      })

      editor.executeEdits('markdown-format', edits)
      editor.focus()
    },
    [editor],
  )

  /**
   * Insere um callout/admonition (GitHub Flavored Markdown)
   * Suporta: NOTE, TIP, IMPORTANT, WARNING, CAUTION
   */

  /**
   * Gera e insere uma tabela dinâmica com o tamanho especificado
   * @param rows - Número de linhas (mínimo 2)
   * @param cols - Número de colunas (mínimo 2)
   */
  const insertTableDynamic = useCallback(
    (rows: number, cols: number) => {
      // Validação básica
      const validRows = Math.max(2, Math.min(rows, 20))
      const validCols = Math.max(2, Math.min(cols, 20))
      const table = generateTable(validRows, validCols)
      insertBlock(table)
    },
    [insertBlock],
  )

  /**
   * Abre o widget de busca nativo do Monaco Editor
   * Equivalente a pressionar Ctrl+F
   */
  const openFind = useCallback(() => {
    if (!editor) return
    try {
      // Tenta abrir o widget de busca nativo
      editor.trigger('keyboard', 'actions.find', null)
      editor.focus()
    } catch (error) {
      console.warn('Não foi possível abrir o widget de busca:', error)
    }
  }, [editor])

  const actions: IToolbarActions = {
    insertTable: () => insertBlock(TABLE),
    insertTableDynamic,
    insertHeading: (level: number) => insertAtLineStart('#'.repeat(level) + ' '),
    insertCodeBlock: () => insertBlock(CODE_BLOCK),
    insertCheckbox: () => insertAtLineStart(CHECKBOX),
    insertBold: () => insertText(...BOLD),
    insertItalic: () => insertText(...ITALIC),
    insertStrikethrough: () => insertText(...STRIKETHROUGH),
    insertInlineCode: () => insertText(...INLINE_CODE),
    insertHorizontalRule: () => insertBlock(HORIZONTAL_RULE),
    insertPageBreak: () => insertBlock(PAGE_BREAK),
    insertLink: () => insertText(...LINK),
    insertImage: () => insertText(...IMAGE),
    insertBlockquote: () => insertAtLineStart(BLOCKQUOTE),
    insertOrderedList: () => insertAtLineStart(ORDERED_LIST),
    insertUnorderedList: () => insertAtLineStart(UNORDERED_LIST),
    insertCallout: (type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION') => {
      const calloutMap = {
        NOTE: CALLOUT_NOTE,
        TIP: CALLOUT_TIP,
        IMPORTANT: CALLOUT_IMPORTANT,
        WARNING: CALLOUT_WARNING,
        CAUTION: CALLOUT_CAUTION,
      }
      insertBlock(calloutMap[type])
    },
    openFind,
    undo: () => {
      if (editor) editor.trigger('keyboard', 'undo', null)
    },
    redo: () => {
      if (editor) editor.trigger('keyboard', 'redo', null)
    },
    formatDocument: async () => {
      try {
        const model = editor.getModel()
        if (!model) return

        const content = model.getValue()
        if (!content.trim()) return

        const formatted = await prettier.format(content, {
          parser: 'markdown',
          plugins: [prettierMarkdown],
          proseWrap: 'preserve',
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
        })

        editor.executeEdits('format-document', [
          {
            range: model.getFullModelRange(),
            text: formatted,
          },
        ])

        editor.focus()
      } catch (error) {
        console.error('Erro ao formatar documento:', error)
        // Não quebra a aplicação se houver erro na formatação
      }
    },
  }
  return {
    insertText,
    insertAtLineStart,
    insertBlock,
    actions,
  }
}
