import { Maximize2 } from 'lucide-react'
import { SVGRenderer, SVGTemplate } from '../svg-loader'
import { VisualizerLoading } from './loading'

export const VisualizerTemplates = ({
  templates,
  activeCategory,
  colorVariables,
  setHoverData,
  handleCopy,
  setFullscreenId,
  loading,
}: {
  loading: boolean
  templates: SVGTemplate[]
  activeCategory: string
  colorVariables: any
  setHoverData: (color: { color: string; x: number; y: number } | null) => void
  handleCopy: (color: string) => void
  setFullscreenId: (id: string) => void
}) => {
  if (loading) return <VisualizerLoading />
  return (
    <div className='grid grid-cols-1 gap-12 bg-transparent md:grid-cols-2'>
      {templates
        .filter((t) => activeCategory === 'all' || t.category === activeCategory)
        .map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
            colorVariables={colorVariables}
            setHoverData={setHoverData}
            handleCopy={handleCopy}
            setFullscreenId={setFullscreenId}
          />
        ))}
    </div>
  )
}

const TemplateItem = ({
  template,
  colorVariables,
  setHoverData,
  handleCopy,
  setFullscreenId,
}: {
  template: SVGTemplate
  colorVariables: any
  setHoverData: (color: { color: string; x: number; y: number } | null) => void
  handleCopy: (color: string) => void
  setFullscreenId: (id: string) => void
}) => {
  return (
    <div key={template.id} className='group flex flex-col gap-4'>
      <div
        className='relative aspect-16/15 overflow-hidden rounded-md bg-[#F2F2F2] shadow-2xl transition-all'
        style={colorVariables as any}>
        <div className='flex h-full w-full items-center justify-center p-4 transition-transform duration-700 group-hover:scale-[1.01]'>
          <SVGRenderer
            template={template}
            onHover={(color, x, y) => setHoverData(color ? { color, x: x!, y: y! } : null)}
            onCopy={handleCopy}
          />
        </div>
        <button
          className='absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-2xl transition-opacity group-hover:opacity-100'
          onClick={() => setFullscreenId(template.id)}>
          <Maximize2 size={24} />
        </button>
      </div>
      <h3 className='text-primary px-6 text-[10px] font-black tracking-[0.3em] uppercase'>
        {template.name}
      </h3>
    </div>
  )
}
