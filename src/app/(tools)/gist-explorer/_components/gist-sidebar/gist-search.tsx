'use client'

import { handleSignInWithGitHub } from '@/app/actions/auth'
import { ConditionalRender } from '@/components/custom-ui/conditional-render'
import { SwitchComponent } from '@/components/custom-ui/switch'
import { CustomTabsComponent } from '@/components/custom-ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGist } from '@/shared/contexts/gistContext'
import { BookHeart, FileSearch, LogIn, Search, SearchCode } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
export const GistSearch = () => {
  const {
    onSearch,
    searchUser,
    setSearchUser,
    isLoading,
    onGetGists,
    types,
    handleSetTypes,
    handleResetData,
    gistType,
    setGistType,
  } = useGist()
  const { status } = useSession()
  const handleGetMyGists = useCallback(async () => {
    await onGetGists({ type: types?.myGists })
  }, [types?.myGists, onGetGists])

  const handleSearch = useCallback(async () => {
    if (searchUser.trim()) {
      await onSearch({ username: searchUser.trim(), type: types?.allGists })
    }
  }, [searchUser, types?.allGists, onSearch])

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
          value: 'allGists',
          icon: FileSearch,
          label: 'Buscar Gists',
          className: {
            icon: 'text-primary',
            label: 'text-primary',
          },
          content: (
            <div className='space-y-2'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Digite o usuário do GitHub...'
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className='flex-1 bg-white shadow-none'
                />
                <Button
                  size='icon'
                  onClick={handleSearch}
                  className='rounded-full'
                  disabled={isLoading || !searchUser.trim()}>
                  <Search className='h-4 w-4' />
                </Button>
              </div>
              <ConditionalRender condition={!!searchUser}>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='include-all'
                    checked={types?.allGists === 'all'}
                    onCheckedChange={(checked) =>
                      handleSetTypes('allGists', checked ? 'all' : ('public' as GistType))
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor='include-all'
                    className='text-muted-foreground cursor-pointer text-xs font-normal'>
                    Buscar todos os gists (pode demorar mais)
                  </Label>
                </div>
              </ConditionalRender>
            </div>
          ),
        },
      },
      {
        condition: status === 'unauthenticated',
        config: {
          value: 'myGists',
          label: 'Acessar Meus Gists',
          icon: LogIn,
          content: (
            <Button
              variant='outline'
              className='w-full'
              onClick={() => handleSignInWithGitHub()}
              disabled={isLoading}>
              <LogIn className='mr-2 h-4 w-4' />
              Entrar com GitHub
            </Button>
          ),
        },
      },
      {
        condition: status === 'authenticated',
        config: {
          icon: BookHeart,
          value: 'my-gists',
          label: 'Meus Gists',
          content: (
            <div className='flex w-full flex-1 items-center gap-2 shadow-none'>
              <SwitchComponent
                id='include-all'
                className={{
                  container: 'flex-1 rounded-md bg-white p-2',
                }}
                label={types?.myGists === 'all' ? 'Públicos e Privados' : 'Públicos'}
                onChange={(checked) =>
                  handleSetTypes('myGists', checked ? 'all' : ('public' as GistType))
                }
                checked={types?.myGists === 'all'}
                disabled={isLoading}
              />
              <Button
                variant='default'
                className='border-primary/30 bg-primary hover:bg-primary/20 h-10 w-10 rounded-[20px] p-2 text-white'
                size='icon'
                onClick={handleGetMyGists}
                disabled={isLoading}>
                <SearchCode className='h-4 w-4 text-white' />
              </Button>
            </div>
          ),
        },
      },
    ]
    return options.filter((option) => option.condition).map((option) => option.config)
  }, [
    status,
    handleKeyPress,
    handleSearch,
    types?.allGists,
    setSearchUser,
    isLoading,
    handleSetTypes,
    searchUser,
    handleGetMyGists,
    types?.myGists,
  ])
  return (
    <div className='bg-primary/20 space-y-4 border-b p-4'>
      <CustomTabsComponent
        tabs={tabs}
        defaultValue='general'
        activeTab={gistType}
        setActiveTab={(value) => setGistType(value as any)}
      />
    </div>
  )
}
