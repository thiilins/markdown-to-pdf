import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SVGRenderer, SVGTemplate } from '../svg-loader'
export const FullscreenPreviewVisualizer = ({
  fullscreenId,
  colorVariables,
  setFullscreenId,
  templates,
  setHoverData,
  handleCopy,
}: {
  fullscreenId: string | null
  colorVariables: any
  setFullscreenId: (id: string | null) => void
  templates: SVGTemplate[]
  setHoverData: (color: { color: string; x: number; y: number } | null) => void
  handleCopy: (color: string) => void
}) => {
  return (
    <AnimatePresence>
      {fullscreenId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-100 flex flex-col overflow-hidden bg-[#F5F5F7]'
          style={colorVariables as any}>
          {/* Botão fechar flutuante gigante */}
          <button
            onClick={() => setFullscreenId(null)}
            className='absolute top-8 right-8 z-110 rounded-full bg-black/5 p-5 transition-colors hover:bg-black/10'>
            <X size={40} />
          </button>

          <div className='flex flex-1 items-center justify-center p-0 md:p-20'>
            <div className='h-full max-h-screen w-full max-w-[100vw]'>
              {templates.find((t) => t.id === fullscreenId) && (
                <SVGRenderer
                  template={templates.find((t) => t.id === fullscreenId)!}
                  onHover={(color, x, y) => setHoverData(color ? { color, x: x!, y: y! } : null)}
                  onCopy={handleCopy}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
