'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Blend, Eye, FileCode, Grid, Palette, ShieldCheck, Sparkles } from 'lucide-react'

import { BlindnessSimulator } from './blindness-simulator'
import { ColorCard } from './color-card'
import { ColorMixer } from './color-mixer'
import { ExportPanel } from './export-panel'
import { GradientGenerator } from './gradient-generator'
import { ShadcnThemeGenerator } from './shadcn-theme-generator'
import { WCAGChecker } from './wcag-checker'

interface PaletteOutputProps {
  colors: ColorInfo[]
}

export function PaletteOutput({ colors }: PaletteOutputProps) {
  if (colors.length === 0) {
    return (
      <div className='flex h-[500px] w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20'>
        <div className='text-muted-foreground text-center'>
          <Grid className='mx-auto mb-2 h-10 w-10 opacity-20' />
          <p className='text-sm'>Inicie configurando uma cor base</p>
        </div>
      </div>
    )
  }

  return (
    <div className='my-12 h-full space-y-6'>
      {/* Faixa de Visualização Rápida (Hero) */}
      <div className='group relative h-24 w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800'>
        <div className='flex h-full w-full'>
          {colors.map((color, i) => (
            <div
              key={i}
              className='flex-1 transition-all duration-300 ease-out hover:flex-2'
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
          ))}
        </div>
      </div>

      {/* Área de Ferramentas */}
      <Tabs defaultValue='palette' className='w-full space-y-6'>
        <div className='flex items-center justify-between border-b pb-4'>
          <TabsList className='bg-transparent p-0'>
            <TabsTrigger
              value='palette'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <Grid className='h-4 w-4' />
              Paleta
            </TabsTrigger>
            <TabsTrigger
              value='wcag'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <ShieldCheck className='h-4 w-4' />
              Acessibilidade
            </TabsTrigger>
            <TabsTrigger
              value='blindness'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <Eye className='h-4 w-4' />
              Simulador
            </TabsTrigger>
            <TabsTrigger
              value='mixer'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <Blend className='h-4 w-4' />
              Mixer
            </TabsTrigger>
            <TabsTrigger
              value='gradients'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <Sparkles className='h-4 w-4' />
              Gradientes
            </TabsTrigger>
            <TabsTrigger
              value='shadcn'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <Palette className='h-4 w-4' />
              Shadcn
            </TabsTrigger>
            <TabsTrigger
              value='export'
              className='gap-2 rounded-full border border-transparent px-4 data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:border-slate-800 dark:data-[state=active]:bg-slate-900'>
              <FileCode className='h-4 w-4' />
              Exportar
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Conteúdo das Abas */}
        <div className='min-h-[400px]'>
          <TabsContent
            value='palette'
            className='animate-in fade-in mt-0 duration-500 outline-none'>
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
              {colors.map((color, index) => (
                <ColorCard key={index} color={color} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value='wcag' className='animate-in fade-in mt-0 duration-500 outline-none'>
            <WCAGChecker colors={colors} />
          </TabsContent>

          <TabsContent
            value='blindness'
            className='animate-in fade-in mt-0 duration-500 outline-none'>
            <BlindnessSimulator colors={colors} />
          </TabsContent>

          <TabsContent value='mixer' className='animate-in fade-in mt-0 duration-500 outline-none'>
            <ColorMixer colors={colors} />
          </TabsContent>

          <TabsContent
            value='gradients'
            className='animate-in fade-in mt-0 duration-500 outline-none'>
            <GradientGenerator colors={colors} />
          </TabsContent>

          <TabsContent value='shadcn' className='animate-in fade-in mt-0 duration-500 outline-none'>
            <ShadcnThemeGenerator colors={colors} />
          </TabsContent>

          <TabsContent value='export' className='animate-in fade-in mt-0 duration-500 outline-none'>
            <ExportPanel colors={colors} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
