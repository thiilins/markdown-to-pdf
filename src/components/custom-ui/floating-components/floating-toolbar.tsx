'use client'

import { Button } from '@/components/ui/button'
import { useDraggable } from '@/hooks/use-draggable'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const FloatingToolbar = ({
  icon: Icon,
  children,
  position = 'right',
  className,
  iconClassName,
  contentClassName,
  storageKey,
  draggable = true,
}: FloatingToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    elementRef: buttonRef,
    style: dragStyle,
    handleMouseDown,
    isDragging,
    currentPos,
  } = useDraggable({
    storageKey: storageKey || 'floating-toolbar-position',
    enabled: draggable,
  })

  const defaultPositionClasses = {
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    top: 'top-4 left-1/2 -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
  }

  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({})

  const calculateContentPosition = useCallback(() => {
    const btnEl = buttonRef.current as HTMLButtonElement | null
    if (!btnEl || !contentRef.current) return

    const buttonRect = btnEl.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    const gap = 12
    const viewport = { w: window.innerWidth, h: window.innerHeight }

    let top = 0
    let left = 0

    switch (position) {
      case 'right':
        left = buttonRect.right + gap
        top = buttonRect.top + buttonRect.height / 2 - contentRect.height / 2
        if (left + contentRect.width > viewport.w) left = buttonRect.left - gap - contentRect.width
        break
      case 'left':
        left = buttonRect.left - gap - contentRect.width
        top = buttonRect.top + buttonRect.height / 2 - contentRect.height / 2
        if (left < 0) left = buttonRect.right + gap
        break
      case 'top':
        top = buttonRect.top - gap - contentRect.height
        left = buttonRect.left + buttonRect.width / 2 - contentRect.width / 2
        if (top < 0) top = buttonRect.bottom + gap
        break
      case 'bottom':
        top = buttonRect.bottom + gap
        left = buttonRect.left + buttonRect.width / 2 - contentRect.width / 2
        if (top + contentRect.height > viewport.h) top = buttonRect.top - gap - contentRect.height
        break
    }

    top = Math.max(4, Math.min(top, viewport.h - contentRect.height - 4))
    left = Math.max(4, Math.min(left, viewport.w - contentRect.width - 4))

    setContentStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      margin: 0,
      zIndex: 60,
    })
  }, [position, buttonRef]) // Adicionado buttonRef nas dependências

  useLayoutEffect(() => {
    if (isOpen) {
      calculateContentPosition()
      window.addEventListener('resize', calculateContentPosition)
      window.addEventListener('scroll', calculateContentPosition, true)
      return () => {
        window.removeEventListener('resize', calculateContentPosition)
        window.removeEventListener('scroll', calculateContentPosition, true)
      }
    }
  }, [isOpen, currentPos, calculateContentPosition])

  return (
    <>
      <Button
        ref={buttonRef as React.RefObject<HTMLButtonElement>}
        variant='outline'
        size='icon'
        onClick={(_e) => {
          if (!isDragging) setIsOpen(!isOpen)
        }}
        onMouseDown={handleMouseDown}
        style={dragStyle}
        className={cn(
          'fixed z-50 h-10 w-10 rounded-full shadow-lg transition-transform',
          !dragStyle && defaultPositionClasses[position],
          isDragging ? 'scale-110 cursor-grabbing' : draggable ? 'cursor-grab hover:scale-110' : '',
          iconClassName,
        )}
        aria-label={isOpen ? 'Fechar toolbar' : 'Abrir toolbar'}>
        {isOpen ? <X className='h-4 w-4' /> : <Icon className='h-4 w-4' />}
      </Button>

      {isOpen &&
        createPortal(
          <div
            ref={contentRef}
            style={contentStyle}
            className={cn(
              'bg-background border-border animate-in fade-in zoom-in-95 fixed flex items-center gap-2 rounded-lg border p-2 shadow-xl duration-200',
              className,
              contentClassName,
            )}>
            {children}
          </div>,
          document.body,
        )}
    </>
  )
}
