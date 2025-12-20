'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Extensões TipTap

import { Separator as SeparatorComponent } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  ChevronDown,
  Code,
  CodeXml,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Palette,
  Plus,
  Quote,
  Redo,
  Strikethrough,
  SubscriptIcon,
  SuperscriptIcon,
  TableIcon,
  Trash2,
  Type,
  Underline,
  Undo,
} from 'lucide-react'
import { VscJson } from 'react-icons/vsc'
import { ConditionalRender } from '../conditional-render'

import { useVisualEditor } from './VisualEditorContext'
import { PRESET_COLORS, PRESET_HIGHLIGHTS } from './constants'
export const UndoRedoButtons = ({ editor }: { editor: Editor }) => {
  return (
    <div className='flex items-center gap-0.5'>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title='Desfazer'>
        <Undo className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title='Refazer'>
        <Redo className='h-4 w-4' />
      </Button>
    </div>
  )
}
export const VerticalSeparator = () => {
  return <SeparatorComponent orientation='vertical' className='mx-1 h-6' />
}

export const TypographyDropdown = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 gap-2 px-2'>
          <Type className='h-4 w-4' /> <ChevronDown className='h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
          Corpo de Texto
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className='font-bold'>
          <Heading1 className='mr-2 h-4 w-4' /> Título 1
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className='font-semibold'>
          <Heading2 className='mr-2 h-4 w-4' /> Título 2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className='mr-2 h-4 w-4' /> Título 3
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className='mr-2 h-4 w-4' /> Citação
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const FontSizeInput = ({ applyFontSize }: { applyFontSize: (size: string) => void }) => {
  const { fontSizeValue } = useVisualEditor()
  return (
    <Input
      type='number'
      className='h-8 w-14 text-xs'
      value={fontSizeValue}
      onChange={(e) => applyFontSize(e.target.value)}
      title='Tamanho da fonte'
    />
  )
}

export const BoldButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      type='button'
      variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
      size='sm'
      className='h-8 w-8 p-0'
      onClick={() => editor.chain().focus().toggleBold().run()}>
      <Bold className='h-4 w-4' />
    </Button>
  )
}

export const ItalicButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      type='button'
      variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
      size='sm'
      className='h-8 w-8 p-0'
      onClick={() => editor.chain().focus().toggleItalic().run()}>
      <Italic className='h-4 w-4' />
    </Button>
  )
}

export const UnderlineButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      type='button'
      variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
      size='sm'
      className='h-8 w-8 p-0'
      onClick={() => editor.chain().focus().toggleUnderline().run()}>
      <Underline className='h-4 w-4' />
    </Button>
  )
}
export const StrikethroughButton = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <Plus className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className='mr-2 h-4 w-4' /> Tachado
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <SubscriptIcon className='mr-2 h-4 w-4' /> Subscrito
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <SuperscriptIcon className='mr-2 h-4 w-4' /> Sobrescrito
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className='mr-2 h-4 w-4' /> Código Inline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TextColorDropdown = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 gap-1.5 px-2' title='Cor do Texto'>
          <Palette className='h-4 w-4' />
          <div
            className='h-3 w-3 rounded-full border border-black/10'
            style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000' }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-44 p-2'>
        <div className='mb-2 grid grid-cols-5 gap-1'>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => editor.chain().focus().setColor(c).run()}
              className='h-6 w-6 rounded border border-black/5 transition-transform hover:scale-110'
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className='mt-2 border-t pt-2'>
          <div className='relative flex h-8 w-full cursor-pointer items-center gap-2'>
            <Input
              type='color'
              className='h-8 w-8 cursor-pointer border-none bg-transparent p-0'
              value={editor.getAttributes('textStyle').color || '#000000'}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
            <span className='text-[10px] font-medium'>Hex Personalizado</span>
          </div>
        </div>
        <DropdownMenuItem
          className='text-muted-foreground mt-1 cursor-pointer justify-center gap-2 text-xs'
          onClick={() => editor.chain().focus().unsetColor().run()}>
          <Eraser className='h-3 w-3' /> Limpar Cor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TextHighlightDropdown = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 gap-1 px-2' title='Destaque'>
          <Highlighter className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-44 p-2'>
        <div className='mb-2 grid grid-cols-5 gap-1'>
          {PRESET_HIGHLIGHTS.map((c) => (
            <button
              key={c}
              onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
              className='h-6 w-6 rounded border border-black/5'
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <DropdownMenuItem
          className='text-muted-foreground mt-1 cursor-pointer justify-center gap-2 text-xs'
          onClick={() => editor.chain().focus().unsetHighlight().run()}>
          <Eraser className='h-3 w-3' /> Limpar Destaque
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const TextAlignButtons = ({ editor }: { editor: Editor }) => {
  return (
    <div className='flex items-center gap-0.5'>
      <Button
        variant='ghost'
        size='sm'
        className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'left' }) && 'bg-accent')}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'center' }) && 'bg-accent')}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'right' }) && 'bg-accent')}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'justify' }) && 'bg-accent')}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
        <AlignJustify className='h-4 w-4' />
      </Button>
    </div>
  )
}
export const BulletListButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      variant='ghost'
      size='sm'
      className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-accent')}
      onClick={() => editor.chain().focus().toggleBulletList().run()}>
      <List className='h-4 w-4' />
    </Button>
  )
}

