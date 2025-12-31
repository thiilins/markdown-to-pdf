'use client'

import { Sheet, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CircleX, Code, Layout, Palette, RotateCcw, Type } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { SheetContentComponent } from '../custom-ui/sheet-component'
import { IconButtonTooltip } from '../custom-ui/tooltip'
import { CONFIG_MODAL_SHOW_OPTIONS } from './constants'
import { EditorConfigComponent } from './editor'
import { PageSizeConfigComponent } from './page-size'
import { ThemeConfigComponent } from './theme'
import { TypographyConfigComponent } from './typography'
import { useApp } from '@/shared/contexts/appContext'

export function SettingsDialog() {
  const pathname = usePathname()
  const { resetConfig, setIsConfigOpen, isConfigOpen } = useApp()
  const configTabs = useMemo(() => {
    const tabsOptions: SettingCardModalProps[] = [
      {
        value: 'page',
        label: 'Página',
        icon: Layout,
        content: <PageSizeConfigComponent key='page' />,
      },
      {
        value: 'typography',
        label: 'Tipografia',
        icon: Type,
        content: <TypographyConfigComponent key='typography' />,
      },
      {
        value: 'theme',
        label: 'Tema',
        icon: Palette,
        content: <ThemeConfigComponent key='theme' />,
      },
      {
        value: 'editor',
        label: 'Editor',
        icon: Code,
        content: <EditorConfigComponent key='editor' />,
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
      <SheetContentComponent
        disabledCloseButton
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
              variant='outline'
              icon={CircleX}
              className={{
                button:
                  'bg-primary hover:bg-primary/80 text-primary-foreground hover:text-primary-foreground',
              }}
              onClick={() => setIsConfigOpen(false)}
              content='Fechar'
            />
          </div>
        </div>
        <Tabs defaultValue={configTabs.defaultTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-4 p-1'>
            {configTabs.tabs.map((tab, index) => (
              <TabsTrigger
                key={(tab?.value || '') + index}
                value={tab?.value || ''}
                className='cursor-pointer p-1'>
                {tab?.icon && <tab.icon className='h-3 w-3' />}
                {tab?.label && <span className='text-[11px] font-medium'>{tab.label}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
          {configTabs.tabs.map((tab) => tab?.content)}
        </Tabs>
      </SheetContentComponent>
    </Sheet>
  )
}
