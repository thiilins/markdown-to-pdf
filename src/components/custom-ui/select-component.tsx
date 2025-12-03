import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface SelectComponentProps {
  value: string
  onValueChange: (value: string) => void
  data: { value: string; label: string }[]
  className?: {
    label?: string
    container?: string
    trigger?: string
    content?: string
    item?: string
  }
  label?: string | React.ReactNode
  placeholder?: string
  disabled?: boolean
}

export const SelectComponent = ({
  value,
  onValueChange,
  data,
  className,
  label,
  placeholder,
  disabled,
}: SelectComponentProps) => {
  return (
    <div className={cn('w-full! flex-1 space-y-1.5', className?.container)}>
      {label && (
        <Label
          className={cn(
            'text-muted-foreground flex items-center gap-1.5 text-xs font-medium',
            className?.label,
          )}>
          {label}
        </Label>
      )}

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'bg-background/80 h-9 w-full! flex-1 backdrop-blur-sm',
            className?.trigger,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={className?.content}>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value} className={className?.item}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
