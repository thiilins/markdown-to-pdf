import chroma from 'chroma-js'
import { AnimatePresence, motion } from 'framer-motion'
export const VisualizerTooltip = ({
  hoverData,
}: {
  hoverData: { color: string; x: number; y: number } | null
}) => {
  if (!hoverData) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className='pointer-events-none fixed z-10000 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-black shadow-2xl'
        style={{ left: hoverData.x + 20, top: hoverData.y + 20 }}>
        <div
          className='h-3 w-3 rounded-full border border-white/20'
          style={{ backgroundColor: hoverData.color }}
        />
        <span className='font-mono text-xs font-black text-black'>
          {chroma(hoverData.color).hex().toUpperCase()}
        </span>
      </motion.div>
    </AnimatePresence>
  )
}
