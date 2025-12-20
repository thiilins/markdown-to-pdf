'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Editor, EditorContent } from '@tiptap/react'
import { Code2, Type } from 'lucide-react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { ConditionalRender } from '../conditional-render'
import { TooltipComponent } from '../tooltip'
import { useVisualEditor } from './VisualEditorContext'
import { PRESET_EDITOR_CONFIG } from './constants'
import {
  BoldButton,
  BubbleMenuButtons,
  BulletListButton,
  FontSizeInput,
  HorizontalRuleButton,
  ImageButton,
  ItalicButton,
  LinkButton,
  OrderedListButton,
  StrikethroughButton,
  TableButton,
  TaskListButton,
  TextAlignButtons,
  TextColorDropdown,
  TextHighlightDropdown,
  TypographyDropdown,
  UnderlineButton,
  UndoRedoButtons,
  VariablesDropdown,
  VerticalSeparator,
} from './features'
export const HtmlEditor = ({ editor, viewMode }: { editor: Editor; viewMode: ViewMode }) => {
  const [htmlValue, setHtmlValue] = useState(editor.getHTML())

  // Sincroniza quando entra no modo HTML
  useEffect(() => {
    const currentHtml = editor.getHTML()
    setHtmlValue(currentHtml)
  }, [viewMode, editor])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setHtmlValue(newValue)
  }, [])

  const handleBlur = useCallback(() => {
    // Atualiza o editor quando o usuário sai do campo
    if (htmlValue !== editor.getHTML()) {
      editor.commands.setContent(htmlValue)
    }
  }, [htmlValue, editor])

  return (
    <div className='flex-1 bg-zinc-900'>
      <textarea
        className='h-[350px] w-full resize-none bg-transparent p-4 font-mono text-sm text-zinc-100 outline-none'
        value={htmlValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}

export const VisualEditor = ({
  editor,
  viewMode,
  editorClassName,
}: {
  editor: Editor
  viewMode: ViewMode
  editorClassName?: string
}) => {
  const { setFontSizeValue, config } = useVisualEditor()
  const [linkUrl, setLinkUrl] = useState('')

  const setLink = useCallback(() => {
    if (!editor) return
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setLinkUrl('')
  }, [editor, linkUrl])

  const applyFontSize = useCallback(
    (size: string) => {
      setFontSizeValue(size)
      editor?.chain().focus().setMark('textStyle', { fontSize: size }).run()
    },
    [editor, setFontSizeValue],
  )

  const addImage = useCallback(() => {
    const url = window.prompt('URL da imagem:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const configButtons = useMemo(() => {
    return {
      'undo-redo': (key: string) => <UndoRedoButtons key={key} editor={editor} />,
      vertical: (key: string) => <VerticalSeparator key={key} />,
      typography: (key: string) => <TypographyDropdown key={key} editor={editor} />,
      'font-size': (key: string) => <FontSizeInput key={key} applyFontSize={applyFontSize} />,
      bold: (key: string) => <BoldButton key={key} editor={editor} />,
      italic: (key: string) => <ItalicButton key={key} editor={editor} />,
      underline: (key: string) => <UnderlineButton key={key} editor={editor} />,
      strikethrough: (key: string) => <StrikethroughButton key={key} editor={editor} />,
      'text-color': (key: string) => <TextColorDropdown key={key} editor={editor} />,
      'text-highlight': (key: string) => <TextHighlightDropdown key={key} editor={editor} />,
      'text-align': (key: string) => <TextAlignButtons key={key} editor={editor} />,
      'bullet-list': (key: string) => <BulletListButton key={key} editor={editor} />,
      'ordered-list': (key: string) => <OrderedListButton key={key} editor={editor} />,
      'task-list': (key: string) => <TaskListButton key={key} editor={editor} />,
      link: (key: string) => (
        <LinkButton
          key={key}
          editor={editor}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          setLink={setLink}
        />
      ),
      table: (key: string) => <TableButton key={key} editor={editor} />,
      image: (key: string) => <ImageButton key={key} addImage={addImage} />,
      'horizontal-rule': (key: string) => <HorizontalRuleButton key={key} editor={editor} />,
      variables: (key: string) => <VariablesDropdown key={key} editor={editor} />,
    }
  }, [editor, linkUrl, setLinkUrl, setLink, applyFontSize, addImage])

  const { buttons, enableBubbleMenu } = useMemo(() => {
    const preset = config?.preset || 'complete'
    if (preset === 'custom') {
      return {
        buttons: config?.custom
          ?.sort((a, b) => a.order - b.order)
          .map(({ key, component }) => {
            return configButtons[component](key)
          }),
        enableBubbleMenu: config?.bubbleMenu,
      }
    }
    return {
      buttons: PRESET_EDITOR_CONFIG[preset]
        .sort((a, b) => a.order - b.order)
        .map(({ key, component }) => {
          return configButtons[component](key)
        }),
      enableBubbleMenu: config?.bubbleMenu,
    }
  }, [config, configButtons])
  return (
    <>
      <div className='bg-background flex flex-wrap items-center justify-start gap-1 border-b p-1.5'>
        {buttons?.map((button, index) => (
          <Fragment key={index}>{button}</Fragment>
        ))}
      </div>
      <ConditionalRender condition={!!enableBubbleMenu}>
        <BubbleMenuButtons editor={editor} />
      </ConditionalRender>
      <div
        className={cn(
          'scrollbar-thin flex-1 overflow-y-auto bg-white p-4 dark:bg-zinc-950',
          editorClassName,
        )}>
        <EditorContent
          editor={editor}
          width='100%'
          height='100%'
          className={cn('h-auto w-full', editorClassName)}
        />
      </div>
    </>
  )
}

export const EditorFooter = ({ editor }: { editor: Editor }) => {
  return (
    <div className='bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-3 py-2 text-[10px] font-medium'>
      <div className='flex gap-4'>
        <span className='flex gap-1'>
          <b>{editor.storage.characterCount.characters()}</b> caracteres
        </span>
        <span className='flex gap-1'>
          <b>{editor.storage.characterCount.words()}</b> palavras
        </span>
      </div>
      <div className='flex items-center gap-1.5'>
        <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
        Sistema Ativo
      </div>
    </div>
  )
}
export const VisualEditorStructure = ({
  children,
  className,
  editor,
}: {
  children: React.ReactNode
  className?: string
  editor: Editor
}) => {
  return (
    <main
      className={cn(
        'border-input bg-background flex flex-col overflow-hidden rounded-xl border shadow-md',
        className,
      )}>
      {children}
      <EditorFooter editor={editor} />
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul[data-type='taskList'] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type='taskList'] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul[data-type='taskList'] label {
          margin-right: 0.5rem;
          user-select: none;
        }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 2px solid #ced4da;
          box-sizing: border-box;
          min-width: 1em;
          padding: 3px 5px;
          position: relative;
          vertical-align: top;
        }
        .ProseMirror table th {
          background-color: #f1f3f5;
          font-weight: bold;
          text-align: left;
        }
      `}</style>
    </main>
  )
}

export const ViewModeButtons = ({
  className,
}: {
  className?: {
    button?: string
    content?: string
    item?: {
      button?: string
      icon?: string
    }
  }
}) => {
  const { viewMode, setViewMode } = useVisualEditor()
  const VIEW_MODES: { label: string; value: ViewMode; icon: React.ElementType }[] = [
    { label: 'Visual', value: 'visual', icon: Type },
    { label: 'HTML', value: 'html', icon: Code2 },
  ]
  return (
    <div
      className={cn(
        'bg-primary/50 flex h-10 items-center gap-1 rounded-md p-1',
        className?.content,
      )}>
      {VIEW_MODES.map(({ label, value, icon: Icon }) => (
        <TooltipComponent key={value} content={label}>
          <Button
            key={value}
            variant='ghost'
            size='sm'
            className={cn(
              'border-primary flex h-8 cursor-pointer items-center justify-center border',
              viewMode === value
                ? 'bg-primary hover:bg-primary text-white hover:text-white'
                : 'hover:text-primary text-primary bg-white hover:bg-white',
              className?.item?.button,
            )}
            onClick={() => setViewMode(value)}>
            <Icon className={cn('h-3.5 w-3.5', className?.item?.icon)} />
          </Button>
        </TooltipComponent>
      ))}
    </div>
  )
}
