'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface PlaceholdersAndVanishInputProps {
  placeholders: string[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (value: string) => void
  className?: string
  /** Intervalo entre placeholders em ms (default: 4500) */
  interval?: number
}

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className,
  interval = 4500,
}: PlaceholdersAndVanishInputProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [animating, setAnimating] = useState(false)

  // Inicia o ciclo de placeholders
  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, interval)
  }, [placeholders.length, interval])

  // Controle de visibilidade da tab
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== 'visible' && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    } else if (document.visibilityState === 'visible') {
      startAnimation()
    }
  }, [startAnimation])

  useEffect(() => {
    startAnimation()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [startAnimation, handleVisibilityChange])

  // Desenha o texto no canvas para o efeito de vanish
  const draw = useCallback(() => {
    if (!inputRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 800
    ctx.clearRect(0, 0, 800, 800)

    const computedStyles = getComputedStyle(inputRef.current)
    const fontSize = parseFloat(computedStyles.getPropertyValue('font-size'))

    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`
    ctx.fillStyle = '#FFF'
    ctx.fillText(value, 16, 40)

    const imageData = ctx.getImageData(0, 0, 800, 800)
    const pixelData = imageData.data
    const newData: any[] = []

    for (let t = 0; t < 800; t++) {
      const rowStart = 4 * t * 800
      for (let n = 0; n < 800; n++) {
        const pixelIndex = rowStart + 4 * n
        if (
          pixelData[pixelIndex] !== 0 &&
          pixelData[pixelIndex + 1] !== 0 &&
          pixelData[pixelIndex + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[pixelIndex],
              pixelData[pixelIndex + 1],
              pixelData[pixelIndex + 2],
              pixelData[pixelIndex + 3],
            ],
          })
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1.2, // Tamanho inicial maior para partículas mais visíveis
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }))
  }, [value])

  useEffect(() => {
    draw()
  }, [value, draw])

  // Animação de vanish com partículas
  const animate = useCallback((start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = []
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i]
          if (current.x < pos) {
            newArr.push(current)
          } else {
            if (current.r <= 0) {
              current.r = 0
              continue
            }
            // Movimento mais suave e dispersão maior
            current.x += (Math.random() - 0.5) * 2.5
            current.y += (Math.random() - 0.5) * 2.5
            // Decremento mais lento = animação mais longa
            current.r -= 0.02 * Math.random()
            newArr.push(current)
          }
        }
        newDataRef.current = newArr

        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800)
          newDataRef.current.forEach((particle) => {
            const { x, y, r, color } = particle
            if (x > pos) {
              ctx.beginPath()
              // Círculos ao invés de retângulos para partículas mais suaves
              ctx.arc(x, y, r, 0, Math.PI * 2)
              ctx.fillStyle = color
              ctx.fill()
            }
          })
        }

        if (newDataRef.current.length > 0) {
          // Passo menor = animação mais suave e lenta
          animateFrame(pos - 4)
        } else {
          setValue('')
          setAnimating(false)
        }
      })
    }
    animateFrame(start)
  }, [])

  const vanishAndSubmit = useCallback(() => {
    if (!value) return

    setAnimating(true)
    draw()

    onSubmit?.(value)

    if (inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      )
      animate(maxX)
    }
  }, [value, draw, animate, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !animating && value) {
        vanishAndSubmit()
      }
    },
    [animating, value, vanishAndSubmit],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!animating) {
        setValue(e.target.value)
        onChange?.(e)
      }
    },
    [animating, onChange],
  )

  return (
    <>
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type='text'
        className={cn(
          'transition-colors duration-300',
          className,
          animating && 'text-transparent dark:text-transparent',
        )}
      />

      {/* Canvas para efeito de vanish */}
      <canvas
        ref={canvasRef}
        className={cn(
          'pointer-events-none absolute top-[20%] left-2 h-full w-full origin-top-left scale-50 transform pr-4 invert filter sm:left-8 dark:invert-0',
          !animating ? 'opacity-0' : 'opacity-100',
        )}
      />

      {/* Placeholder animado */}
      <div className='pointer-events-none absolute inset-0 flex items-center rounded-full'>
        <AnimatePresence mode='wait'>
          {!value && (
            <motion.p
              key={`placeholder-${currentPlaceholder}`}
              initial={{
                y: 8,
                opacity: 0,
                filter: 'blur(4px)',
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                y: -12,
                opacity: 0,
                filter: 'blur(4px)',
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1], // Curva bezier suave
              }}
              className='w-[calc(100%-2rem)] truncate pl-4 text-left text-sm font-normal text-neutral-500 sm:pl-12 sm:text-base dark:text-zinc-500'>
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
