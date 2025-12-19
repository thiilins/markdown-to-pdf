import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface GenericCardTitleProps {
  text: string
  className: string
}
interface GenericCardDescriptionProps {
  text: string
  className: string
}
interface GenericCardProps {
  icon: React.ReactNode
  title: GenericCardTitleProps
  description: GenericCardDescriptionProps
}
export const GenericCard = ({ icon, title, description }: GenericCardProps) => {
  return (
    <Card className='flex h-full flex-col items-center justify-center p-8 text-center'>
      {icon}
      <h3 className={cn(title.className)}>{title.text}</h3>
      <p className={cn(description.className)}>{description.text}</p>
    </Card>
  )
}
