import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'

export const UserAvatar = ({
  image,
  fallback = 'User',
  className = 'h-7 w-7',
}: {
  image: string
  fallback: string
  className?: string
}) => {
  const fallbackName = fallback.slice(0, 2).toUpperCase()
  return (
    <Avatar className={className}>
      <AvatarImage src={image || ''} alt={fallback || ''} />
      <AvatarFallback>{fallbackName}</AvatarFallback>
    </Avatar>
  )
}
