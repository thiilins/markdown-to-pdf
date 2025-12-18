'use client'

import { handleSignInWithGitHub } from '@/app/actions/auth'
import { SwitchComponent } from '@/components/custom-ui/switch'
import { TabsComponent } from '@/components/custom-ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGist } from '@/shared/contexts/gistContext'
import { BookHeart, FileSearch, LogIn, Search, SearchCode } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
export const GistSearch = () => {
  const { onSearch, searchUser, typeAllGists } = useGist()
  const { status } = useSession()
  const handleSearch = useCallback(async () => {
    if (searchUser.trim()) {
      await onSearch({ username: searchUser.trim(), type: typeAllGists })
    }
  }, [searchUser, typeAllGists, onSearch])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchUser.trim()) {
        handleSearch()
      }
    },
    [searchUser, handleSearch],
  )

  const tabs = useMemo(() => {
    const options: TabsConditionalItel[] = [
      {
        condition: true,
        config: {
          value: 'general',
          icon: FileSearch,
          label: 'Buscar Gists',
          className: {
            icon: 'text-primary',
            label: 'text-primary',
          },
          content: (
            <GeneralSearchComponent handleKeyPress={handleKeyPress} handleSearch={handleSearch} />
          ),
        },
      },
      {
        condition: status === 'authenticated',
        config: {
          icon: BookHeart,
          value: 'my-gists',
          label: 'Meus Gists',
          content: <AuthenticatedSearch />,
        },
      },
    ]
    return options.map((option) => option.config)
  }, [status, handleKeyPress, handleSearch])
  return (
    <div className='bg-primary/20 space-y-4 border-b p-4'>
      <TabsComponent tabs={tabs} defaultValue='general' />
    </div>
  )
}
const GeneralSearchComponent = ({
  handleKeyPress,
  handleSearch,
}: {
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleSearch: () => void
}) => {
  const { searchUser, setSearchUser, loading } = useGist()
  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          placeholder='Digite o usuário do GitHub...'
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          className='flex-1 bg-white shadow-none'
        />
        <Button
          size='icon'
          onClick={handleSearch}
          className='rounded-full'
          disabled={loading || !searchUser.trim()}>
          <Search className='h-4 w-4' />
        </Button>
      </div>
      {searchUser && <SearchUserComponent />}
    </div>
  )
}
const AuthenticatedSearch = () => {
  const { typeMyGists, setTypeMyGists, loading, onGetGists } = useGist()
  const { status } = useSession()
  if (status === 'unauthenticated') {
    return <UnauthenticatedSearch />
  }
  const handleGetMyGists = async () => {
    await onGetGists({ type: typeMyGists })
  }
  return (
    <div className='flex w-full flex-1 items-center gap-2 shadow-none'>
      <SwitchComponent
        id='include-all'
        className={{
          container: 'flex-1 rounded-md bg-white p-2',
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
