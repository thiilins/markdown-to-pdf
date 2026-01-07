'use client'

import { cn } from '@/lib/utils'
import { memo, useMemo } from 'react'

// Helper otimizado e seguro para hex para rgba
const hexToRgba = (hex: string, alpha: number): string => {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } catch (e) {
    return `rgba(0, 0, 0, ${alpha})`
  }
}

interface LineItemProps {
  lineNum: number
  isHighlighted: boolean
  fontSize: number
  lineHeight: number
  highlightColor: string
  highlightOpacity: number
  onClick: (lineNum: number) => void
  disabled: boolean
}

// Memoizamos a linha individual para evitar re-renders globais ao destacar uma única linha
const LineItem = memo(
  ({
    lineNum,
    isHighlighted,
    fontSize,
    lineHeight,
    highlightColor,
    highlightOpacity,
    onClick,
    disabled,
  }: LineItemProps) => {
    const bgOpacity = isHighlighted ? highlightOpacity : 0
    const borderOpacity = isHighlighted ? Math.min(highlightOpacity + 0.2, 1) : 0

    return (
      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onClick(lineNum)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick(lineNum)
          }
        }}
        className={cn(
          'group relative flex items-center justify-end pr-4 transition-all duration-150',
          !disabled && 'cursor-pointer hover:bg-zinc-800/40 active:bg-zinc-800/60',
          isHighlighted && 'font-medium',
        )}
        style={{
          height: `${lineHeight}px`,
          backgroundColor: isHighlighted ? hexToRgba(highlightColor, bgOpacity) : undefined,
          // Design Industrial: Marcador lateral fino para a linha destacada
          boxShadow: isHighlighted ? `inset 2px 0 0 ${highlightColor}` : 'none',
        }}
        aria-pressed={isHighlighted}
        title={isHighlighted ? 'Remover destaque' : 'Destacar linha'}>
        <span
          className={cn(
            'tabular-nums transition-colors duration-200',
            isHighlighted ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300',
          )}
          style={{
            fontSize: `${fontSize * 0.85}px`, // Números levemente menores que o código para hierarquia
            color: isHighlighted ? highlightColor : undefined,
          }}>
          {lineNum}
        </span>
      </div>
    )
  },
)

LineItem.displayName = 'LineItem'

interface CustomLineNumbersProps {
  totalLines: number
  fontSize: number
  fontFamily: string
  highlightedLines: number[]
  highlightColor: string
  highlightOpacity: number
  onLineClick: (lineNumber: number) => void
  disabled?: boolean
}

export function CustomLineNumbers({
  totalLines,
  fontSize,
  fontFamily,
  highlightedLines,
  highlightColor,
  highlightOpacity,
  onLineClick,
  disabled = false,
}: CustomLineNumbersProps) {
  const lineHeight = fontSize * 1.6

  // Geramos o array de linhas apenas quando o totalLines mudar
  const lines = useMemo(() => Array.from({ length: totalLines }, (_, i) => i + 1), [totalLines])

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col border-r border-zinc-800/50 bg-zinc-950/20 select-none',
        disabled && 'opacity-60 grayscale-[0.5]',
      )}
      style={{
        fontFamily: `"${fontFamily}", var(--font-geist-mono), ui-monospace, monospace`,
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        minWidth: totalLines > 99 ? '4rem' : '3.5rem', // Ajuste dinâmico de largura
      }}>
      {lines.map((lineNum) => (
        <LineItem
          key={lineNum}
          lineNum={lineNum}
          isHighlighted={highlightedLines.includes(lineNum)}
          fontSize={fontSize}
          lineHeight={lineHeight}
          highlightColor={highlightColor}
          highlightOpacity={highlightOpacity}
          onClick={onLineClick}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
