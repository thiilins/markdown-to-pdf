import { cn } from '@/lib/utils'

export const VisualizerHeader = ({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string
  setActiveCategory: (category: string) => void
}) => {
  return (
    <header className='z-40 border-b border-neutral-200 bg-white/80 px-8 py-6 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <h1 className='text-xl font-black tracking-tighter uppercase'>Visualizador</h1>
        <nav className='flex gap-1'>
          {['all', 'interface', 'branding', 'typo', 'pattern', 'illustration'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-full px-5 py-2 text-[10px] font-black uppercase transition-all',
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'text-neutral-400 hover:bg-neutral-100',
              )}>
              {cat === 'all' ? 'Tudo' : cat}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
