import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { ConditionalRender } from './conditional-render'

export const TabsComponent = ({ tabs, className, defaultValue }: TabsComponentProps) => {
  return (
    <Tabs defaultValue={defaultValue} className={cn('w-full', className?.root)}>
      {/* List Container - Estilo Minimalista Segmentado */}
      <TabsList
        className={cn(
          'bg-muted/50 text-muted-foreground inline-flex h-11 w-full items-center justify-center rounded-xl p-1 sm:w-auto',
          className?.list,
        )}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              // Base: Reset de estilos e transições
              'focus-visible:ring-ring inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
              // Estado Ativo: Fundo branco, texto destacado e sombra suave
              'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
              // Hover sutil para abas não ativas
              'hover:text-foreground/80 cursor-pointer',
              className?.trigger,
            )}>
            {tab.icon && <tab.icon className={cn('h-4 w-4', tab?.className?.icon)} />}
            {tab.label && (
              <span className={cn('text-sm font-medium', tab?.className?.label)}>{tab.label}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content Area - Espaçamento limpo e animação de entrada suave */}
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn(
            'ring-offset-background focus-visible:ring-ring animate-in fade-in-50 mt-4 duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            className?.content,
          )}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export const CustomTabsComponent = ({
  tabs,
  className,
  defaultValue,
  activeTab,
  setActiveTab,
}: CustomTabsComponentProps) => {
  return (
    <main defaultValue={defaultValue} className={cn('w-full', className?.root)}>
      <nav
        className={cn(
          'bg-primary/30 text-muted-foreground grid h-11 w-full grid-cols-2 items-center justify-center gap-2 rounded-md p-1',
          className?.list,
        )}>
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant='ghost'
            size='sm'
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'hover:bg-primary text-primary h-9 cursor-pointer gap-2 bg-white transition-colors hover:text-white',
              activeTab === tab.value &&
                'bg-primary hover:bg-primary/90 text-white transition-colors hover:text-white',
            )}>
            {tab.icon && <tab.icon className='h-4 w-4 shrink-0' />}
            <span>{tab.label}</span>
          </Button>
        ))}
      </nav>

      {/* Content Area - Espaçamento limpo e animação de entrada suave */}
      {tabs.map((tab) => (
        <ConditionalRender key={tab.value} condition={activeTab === tab.value}>
          <div
            className={cn(
              'ring-offset-background focus-visible:ring-ring animate-in fade-in-50 mt-4 duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              className?.content,
            )}>
            {tab.content}
          </div>
        </ConditionalRender>
      ))}
    </main>
  )
}
