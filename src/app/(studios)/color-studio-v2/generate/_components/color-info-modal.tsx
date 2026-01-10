'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getColorPsychology } from '@/shared/utils/color-psychology'
import chroma from 'chroma-js'
import { motion } from 'framer-motion'
import {
  Check,
  ChevronRight,
  Copy,
  Droplets,
  Grid3X3,
  Hash,
  Lightbulb,
  Palette,
  Type,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ColorInfoModalProps {
  hex: string
  name: string
  isOpen: boolean
  onClose: () => void
}

export function ColorInfoModal({ hex, name, isOpen, onClose }: ColorInfoModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  if (!chroma.valid(hex)) return null

  const color = chroma(hex)
  const psychologyData = getColorPsychology(hex)

  // Contraste e Cores de Texto
  const whiteContrast = chroma.contrast(hex, 'white')
  const blackContrast = chroma.contrast(hex, 'black')
  const bestTextColor = whiteContrast > blackContrast ? 'white' : 'black'
  const isLight = bestTextColor === 'black'

  // Shades (Gerando 11 tons)
  const shades = chroma.scale(['white', hex, 'black']).mode('lch').colors(13).slice(1, -1)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFormat(label)
    toast.success(`${label} copiado!`)
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  const formatValue = (values: number[], suffix = '') =>
    values.map((v) => Math.round(v)).join(', ') + suffix

  const formats = [
    { label: 'HEX', value: hex.toUpperCase(), icon: Hash },
    { label: 'RGB', value: `rgb(${formatValue(color.rgb())})`, icon: Palette },
    {
      label: 'HSL',
      value: `hsl(${formatValue(color.hsl(), '%').replace(', ', 'deg, ').replace('%', '%, ').replace('%,', '%')})`,
      icon: Droplets,
    },
    {
      label: 'CMYK',
      value: `cmyk(${formatValue(
        color.cmyk().map((v) => v * 100),
        '%',
      )})`,
      icon: Palette,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md overflow-hidden rounded-3xl border-0 p-0 shadow-2xl outline-none sm:max-w-lg'>
        {/* Título Invisível para Acessibilidade */}
        <DialogTitle className='sr-only'>Detalhes da cor {name}</DialogTitle>

        <div className='flex h-[85vh] flex-col bg-neutral-50 sm:h-[700px] dark:bg-neutral-950'>
          {/* --- HERO HEADER (Cor no Topo) --- */}
          <div
            className='relative flex h-[280px] w-full shrink-0 flex-col items-center justify-center p-6 transition-colors duration-500'
            style={{ backgroundColor: hex }}>
            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 rounded-full p-2 transition-transform hover:scale-110 active:scale-95 ${
                isLight
                  ? 'bg-black/10 text-black hover:bg-black/20'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}>
              <X size={20} />
            </button>

            {/* Conteúdo Centralizado */}
            <div className='flex flex-col items-center gap-2 text-center'>
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.8, y: 0 }}
                className='text-lg font-medium tracking-wide'
                style={{ color: bestTextColor }}>
                {name}
              </motion.span>

              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(hex, 'HEX')}
                className='group relative'>
                <h2
                  className='font-mono text-5xl font-black tracking-tighter sm:text-6xl'
                  style={{ color: bestTextColor }}>
                  {hex.toUpperCase().replace('#', '')}
                </h2>
                <div
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest whitespace-nowrap uppercase opacity-0 transition-opacity group-hover:opacity-100 ${
                    isLight ? 'text-black/60' : 'text-white/60'
                  }`}>
                  Copiar HEX
                </div>
              </motion.button>
            </div>

            {/* Badges de Contraste (Flutuando na borda inferior) */}
            <div className='absolute bottom-4 flex gap-3'>
              <ContrastBadge bg={hex} text='white' score={whiteContrast} label='Branco' />
              <ContrastBadge bg={hex} text='black' score={blackContrast} label='Preto' />
            </div>
          </div>

          {/* --- CONTEÚDO (Abas Abaixo) --- */}
          <div className='flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-950'>
            <Tabs defaultValue='overview' className='flex h-full flex-col'>
              {/* Navegação das Abas */}
              <div className='border-b border-neutral-100 px-6 dark:border-neutral-800'>
                <TabsList className='flex h-14 w-full justify-between bg-transparent p-0'>
                  <TabTrigger value='overview' label='Visão Geral' icon={Lightbulb} />
                  <TabTrigger value='shades' label='Variações' icon={Grid3X3} />
                  <TabTrigger value='code' label='Código' icon={Hash} />
                </TabsList>
              </div>

              {/* Área de Scroll do Conteúdo */}
              <div className='flex-1 overflow-y-auto'>
                <div className='p-6 pb-10'>
                  {/* ABA 1: VISÃO GERAL (Psicologia & Props) */}
                  <TabsContent
                    value='overview'
                    className='mt-0 space-y-6 focus-visible:outline-none'>
                    {/* Card Significado */}
                    <section className='space-y-3'>
                      <h3 className='flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-500 uppercase'>
                        Psicologia
                      </h3>
                      <div className='rounded-2xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900'>
                        <p className='leading-relaxed text-neutral-700 dark:text-neutral-300'>
                          {psychologyData.meaning}
                        </p>
                        <div className='mt-4 flex flex-wrap gap-2'>
                          {psychologyData.psychology.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className='inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-black/5 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-white/10'>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Aplicações */}
                    <section className='space-y-3'>
                      <h3 className='text-sm font-bold tracking-wider text-neutral-500 uppercase'>
                        Onde Usar
                      </h3>
                      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                        {psychologyData.applications.map((app, i) => (
                          <div
                            key={i}
                            className='flex items-center gap-3 rounded-xl border border-transparent bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all hover:border-blue-100 hover:shadow-md dark:bg-neutral-900 dark:ring-white/10'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30'>
                              <Check size={14} strokeWidth={3} />
                            </div>
                            <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                              {app}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  {/* ABA 2: VARIAÇÕES (Shades) */}
                  <TabsContent
                    value='shades'
                    className='mt-0 overflow-y-auto focus-visible:outline-none'>
                    <div className='grid grid-cols-1 gap-2'>
                      {shades.map((shade) => {
                        const contrast = chroma.contrast(shade, 'white') > 2 ? 'white' : 'black'
                        return (
                          <button
                            key={shade}
                            onClick={() => copyToClipboard(shade, 'Shade')}
                            className='group flex w-full items-center justify-between rounded-xl px-4 py-4 transition-transform active:scale-[0.98]'
                            style={{ backgroundColor: shade }}>
                            <span
                              className='font-mono text-sm font-bold'
                              style={{ color: contrast }}>
                              {shade.toUpperCase()}
                            </span>
                            <span
                              className='flex items-center gap-1 text-xs font-semibold uppercase opacity-0 transition-opacity group-hover:opacity-100'
                              style={{ color: contrast }}>
                              Copiar <ChevronRight size={14} />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </TabsContent>

                  {/* ABA 3: CÓDIGO (Formats) */}
                  <TabsContent
                    value='code'
                    className='mt-0 space-y-4 overflow-y-auto focus-visible:outline-none'>
                    <div className='grid gap-3'>
                      {formats.map((f) => (
                        <div
                          key={f.label}
                          className='flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'>
                          <div className='flex items-center gap-4'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 text-neutral-500 dark:bg-neutral-800'>
                              <f.icon size={18} />
                            </div>
                            <div>
                              <p className='text-[10px] font-bold tracking-wider text-neutral-400 uppercase'>
                                {f.label}
                              </p>
                              <p className='font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100'>
                                {f.value}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => copyToClipboard(f.value, f.label)}>
                            {copiedFormat === f.label ? (
                              <Check size={18} className='text-green-500' />
                            ) : (
                              <Copy size={18} className='text-neutral-400' />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className='rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50'>
                      <h4 className='mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-500 uppercase'>
                        <Type size={14} /> CSS Variable
                      </h4>
                      <code
                        onClick={() =>
                          copyToClipboard(
                            `--${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}: ${hex};`,
                            'CSS',
                          )
                        }
                        className='block cursor-pointer rounded-lg bg-white p-3 font-mono text-xs text-blue-600 hover:bg-blue-50 dark:bg-neutral-950 dark:text-blue-400 dark:hover:bg-blue-900/20'>
                        --{name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}: {hex};
                      </code>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- SUBCOMPONENTES ---

function ContrastBadge({
  bg,
  text,
  score,
  label,
}: {
  bg: string
  text: string
  score: number
  label: string
}) {
  const isPass = score >= 4.5
  const color = text === 'white' ? 'white' : 'black'
  const bgColor = text === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'

  return (
    <div
      className='flex flex-col items-center rounded-lg px-3 py-1.5 backdrop-blur-sm'
      style={{ backgroundColor: bgColor, color: color }}>
      <span className='text-[10px] font-bold uppercase opacity-70'>{label}</span>
      <div className='flex items-center gap-1'>
        <span className='text-lg leading-none font-bold'>{score.toFixed(1)}</span>
        <span className={`text-[10px] ${isPass ? 'opacity-100' : 'opacity-50'}`}>
          {isPass ? '✔' : '✖'}
        </span>
      </div>
    </div>
  )
}

function TabTrigger({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <TabsTrigger
      value={value}
      className='group relative flex flex-1 items-center gap-2 rounded-none border-b-2 border-transparent py-4 text-neutral-500 transition-colors hover:text-neutral-900 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none dark:hover:text-neutral-300'>
      <Icon size={16} />
      <span className='text-sm font-medium'>{label}</span>
    </TabsTrigger>
  )
}
