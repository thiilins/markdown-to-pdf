'use client'
import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { cn } from '@/lib/utils'
import { MonitorCog, RotateCcw, Share2 } from 'lucide-react'
const colorMap = {
  primary: 'from-blue-500/10 text-blue-600 bg-blue-50 ring-blue-500/15',
  purple: 'from-purple-500/10 text-purple-600 bg-purple-50 ring-purple-500/15',
  emerald: 'from-emerald-500/10 text-emerald-600 bg-emerald-50 ring-emerald-500/15',
  rose: 'from-rose-500/10 text-rose-600 bg-rose-50 ring-rose-500/15',
  amber: 'from-amber-500/10 text-amber-600 bg-amber-50 ring-amber-500/15',
  cyan: 'from-cyan-500/10 text-cyan-600 bg-cyan-50 ring-cyan-500/15',
  indigo: 'from-indigo-500/10 text-indigo-600 bg-indigo-50 ring-indigo-500/15',
  teal: 'from-teal-500/10 text-teal-600 bg-teal-50 ring-teal-500/15',
  fuchsia: 'from-fuchsia-500/10 text-fuchsia-600 bg-fuchsia-50 ring-fuchsia-500/15',
  violet: 'from-violet-500/10 text-violet-600 bg-violet-50 ring-violet-500/15',
  lime: 'from-lime-500/10 text-lime-600 bg-lime-50 ring-lime-500/15',
  sky: 'from-sky-500/10 text-sky-600 bg-sky-50 ring-sky-500/15',
  orange: 'from-orange-500/10 text-orange-600 bg-orange-50 ring-orange-500/15',
  slate: 'from-slate-500/10 text-slate-600 bg-slate-100 ring-slate-500/15',
}
type ColorClass = keyof typeof colorMap
export const ControlHeader = ({
  handleShare,
  resetConfig,
}: {
  handleShare: () => void
  resetConfig: () => void
}) => {
  return (
    <header className='relative flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-5'>
      {/* Detalhe de gradiente sutil no topo para dar profundidade */}
      <div className='absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-500/20 via-fuchsia-500/20 to-transparent' />

      <div className='flex items-center gap-4'>
        {/* Ícone Principal com o novo padrão de UX (Anel sutil e respiro) */}
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 shadow-sm ring-4 ring-violet-500/10'>
          <MonitorCog className='h-5.5 w-5.5' />
        </div>

        <div className='flex flex-col'>
          <h2 className='mb-1.5 text-base leading-none font-bold tracking-tight text-slate-900'>
            Configurações do Canva
          </h2>
          <p className='text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase'>
            Painel do Canva
          </p>
        </div>
      </div>

      {/* Ações Globais */}
      <div className='flex items-center gap-2.5'>
        <IconButtonTooltip
          content='Resetar Configurações'
          onClick={resetConfig}
          icon={RotateCcw}
          className={{
            button: cn(
              'h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-500 transition-all',
              'shadow-sm hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 active:scale-95',
            ),
          }}
        />

        <IconButtonTooltip
          content='Compartilhar via URL'
          onClick={handleShare}
          icon={Share2}
          className={{
            button: cn(
              'h-9 w-9 rounded-xl border border-violet-100 bg-violet-600 text-white transition-all',
              'shadow-sm hover:bg-violet-700 hover:text-white hover:shadow-md hover:shadow-violet-200 active:scale-95',
            ),
          }}
        />
      </div>
    </header>
  )
}
interface WidgetWrapperProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: React.ElementType
  colorClass: ColorClass
}
export const WidgetWrapper = ({
  children,
  title,
  subtitle,
  icon: Icon,
  colorClass = 'purple',
}: WidgetWrapperProps) => {
  const selectedColor = colorMap[colorClass]

  return (
    <section className='bg-whitetransition-all overflow-hidden rounded-lg border border-slate-200 hover:border-slate-300'>
      <div
        className={cn(
          'bg-linear-to-b px-6 pt-6 pb-4',
          selectedColor?.split(' ')[0],
          'to-transparent',
        )}>
        <div className='flex items-center gap-4'>
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 transition-transform',
              selectedColor.split(' ').slice(1).join(' '),
            )}>
            <Icon className='h-4.5 w-4.5' />
          </div>
          <div className='flex flex-col'>
            <h3 className='mb-1 text-sm leading-none font-bold tracking-tight text-slate-900'>
              {title}
            </h3>
            <p className='text-[10px] font-semibold tracking-[0.05em] text-slate-500/80 uppercase'>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className='space-y-6 px-6 pb-6'>{children}</div>
    </section>
  )
}
