'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface BadgeMultiSelectorProps {
  label?: string
  options: string[]
  selected: string[]
  onSelect: (option: string) => void
  className?: string
}

export const BadgeMultiSelector = ({
  label,
  options,
  selected,
  onSelect,
  className,
}: BadgeMultiSelectorProps) => {
  return (
    <div className={cn('flex flex-col gap-2.5 pb-3', className)}>
      {label && (
        <div className='flex items-center justify-between px-1'>
          <span className='text-muted-foreground text-xs font-semibold tracking-tight'>
            {label}
          </span>
          {selected.length > 0 && (
            <span className='text-primary text-[10px] font-medium'>
              {selected.length} selecionado(s)
            </span>
          )}
        </div>
      )}

      <div className='flex max-h-[120px] flex-wrap gap-1.5 overflow-y-auto'>
        {options.map((option) => {
          const isActive = selected.includes(option)
          return (
            <FilterPill
              key={option}
              label={option}
              isActive={isActive}
              onClick={() => onSelect(option)}
            />
          )
        })}
      </div>
    </div>
  )
}

// Sub-componente com animação e estilo refinado
const FilterPill = ({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <motion.button
      onClick={onClick}
      layout
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundColor: isActive ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--muted) / 0.3)',
        borderColor: isActive ? 'hsl(var(--primary) / 0.2)' : 'transparent',
        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
      }}
      className={cn(
        'group focus-visible:ring-primary relative flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-1',
        // Estilos base estáticos para fallback
        isActive
          ? 'border-primary/20 bg-primary/10 text-primary'
          : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground border-transparent',
      )}>
      <span className='relative z-10 max-w-[120px] truncate'>{label}</span>

      {/* Ícone condicional minúsculo para feedback visual */}
      {isActive && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-primary'>
          <Check className='h-3 w-3' />
        </motion.span>
      )}
    </motion.button>
  )
}
