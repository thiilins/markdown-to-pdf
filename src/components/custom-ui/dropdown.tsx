'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Dropdowncomponent = ({ trigger, content }: DropdownComponentProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        {content.map((item) => {
          if (item.type === 'item') {
            return <DropdownMenuItem key={item.key}>{item.component}</DropdownMenuItem>
          } else if (item.type === 'separator') {
            return <DropdownMenuSeparator key={item.key} />
          } else if (item.type === 'solo') {
            return item.component
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
