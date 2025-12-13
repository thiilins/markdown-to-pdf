'use client'

import { useDraggable } from '@/hooks/use-draggable' // Seu hook
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'

export const FloatingPanel = ({
  children,
  className,
  width = 'w-64', // Ajustei um default mais realista para um painel
  height = 'h-auto',
  position = 'bottom-right', // Default mais comum
  storageKey,
  draggable = true,
}: FloatingPanelProps) => {
  const {
    elementRef: panelRef,
    style: dragStyle,
    handleMouseDown,
    isDragging,
  } = useDraggable({
    storageKey: storageKey,
    enabled: draggable,
  })

  // Mapa de posições usando classes do Tailwind
  const positionClassesMap: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',

    'center-left': 'top-1/2 left-4 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'center-right': 'top-1/2 right-4 -translate-y-1/2',

    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  }

  // Se dragStyle existir (já foi movido ou carregado do storage), ignoramos as classes de posição inicial
  const activePositionClass = !dragStyle ? positionClassesMap[position] : ''

  return (
    <div
      ref={panelRef as React.RefObject<HTMLDivElement>}
      onMouseDown={handleMouseDown}
      style={dragStyle}
      className={cn(
        'fixed z-40 flex flex-col rounded-lg shadow-xl transition-all', // Adicionei flex-col e shadow-xl
        activePositionClass,
        width,
        height,
        className?.container,
        // Feedback visual do cursor
        isDragging ? 'scale-[1.01] cursor-grabbing' : draggable ? 'cursor-grab' : '',
        // Se estiver arrastando, removemos transições de posição para ficar fluido
        isDragging ? 'transition-none' : 'duration-300',
      )}>
      {/* REMOVIDO: onMouseDown={(e) => e.stopPropagation()}
        Motivo: Isso impedia o drag de funcionar se você clicasse no corpo do painel.
        Agora você pode arrastar clicando em qualquer lugar do painel.
      */}
      <div
        className={cn(
          'bg-background border-border relative flex h-full w-full items-center gap-2 overflow-hidden rounded-lg border p-1',
          className?.content,
        )}>
        {draggable && (
          <>
            <GripVertical className='mr-2 h-4 w-4' />
          </>
        )}
        {children}
      </div>
    </div>
  )
}
