import usePersistedState from '@/hooks/use-persisted-state'
import { useEffect, useRef, useState } from 'react'

interface UseDraggableOptions {
  storageKey?: string
  initialPosition?: { x: number; y: number }
  enabled?: boolean
  padding?: number
}

export const useDraggable = ({
  storageKey,
  initialPosition,
  enabled = true,
  padding = 8,
}: UseDraggableOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const initialPosRef = useRef<{ x: number; y: number } | null>(null)

  const [persistedPos, setPersistedPos] = usePersistedState<{ x: number; y: number } | null>(
    storageKey || 'draggable-pos',
    initialPosition || null,
    false,
    '@DRAGGABLE_UI', // Namespace unificado
  )

  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null)

  // Sincroniza persistência inicial
  useEffect(() => {
    if (persistedPos) {
      setCurrentPos(persistedPos)
    }
  }, [persistedPos])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enabled || !elementRef.current) return
    if (e.button !== 0) return // Apenas botão esquerdo

    setIsDragging(true)

    const rect = elementRef.current.getBoundingClientRect()
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    }

    // Calcula o centro do elemento como ponto de referência
    initialPosRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    e.stopPropagation()
    // Previne seleção de texto durante o drag
    e.preventDefault()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current || !initialPosRef.current || !elementRef.current) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      let newX = initialPosRef.current.x + deltaX
      let newY = initialPosRef.current.y + deltaY

      // Cálculos dinâmicos baseados no tamanho atual do elemento
      const rect = elementRef.current.getBoundingClientRect()
      const halfWidth = rect.width / 2
      const halfHeight = rect.height / 2

      // Limites da tela (Viewport)
      newX = Math.max(halfWidth + padding, Math.min(window.innerWidth - halfWidth - padding, newX))
      newY = Math.max(
        halfHeight + padding,
        Math.min(window.innerHeight - halfHeight - padding, newY),
      )

      // Aplica direto no DOM para performance
      elementRef.current.style.left = `${newX}px`
      elementRef.current.style.top = `${newY}px`
      elementRef.current.style.transform = 'translate(-50%, -50%)'
      // Remove classes de posicionamento relativo se existirem para evitar conflito
      elementRef.current.style.right = 'auto'
      elementRef.current.style.bottom = 'auto'
    }

    const handleMouseUp = () => {
      setIsDragging(false)

      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const finalX = rect.left + rect.width / 2
        const finalY = rect.top + rect.height / 2

        const finalPos = { x: finalX, y: finalY }
        setCurrentPos(finalPos)
        if (storageKey) {
          setPersistedPos(finalPos)
        }
      }

      dragStartRef.current = null
      initialPosRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, padding, setPersistedPos, storageKey])

  // Estilo computado para aplicar no componente
  const style: React.CSSProperties | undefined = currentPos
    ? {
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        transform: 'translate(-50%, -50%)',
        position: 'fixed', // Garante que é fixed quando movido
        right: 'auto', // Reseta posicionamentos conflitantes
        bottom: 'auto',
      }
    : undefined

  return {
    elementRef,
    style,
    handleMouseDown,
    isDragging,
    currentPos,
  }
}
