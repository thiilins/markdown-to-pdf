import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
interface SwitchComponentProps {
  id: string
  label: string
  onChange?: (checked: boolean) => void
  checked?: boolean
  disabled?: boolean
  className?: {
    container?: string
    label?: string
    switch?: string
  }
}
export function SwitchComponent({
  id,
  label,
  onChange,
  checked,
  className,
  disabled,
}: SwitchComponentProps) {
  return (
    <div className={cn('flex items-center space-x-2', className?.container)}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className={cn('cursor-pointer', className?.switch)}
        disabled={disabled}
      />
      <Label
        htmlFor={id}
        className={cn(
          'text-muted-foreground cursor-pointer text-xs font-normal',
          className?.label,
        )}>
        {label}
      </Label>
    </div>
  )
}
export function SwitchComponentRv({
  id,
  label,
  onChange,
  checked,
  className,
  disabled,
}: SwitchComponentProps) {
  return (
    <div className={cn('flex w-full items-center justify-between space-x-2', className?.container)}>
      <Label
        htmlFor={id}
        className={cn(
          'text-muted-foreground cursor-pointer text-xs font-normal',
          className?.label,
        )}>
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className={cn('cursor-pointer', className?.switch)}
        disabled={disabled}
      />
    </div>
  )
}
