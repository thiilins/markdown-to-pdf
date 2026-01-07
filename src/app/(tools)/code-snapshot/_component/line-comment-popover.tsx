'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface LineCommentPopoverProps {
  lineNumber: number
  comment?: string
  onCommentChange: (lineNumber: number, comment: string) => void
  onRemoveComment: (lineNumber: number) => void
  onClose: () => void
}

export function LineCommentPopover({
  lineNumber,
  comment,
  onCommentChange,
  onRemoveComment,
  onClose,
}: LineCommentPopoverProps) {
  const [tempComment, setTempComment] = useState(comment || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    setTempComment(comment || '')
  }, [comment, lineNumber])

  const handleSave = () => {
    if (tempComment.trim()) {
      onCommentChange(lineNumber, tempComment.trim())
    } else {
      onRemoveComment(lineNumber)
    }
    onClose()
  }

  const handleRemove = () => {
    onRemoveComment(lineNumber)
    onClose()
    setTempComment('')
  }

  return (
    <div className='bg-popover text-popover-foreground w-80 rounded-md border p-3 shadow-md'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-semibold'>Comentário na linha {lineNumber}</h4>
          {comment && (
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={handleRemove}
              title='Remover comentário'>
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>
        <Input
          ref={inputRef}
          placeholder='Adicione um comentário...'
          value={tempComment}
          onChange={(e) => setTempComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              handleSave()
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              onClose()
              setTempComment(comment || '')
            }
          }}
          className='text-sm'
        />
        <div className='flex items-center justify-end gap-2'>
          <Button variant='outline' size='sm' onClick={onClose}>
            Cancelar
          </Button>
          <Button size='sm' onClick={handleSave}>
            Salvar
          </Button>
        </div>
        <p className='text-[10px] text-muted-foreground'>
          Pressione Ctrl+Enter para salvar
        </p>
      </div>
    </div>
  )
}

