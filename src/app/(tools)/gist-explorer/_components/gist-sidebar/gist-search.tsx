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
import { BookHeart, FileSearch, LogIn, Search, SearchCode, Github } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

export const GistSearch = () => {
  const {
    onSearch,
    searchUser,
    setSearchUser,
    isLoading,
    onGetGists,
    types,
    handleSetTypes,
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
    const options = [
      {
        condition: true,
        config: {
          value: 'allGists',
          icon: FileSearch,
          label: 'Explorar',
          className: {
            icon: 'h-4 w-4',
            label: 'font-medium',
          },
          content: (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className='space-y-3 pt-3'>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <Github className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4 opacity-50' />
                  <Input
                    placeholder='Usuário do GitHub...'
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className='bg-background focus:ring-primary/20 h-9 pl-9 shadow-sm transition-all focus:ring-1'
                  />
                </div>
                <Button
                  size='icon'
                  onClick={handleSearch}
                  className='h-9 w-9 shrink-0 shadow-sm'
                  disabled={isLoading || !searchUser.trim()}>
                  <Search className='h-4 w-4' />
                </Button>
              </div>

              <ConditionalRender condition={!!searchUser}>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className='bg-muted/30 flex items-center space-x-2 rounded-md border border-dashed p-2'>
                  <Checkbox
                    id='include-all'
                    checked={types?.allGists === 'all'}
                    onCheckedChange={(checked) =>
                      handleSetTypes('allGists', checked ? 'all' : ('public' as any))
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor='include-all'
                    className='text-muted-foreground cursor-pointer text-xs font-normal'>
                    Deep Search (Incluir Secretos)
                  </Label>
                </motion.div>
              </ConditionalRender>
            </motion.div>
          ),
        },
      },
      {
        condition: status === 'unauthenticated',
        config: {
          value: 'myGists',
          label: 'Entrar',
          icon: LogIn,
          content: (
            <div className='pt-3'>
              <Button
                variant='outline'
                className='bg-muted/20 hover:bg-muted/40 w-full gap-2 border-dashed'
                onClick={() => handleSignInWithGitHub()}
                disabled={isLoading}>
                <LogIn className='h-4 w-4' />
                Conectar GitHub
              </Button>
            </div>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex w-full flex-1 items-center gap-2 pt-3'>
              <SwitchComponent
                id='include-all'
                className={{
                  container:
                    'border-border/50 bg-background hover:border-primary/20 flex-1 rounded-lg border p-2 transition-colors',
                }}
                label={types?.myGists === 'all' ? 'Todos (Públicos + Secretos)' : 'Apenas Públicos'}
                onChange={(checked) =>
                  handleSetTypes('myGists', checked ? 'all' : ('public' as any))
                }
                checked={types?.myGists === 'all'}
                disabled={isLoading}
              />
              <Button
                variant='default'
                className='h-10 w-10 shrink-0 rounded-lg shadow-sm transition-transform active:scale-95'
                size='icon'
                onClick={handleGetMyGists}
                disabled={isLoading}>
                <SearchCode className='h-4 w-4' />
              </Button>
            </motion.div>
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
    <CustomTabsComponent
      tabs={tabs}
      defaultValue='allGists'
      activeTab={gistType}
      setActiveTab={(value) => setGistType(value as any)}
    />
  )
}