export const OrderedListButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      variant='ghost'
      size='sm'
      className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-accent')}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}>
      <ListOrdered className='h-4 w-4' />
    </Button>
  )
}
export const TaskListButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      variant='ghost'
      size='sm'
      className={cn('h-8 w-8 p-0', editor.isActive('taskList') && 'bg-accent')}
      onClick={() => editor.chain().focus().toggleTaskList().run()}>
      <CheckSquare className='h-4 w-4' />
    </Button>
  )
}
export const LinkButton = ({
  editor,
  linkUrl,
  setLinkUrl,
  setLink,
}: {
  editor: Editor
  linkUrl: string
  setLinkUrl: (url: string) => void
  setLink: () => void
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          size='sm'
          className='h-8 w-8 p-0'>
          <Link className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='flex gap-2'>
          <Input
            placeholder='https://...'
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className='h-8'
          />
          <Button size='sm' className='h-8' onClick={setLink}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const TableButton = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={editor.isActive('table') ? 'secondary' : 'ghost'}
          size='sm'
          className='h-8 w-8 p-0'>
          <TableIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }>
          <Plus className='mr-2 h-4 w-4' /> Inserir Tabela 3x3
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.isActive('table')}>
          Adicionar Coluna
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.isActive('table')}>
          Adicionar Linha
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.isActive('table')}
          className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' /> Excluir Tabela
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export const ImageButton = ({ addImage }: { addImage: () => void }) => {
  return (
    <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={addImage}>
      <ImageIcon className='h-4 w-4' />
    </Button>
  )
}
export const HorizontalRuleButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-8 w-8 p-0'
      onClick={() => editor.chain().focus().setHorizontalRule().run()}>
      <Minus className='h-4 w-4' />
    </Button>
  )
}

export const VariablesDropdown = ({ editor }: { editor: Editor }) => {
  const { placeholders } = useVisualEditor()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'bg-primary hover:bg-primary/90 h-9 gap-1 px-2 text-[10px] text-white hover:text-white',
          )}>
          <VscJson className='h-8 w-8 font-bold' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='grid w-45 space-y-1 p-2' align='end'>
        {placeholders.map((v) => (
          <Button
            key={v.key}
            variant='ghost'
            onClick={() => editor.chain().focus().insertContent(v.value).run()}
            className='hover:bg-primary/10 flex h-8 w-full items-center justify-start gap-2 rounded p-1 text-center text-xs font-bold transition-colors'>
            <div className='bg-primary/20 border-primary/20 rounded-[15px] border p-1'>
              <v.icon className='text-primary h-5 w-5' />
            </div>
            <span className='text-muted-foreground text-[12px] font-bold'> {v.label}</span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export const BubbleMenuButtons = ({ editor }: { editor: Editor }) => {
  return (
    <ConditionalRender condition={!!editor}>
      <BubbleMenu
        editor={editor}
        className='bg-background flex overflow-hidden rounded-md border shadow-xl'>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 rounded-none border-r'
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 rounded-none border-r'
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 rounded-none'
          onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <Highlighter className='h-4 w-4' />
        </Button>
      </BubbleMenu>
    </ConditionalRender>
  )
}

export const VariableSelector = ({
  onSelect,
  className,
  variables,
}: {
  onSelect: (variable: string) => void
  className?: string
  variables: Variables[]
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'bg-primary hover:bg-primary/90 h-9 w-9 gap-1 px-2 text-[10px] text-white hover:text-white',
            className,
          )}>
          <CodeXml className='h-8 w-8' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='grid w-45 space-y-1 p-2' align='end'>
        {variables.map((v) => (
          <Button
            key={v.key}
            variant='ghost'
            onClick={() => onSelect(v.value)}
            className='hover:bg-primary/10 flex h-8 w-full items-center justify-start gap-2 rounded p-1 text-center text-xs font-bold transition-colors'>
            <div className='bg-primary/20 border-primary/20 rounded-[15px] border p-1'>
              <v.icon className='text-primary h-5 w-5' />
            </div>
            <span className='text-muted-foreground text-[12px] font-bold'> {v.label}</span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
