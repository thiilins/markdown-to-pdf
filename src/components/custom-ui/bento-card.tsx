import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export const BentoCardComponent = ({
  title,
  desc,
  img,
  colSpan = 'col-span-1',
  delay,
  icon: Icon,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      className={`${colSpan} group relative h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900`}>
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className='h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className='absolute inset-0 bg-slate-950/60 transition-colors duration-500 group-hover:bg-slate-950/50' />
        <div className='absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent' />
      </div>

      <div className='relative z-10 flex h-full flex-col justify-end p-8'>
        <div className='mb-4 w-fit rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
          {Icon ? (
            <Icon className='h-6 w-6 text-white' />
          ) : (
            <Sparkles className='h-6 w-6 text-white' />
          )}
        </div>
        <h3 className='mb-2 text-3xl leading-tight font-bold text-white'>{title}</h3>
        <p className='text-lg leading-relaxed font-light text-slate-300'>{desc}</p>
        <div className='mt-6 h-1 w-12 bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full' />
      </div>
    </motion.div>
  )
}
