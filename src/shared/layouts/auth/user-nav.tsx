// src/shared/layouts/auth/user-nav.tsx
'use client' // Importante: agora é Client Component

import { handleSignInWithGitHub } from '@/app/actions/auth'
import { Dropdowncomponent } from '@/components/custom-ui/dropdown'
import { Button } from '@/components/ui/button'
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { clearAllDatabases } from '@/shared/utils'
import { formatDateWithTime } from '@/shared/utils/format-date'
import { BrushCleaning, LogIn, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react' // Importa tudo do react
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { INVALID_AUTH_STATUS } from './_components/constants'
import { UserAvatar } from './_components/user-avatar'

export default function UserNav() {
  const { status } = useSession() // Hook mágico

  const content: Record<AuthStatus, React.ReactNode> = {
    loading: <LoadingUserNav />,
    authenticated: <LoggedInUserNav />,
    unauthenticated: <LoggedOutUserNav />,
  }
  return content[status]
}

export const LoggedInUserNav = () => {
  const { data: session, status } = useSession() // Hook mágico
  if (INVALID_AUTH_STATUS.includes(status) || !session?.user) return null

  const content: DropdownContentProps[] = [
    { type: 'solo', key: 'user-details', component: <UserDetailsLabel key='user-details' /> },
    { type: 'separator', key: 'separator' },
    { type: 'item', key: 'reset-data', component: <ResetDataButton key='reset-data' /> },
    { type: 'item', key: 'logout', component: <LogoutButton key='logout' /> },
  ]

  const trigger = (
    <Button
      variant='ghost'
      className='bg-primary/50 relative flex h-9 w-9 items-center gap-2 rounded-full'>
      <UserAvatar image={session?.user?.image || ''} fallback={session?.user?.name || ''} />
    </Button>
  )

  return <Dropdowncomponent trigger={trigger} content={content} />
}
export const LoggedOutUserNav = () => {
  return (
    <Button variant='outline' size='sm' onClick={handleSignInWithGitHub}>
      <LogIn className='h-4 w-4' /> Entrar com GitHub
    </Button>
  )
}
export const LoadingUserNav = () => {
  return <div className='bg-muted h-8 w-8 animate-pulse rounded-full' />
}

export const UserDetailsLabel = () => {
  const { data: session, status } = useSession() // Hook mágico
  if (INVALID_AUTH_STATUS.includes(status) || !session?.user) return null
  return (
    <DropdownMenuLabel className='flex flex-col space-y-1 text-center font-normal'>
      <p className='text-sm leading-none font-medium'>{session?.user?.name}</p>
      <p className='text-muted-foreground text-xs leading-none'>{session?.user?.email}</p>
      <p className='text-muted-foreground text-[10px]'>
        {formatDateWithTime(session?.expires, 'America/Sao_Paulo')}
      </p>
    </DropdownMenuLabel>
  )
}
export const ResetDataButton = () => {
  const handleResetData = useCallback(async () => {
    await clearAllDatabases()
    localStorage.clear()
    window.location.reload()
  }, [])
  return (
    <Button variant='ghost' size='sm' onClick={handleResetData}>
      <BrushCleaning className='h-4 w-4' /> Limpar Cache Local
    </Button>
  )
}
export const LogoutButton = () => {
  const router = useRouter()
  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false, callbackUrl: '/' })
    router.refresh()
    router.push('/')
  }, [router])
  return (
    <Button
      variant='ghost'
      size='sm'
      className='w-full cursor-pointer justify-start rounded-[10px] bg-red-500/20 p-2 text-red-500 hover:bg-red-500/10 hover:text-red-500'
      onClick={handleLogout}>
      <LogOut className='mr-2 h-4 w-4 text-red-500' /> Sair
    </Button>
  )
}
