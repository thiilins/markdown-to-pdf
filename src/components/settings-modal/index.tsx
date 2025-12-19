'use client'

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useConfig } from '@/shared/contexts/configContext'
import { CircleX, Code, Layout, Palette, RotateCcw, Type } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { IconButtonTooltip } from '../custom-ui/tooltip'
import { CONFIG_MODAL_SHOW_OPTIONS } from './constants'
import { EditorConfigComponent } from './editor'
import { PageSizeConfigComponent } from './page-size'
import { ThemeConfigComponent } from './theme'
import { TypographyConfigComponent } from './typography'

export function SettingsDialog() {
  const pathname = usePathname()
  const { resetConfig, setIsConfigOpen, isConfigOpen } = useConfig()

  const configTabs = useMemo(() => {
    const tabsOptions: SettingCardModalProps[] = [
      {
        value: 'page',
        label: 'Página',
        icon: Layout,
        content: <PageSizeConfigComponent />,
      },
      {
        value: 'typography',
        label: 'Tipografia',
        icon: Type,
        content: <TypographyConfigComponent />,
      },
      {
        value: 'theme',
        label: 'Tema',
        icon: Palette,
        content: <ThemeConfigComponent />,
      },
      {
        value: 'editor',
        label: 'Editor',
        icon: Code,
        content: <EditorConfigComponent />,
      },
    ]
    const config = CONFIG_MODAL_SHOW_OPTIONS?.[pathname]
    const globalConfig = CONFIG_MODAL_SHOW_OPTIONS?.['*']
    return {
      tabs: (config || globalConfig).map((tab) => tabsOptions.find((t) => t.value === tab)),
      defaultTab: config?.[0] || globalConfig?.[0] || 'theme',
    }
  }, [pathname])
  return (
    <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen} defaultOpen>
      <SheetContent
        side='right'
        className='min-h-full w-full max-w-[500px] overflow-y-auto px-4 pb-6 sm:max-w-[500px]'>
        <div className='flex items-center justify-between gap-4 p-3'>
          <div className='flex flex-col gap-1 text-start'>
            <SheetTitle>Configurações do Documento</SheetTitle>
            <SheetDescription className='text-muted-foreground text-[11px]'>
              Personalize o tamanho da página, tipografia e outras opções de formatação.
            </SheetDescription>
          </div>
          <div className='flex items-center gap-3'>
            <IconButtonTooltip
              icon={RotateCcw}
              onClick={resetConfig}
              content='Resetar configurações'
            />
            <IconButtonTooltip
              variant='destructive'
              icon={CircleX}
              onClick={() => setIsConfigOpen(false)}
              content='Fechar'
            />
          </div>
        </div>
        <Tabs defaultValue={configTabs.defaultTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-4 p-1'>
            {configTabs.tabs.map((tab) => (
              <TabsTrigger
                key={tab?.value || ''}
                value={tab?.value || ''}
                className='cursor-pointer p-1'>
                {tab?.icon && <tab.icon className='h-3 w-3' />}
                {tab?.label && <span className='text-[11px] font-medium'>{tab.label}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
          {configTabs.tabs.map((tab) => tab?.content)}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
