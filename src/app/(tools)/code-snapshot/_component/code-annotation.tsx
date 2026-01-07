'use client'

import { X, ArrowDown, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { CodeAnnotation } from './types'

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
  const [editText, setEditText] = useState(annotation.text || '')

  const handleSave = () => {
    onUpdate(annotation.id, { text: editText })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(annotation.text || '')
    setIsEditing(false)
  }

  const color = annotation.color || '#fbbf24' // Amarelo padrão

  return (
    <div
      className='absolute group'
      style={{
        left: `${annotation.x}px`,
        top: `${annotation.y}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        zIndex: 1000,
      }}>
      {annotation.type === 'arrow' ? (
        <div className='relative'>
          {/* Seta apontando para baixo */}
          <div
            className='flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all hover:scale-110 cursor-pointer'
            style={{
              backgroundColor: color,
              borderColor: color,
            }}
            onClick={() => setIsEditing(true)}>
            <ArrowDown className='w-4 h-4 text-white' />
          </div>
          {/* Linha da seta */}
          {annotation.targetLine !== undefined && (
            <div
              className='absolute top-full left-1/2 w-0.5 origin-top'
              style={{
                height: `${(annotation.targetLine || 0) * 20}px`,
                backgroundColor: color,
                transform: 'translateX(-50%)',
              }}
            />
          )}
          {/* Nota da seta (se houver texto) */}
          {annotation.text && (
            <div
              className='absolute top-full left-0 mt-2 px-2 py-1 rounded text-xs font-medium shadow-lg whitespace-nowrap'
              style={{
                backgroundColor: color,
                color: '#000',
              }}>
              {annotation.text}
            </div>
          )}
        </div>
      ) : (
        <Popover open={isEditing} onOpenChange={setIsEditing}>
          <PopoverTrigger asChild>
            <div
              className='flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 min-w-[120px]'
              style={{
                backgroundColor: color,
                color: '#000',
              }}>
              <MessageSquare className='w-4 h-4' />
              <span className='text-sm font-medium flex-1'>
                {annotation.text || 'Nota'}
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(annotation.id)
                }}>
                <X className='w-3 h-3' />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className='w-80'>
            <div className='space-y-3'>
              <div>
                <label className='text-sm font-medium mb-1 block'>Texto da nota</label>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder='Digite sua nota...'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleSave()
                    } else if (e.key === 'Escape') {
                      handleCancel()
                    }
                  }}
                />
              </div>
              <div className='flex gap-2 justify-end'>
                <Button variant='outline' size='sm' onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button size='sm' onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Botão de deletar (aparece no hover) */}
      {annotation.type === 'arrow' && (
        <Button
          variant='ghost'
          size='icon'
          className='absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full'
          onClick={() => onDelete(annotation.id)}>
          <X className='w-3 h-3' />
        </Button>
      )}
    </div>
  )
}

