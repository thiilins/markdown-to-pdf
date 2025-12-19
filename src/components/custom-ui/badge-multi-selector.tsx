import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

interface BadgeMultiSelectorProps {
  label: string
  options: string[]
  selected: string[]
  onSelect: (option: string) => void
  className?: {
    active?: string
    inactive?: string
    label?: string
    container?: string
  }
}
export const BadgeMultiSelector = ({
  label,
  options,
  selected,
  onSelect,
  className,
}: BadgeMultiSelectorProps) => {
  return (
    <div className={cn('border-b px-4 py-2', className?.container)}>
      <p
        className={cn(
          'text-muted-foreground mb-2 text-[10px] font-bold uppercase',
          className?.label,
        )}>
        {label}
      </p>
      <div className='flex flex-wrap gap-1.5'>
        {options.map((option) => {
          const isActive = selected.includes(option)
          return (
            <Badge
              key={option}
              variant={isActive ? 'default' : 'outline'}
              className={cn(
                'h-5 cursor-pointer px-2 py-0 text-[10px] font-normal transition-all',
                !isActive ? className?.inactive + ' hover:bg-muted' : className?.active,
              )}
              onClick={() => onSelect(option)}>
              {option}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
