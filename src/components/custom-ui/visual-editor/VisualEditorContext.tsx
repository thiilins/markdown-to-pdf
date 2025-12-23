'use client'
import { cn } from '@/lib/utils'
import { isBooleanFb } from '@/shared/utils/validate-value'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { Link as LinkExtension } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Underline as UnderlineExtension } from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined)

export const VisualEditorProvider = ({
  children,
  placeholders,
  config,
  updateEditorValue,
  editorConfig,
  initialValue,
}: VisualEditorProviderProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  const [fontSizeValue, setFontSizeValue] = useState('14')
  const [editorValue, setEditorValue] = useState(initialValue || '')
  const handleUpdateEditorValue = useCallback(
    (value: string) => {
      setEditorValue(value)
      updateEditorValue?.(value)
    },
    [setEditorValue, updateEditorValue],
  )
  const FontSize = TextStyle.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize.replace('px', ''),
          renderHTML: (attributes) => {
            if (!attributes.fontSize) return {}
            return { style: `font-size: ${attributes.fontSize}px` }
          },
        },
      }
    },
  })
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        dropcursor: { color: 'hsl(var(--primary))', width: 2 },
      }),
      UnderlineExtension,
      FontSize,
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Typography,
      CharacterCount,
      TaskList,
      TaskItem.configure({ nested: isBooleanFb(editorConfig?.taskItemNested, true) }),
      Table.configure({ resizable: isBooleanFb(editorConfig?.tableResizable, true) }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({
        multicolor: isBooleanFb(editorConfig?.highlightMulticolor, true),
      }),
      TextAlign.configure({ types: editorConfig?.textAlignConfigure || ['heading', 'paragraph'] }),
      TiptapImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: cn('rounded-lg border border-muted max-w-full h-auto', editorConfig?.imageClass),
        },
      }),
      LinkExtension.configure({
        openOnClick: isBooleanFb(editorConfig?.linkOpenOnClick, false),
        HTMLAttributes: {
          class: cn('text-primary underline cursor-pointer', editorConfig?.linkClass),
        },
      }),
      Placeholder.configure({
        placeholder: editorConfig?.placeholder || 'Comece a escrever sua obra-prima...',
      }),
    ],
    content: editorValue,
    onUpdate: ({ editor }) => {
      handleUpdateEditorValue(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'focus:outline-none px-4 py-4 text-sm prose prose-sm max-w-none dark:prose-invert min-h-[350px]',
      },
    },
  })

  useEffect(() => {
    if (editor && editorValue !== editor.getHTML()) {
      editor.commands.setContent(editorValue)
    }
  }, [editorValue, editor])

  const contextValue = useMemo(
    () => ({
      viewMode,
      setViewMode,
      fontSizeValue,
      setFontSizeValue,
      placeholders,
      FontSize,
      config,
      editorValue,
      handleUpdateEditorValue,
      editor,
    }),
    [
      viewMode,
      setViewMode,
      fontSizeValue,
      setFontSizeValue,
      placeholders,
      FontSize,
      config,
      editorValue,
      handleUpdateEditorValue,
      editor,
    ],
  )
  return (
    <VisualEditorContext.Provider value={contextValue}>{children}</VisualEditorContext.Provider>
  )
}

export const useVisualEditor = () => {
  const context = useContext(VisualEditorContext)
  if (!context) {
    throw new Error('useVisualEditor must be used within a VisualEditorProvider')
  }
  return context
}
