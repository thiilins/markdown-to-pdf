'use client'

import { handleSignInWithGitHub } from '@/app/actions/auth'
import { SwitchComponent } from '@/components/custom-ui/switch'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGist } from '@/shared/contexts/gistContext'
import { BadgeCheck, LogIn, Search, SearchCode } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface GistSearchProps {
  onSearch: (username: string, includeAll?: boolean) => void
  onLoadMyGists: (includeAll?: boolean) => void
  loading?: boolean
}

export const GistSearch = () => {
  const { onSearch, onGetGists, loading, searchUser, setSearchUser, typeAllGists } = useGist()
  const { status } = useSession()
  const handleSearch = async () => {
    if (searchUser.trim()) {
      await onSearch({ username: searchUser.trim(), type: typeAllGists })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchUser.trim()) {
      handleSearch()
    }
  }

  return (
    <div className='space-y-4 border-b p-4'>
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <Input
            placeholder='Digite o usuário do GitHub...'
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            className='flex-1'
          />
          <Button size='icon' onClick={handleSearch} disabled={loading || !searchUser.trim()}>
            <Search className='h-4 w-4' />
          </Button>
        </div>
        {searchUser && <SearchUserComponent />}
      </div>
      {status === 'authenticated' && <AuthenticatedSearch />}
      {status === 'unauthenticated' && <UnauthenticatedSearch />}
    </div>
  )
}
const AuthenticatedSearch = () => {
  const { typeMyGists, setTypeMyGists, loading, onGetGists } = useGist()
  const handleGetMyGists = async () => {
    await onGetGists({ type: typeMyGists })
  }
  return (
    <div className='border-primary/30 bg-primary/10 flex flex-col items-start gap-2 rounded-md border-2 p-2'>
      <p className='text-primary flex items-center gap-2 px-1 text-[12px]'>
        <BadgeCheck className='h-4 w-4' />
        Meus Gists
      </p>
      <div className='flex w-full flex-1 items-center gap-2'>
        <SwitchComponent
          id='include-all'
          className={{
            container: 'flex-1 rounded-md bg-white/50 p-2',
          }}
          label={typeMyGists === 'all' ? 'Públicos e Privados' : 'Públicos'}
          onChange={(checked) => setTypeMyGists(checked ? 'all' : 'public')}
          checked={typeMyGists === 'all'}
          disabled={loading}
        />
        <Button
          variant='default'
          className='border-primary/30 bg-primary hover:bg-primary/20 h-10 w-10 rounded-[20px] p-2 text-white'
          size='icon'
          onClick={handleGetMyGists}
          disabled={loading}>
          <SearchCode className='h-4 w-4 text-white' />
        </Button>
      </div>
    </div>
  )
}

const UnauthenticatedSearch = () => {
  const { loading } = useGist()
  return (
    <Button
      variant='outline'
      className='w-full'
      onClick={() => handleSignInWithGitHub()}
      disabled={loading}>
      <LogIn className='mr-2 h-4 w-4' />
      Entrar com GitHub
    </Button>
  )
}

const SearchUserComponent = () => {
  const { typeAllGists, setTypeAllGists, loading } = useGist()
  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id='include-all'
        checked={typeAllGists === 'all'}
        onCheckedChange={(checked) => setTypeAllGists(checked ? 'all' : 'public')}
        disabled={loading}
      />
      <Label
        htmlFor='include-all'
        className='text-muted-foreground cursor-pointer text-xs font-normal'>
        Buscar todos os gists (pode demorar mais)
      </Label>
    </div>
  )
}
