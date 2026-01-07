'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bug,
  CheckCircle,
  Code,
  Eye,
  Heart,
  Info,
  Lightbulb,
  MessageSquare,
  PencilLine,
  Save,
  Star,
  StickyNote,
  Trash2,
  Type,
  Zap,
} from 'lucide-react'
import React, { useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

const ANNOTATION_ICONS = [
  { id: 'message', icon: MessageSquare, label: 'Nota' },
  { id: 'info', icon: Info, label: 'Info' },
  { id: 'alert', icon: AlertTriangle, label: 'Alerta' },
  { id: 'check', icon: CheckCircle, label: 'Check' },
  { id: 'star', icon: Star, label: 'Estrela' },
  { id: 'heart', icon: Heart, label: 'Coração' },
  { id: 'lightbulb', icon: Lightbulb, label: 'Ideia' },
  { id: 'bug', icon: Bug, label: 'Bug' },
  { id: 'code', icon: Code, label: 'Código' },
  { id: 'zap', icon: Zap, label: 'Rápido' },
] as const

const PRESET_COLORS = [
  '#fbbf24',
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#f97316',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#6366f1',
]

interface CodeAnnotationComponentProps {
  annotation: CodeAnnotation
  onUpdate: (id: string, updates: Partial<CodeAnnotation>) => void
  onDelete: (id: string) => void
  scale?: number
}

export function CodeAnnotationComponent({
  annotation,
  onUpdate,
  onDelete,
  scale = 1,
}: CodeAnnotationComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [tempPos, setTempPos] = useState({ x: annotation.x, y: annotation.y })

  const dragInfo = useRef({ startX: 0, startY: 0, moved: false, currentX: 0, currentY: 0 })

  // Cálculo de cor de texto para contraste (preto ou branco)
  const contrastColor = useMemo(() => {
    const hex = (annotation.color || '#fbbf24').replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#18181b' : '#ffffff'
  }, [annotation.color])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return

    e.stopPropagation()
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      currentX: annotation.x,
      currentY: annotation.y,
    }

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - dragInfo.current.startX) / scale
      const dy = (moveEvent.clientY - dragInfo.current.startY) / scale

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragInfo.current.moved = true
        const newX = Math.max(0, annotation.x + dx)
        const newY = Math.max(0, annotation.y + dy)
        dragInfo.current.currentX = newX
        dragInfo.current.currentY = newY
        setIsDragging(true)
        setTempPos({ x: newX, y: newY })
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      if (dragInfo.current.moved) {
        onUpdate(annotation.id, {
          x: dragInfo.current.currentX,
          y: dragInfo.current.currentY,
        })
        // Reset após um pequeno delay para evitar que o click abra o popover
        setTimeout(() => {
          setIsDragging(false)
          dragInfo.current.moved = false
        }, 100)
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    // Se houve movimento, impede o Popover de abrir/fechar
    if (dragInfo.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const CurrentIcon = ANNOTATION_ICONS.find((i) => i.id === annotation.icon)?.icon || MessageSquare

  return (
    <motion.div
      animate={{
        left: isDragging ? tempPos.x : annotation.x,
        top: isDragging ? tempPos.y : annotation.y,
        scale: isDragging ? 1.02 : 1,
        zIndex: isEditing || isDragging ? 100 : 50,
      }}
      className='absolute'
      style={{ transformOrigin: 'top left', transform: `scale(${scale})` }}
      onMouseDown={handleMouseDown}>
      <Popover open={isEditing} onOpenChange={setIsEditing}>
        <PopoverTrigger asChild onClick={handleTriggerClick}>
          <div
            className={cn(
              'group/note flex cursor-grab items-center gap-2 border shadow-sm transition-all select-none active:cursor-grabbing',
              annotation.style === 'badge'
                ? 'rounded-full px-4 py-1.5'
                : annotation.style === 'minimal'
                  ? 'rounded-md bg-white/80 px-2 py-1 backdrop-blur-md'
                  : 'rounded-lg bg-white px-3 py-2',
            )}
            style={{
              backgroundColor: annotation.style === 'minimal' ? undefined : annotation.color,
              borderColor: annotation.color,
              color: annotation.style === 'minimal' ? annotation.color : contrastColor,
              opacity: annotation.opacity,
              fontSize: `${annotation.fontSize}px`,
            }}>
            <CurrentIcon className='h-4 w-4 shrink-0' />
            <span className='max-w-[160px] truncate font-bold'>{annotation.text || 'Nota'}</span>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className='w-80 gap-0 overflow-hidden border-none p-0 shadow-2xl'
          side='right'
          sideOffset={10}
          onClick={(e) => e.stopPropagation()}>
          {/* Header seguindo o seu padrão de exemplo */}
          <div className='from-primary/10 flex flex-col items-center justify-center bg-gradient-to-b to-transparent pt-6 pb-4'>
            <div className='bg-primary/10 ring-primary/5 mb-3 flex h-12 w-12 items-center justify-center rounded-full ring-8'>
              <StickyNote className='text-primary h-6 w-6' />
            </div>
            <div className='flex flex-col items-center px-6 text-center'>
              <h3 className='text-foreground text-lg font-bold tracking-tight'>Editar Anotação</h3>
              <p className='text-muted-foreground text-xs'>
                Personalize o conteúdo e estilo da sua nota.
              </p>
            </div>
          </div>

          <div className='space-y-5 px-6 py-4'>
            {/* Campo de Texto */}
            <div className='group space-y-1.5'>
              <Label className='text-muted-foreground group-focus-within:text-primary text-xs font-semibold transition-colors'>
                Conteúdo da nota
              </Label>
              <div className='relative'>
                <PencilLine className='text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  value={annotation.text}
                  onChange={(e) => onUpdate(annotation.id, { text: e.target.value })}
                  className='focus-visible:ring-primary h-10 pl-10 text-sm transition-all'
                  placeholder='Ex: Nota importante...'
                />
              </div>
            </div>

            <Separator className='opacity-50' />

            {/* Ícones e Cores */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-muted-foreground text-[11px] font-bold uppercase'>
                  Ícone
                </Label>
                <div className='grid grid-cols-5 gap-1'>
                  {ANNOTATION_ICONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onUpdate(annotation.id, { icon: item.id })}
                      className={cn(
                        'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition-all',
                        annotation.icon === item.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-transparent bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
                      )}>
                      <item.icon className='h-3.5 w-3.5' />
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-2'>
                <Label className='text-muted-foreground text-[11px] font-bold uppercase'>Cor</Label>
                <div className='grid grid-cols-5 gap-1'>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdate(annotation.id, { color: c })}
                      className={cn(
                        'aspect-square w-full cursor-pointer rounded-sm border-2 transition-transform active:scale-90',
                        annotation.color === c
                          ? 'border-zinc-400 ring-2 ring-white ring-inset'
                          : 'border-transparent',
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='text-muted-foreground flex items-center justify-between text-[11px] font-bold uppercase'>
                  <span className='flex items-center gap-1.5'>
                    <Type className='h-3 w-3' /> Tamanho
                  </span>
                  <span className='font-mono'>{annotation.fontSize}px</span>
                </div>
                <Slider
                  value={[annotation.fontSize || 14]}
                  min={10}
                  max={22}
                  step={1}
                  onValueChange={(v) => onUpdate(annotation.id, { fontSize: v[0] })}
                />
              </div>

              <div className='space-y-2'>
                <div className='text-muted-foreground flex items-center justify-between text-[11px] font-bold uppercase'>
                  <span className='flex items-center gap-1.5'>
                    <Eye className='h-3 w-3' /> Opacidade
                  </span>
                  <span className='font-mono'>{Math.round((annotation.opacity || 1) * 100)}%</span>
                </div>
                <Slider
                  value={[(annotation.opacity || 1) * 100]}
                  min={30}
                  max={100}
                  step={5}
                  onValueChange={(v) => onUpdate(annotation.id, { opacity: v[0] / 100 })}
                />
              </div>
            </div>
          </div>

          {/* Footer seguindo o seu padrão de exemplo */}
          <div className='bg-muted/30 flex w-full items-center gap-2 border-t px-4 py-3 sm:justify-between'>
            <Select
              value={annotation.style || 'card'}
              onValueChange={(v) => onUpdate(annotation.id, { style: v as any })}>
              <SelectTrigger className='h-8 w-[140px] bg-white text-xs'>
                <SelectValue placeholder='Estilo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='card'>Card (Padrão)</SelectItem>
                <SelectItem value='badge'>Badge (Pílula)</SelectItem>
                <SelectItem value='minimal'>Minimalista</SelectItem>
              </SelectContent>
            </Select>

            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600'
                onClick={() => onDelete(annotation.id)}>
                <Trash2 className='h-4 w-4' />
              </Button>
              <Button
                size='sm'
                className='h-8 gap-2 px-3 text-xs font-bold'
                onClick={() => setIsEditing(false)}>
                <Save className='h-3.5 w-3.5' />
                Fechar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}
