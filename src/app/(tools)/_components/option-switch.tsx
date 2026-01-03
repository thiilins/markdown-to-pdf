import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface OptionSwitchProps {
  description: string
  id: string
  label: string
  icon?: React.ElementType
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}
export const OptionSwitch = ({
  description,
  id,
  label,
  icon: Icon,
  checked,
  onCheckedChange,
}: OptionSwitchProps) => (
  <div key={id} className='flex items-center justify-between'>
    <div className='flex items-center gap-2'>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className='cursor-pointer text-xs font-medium'>
        {Icon && <Icon className='text-muted-foreground h-3.5 w-3.5 shrink-0' />}
        {label}
      </Label>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Info className='text-muted-foreground h-3.5 w-3.5 shrink-0 cursor-help' />
          </TooltipTrigger>
          <TooltipContent side='right' className='max-w-xs px-3 py-2 text-xs'>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
)
