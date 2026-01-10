'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import {
  FaAndroid,
  FaCss3Alt,
  FaFileCsv,
  FaFileImage,
  FaFilePdf,
  FaLink,
  FaSass,
} from 'react-icons/fa6'
import { SiAdobe, SiJson, SiTailwindcss } from 'react-icons/si'
import { TbBrackets } from 'react-icons/tb'
import { toast } from 'sonner'
import { ExportPreviewModal } from './export-preview-modal'
import {
  exportArray,
  exportCSSHSL,
  exportCSSHex,
  exportCSV,
  exportEmbed,
  exportExtendedArray,
  exportObject,
  exportSCSSGradients,
  exportSCSSHSL,
  exportSCSSHex,
  exportSCSSRGB,
  exportWithHash,
  exportXML,
  type ExportColor,
} from './export-utils'
import { TailwindExportModal } from './tailwind-export-modal'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  colors: ExportColor[]
}

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ElementType
  colorClass: string // Cor do ícone para identidade visual
  bgClass: string // Cor de fundo suave para o ícone
  badge?: string
  action: () => void
}

export function ExportModal({ open, onOpenChange, colors }: ExportModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewModal, setPreviewModal] = useState<{
    open: boolean
    title: string
    code: string
    filename?: string
  }>({ open: false, title: '', code: '' })
  const [tailwindModal, setTailwindModal] = useState(false)

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(`${label} copiado!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleShowPreview = (title: string, code: string, filename?: string) => {
    setPreviewModal({ open: true, title, code, filename })
  }

  // --- CONFIGURAÇÃO DAS OPÇÕES ---

  const codeOptions: ExportOption[] = [
    {
      id: 'csv',
      name: 'CSV',
      description: 'df9a57,fc7a57,fcd757...',
      icon: FaFileCsv,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/20',
      action: () => handleShowPreview('CSV', exportCSV(colors), 'palette.csv'),
    },
    {
      id: 'with-hash',
      name: 'With #',
      description: '#df9a57, #fc7a57...',
      icon: TbBrackets,
      colorClass: 'text-slate-600 dark:text-slate-400',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      action: () => handleShowPreview('With #', exportWithHash(colors), 'palette.txt'),
    },
    {
      id: 'json-array',
      name: 'Array',
      description: '["df9a57","fc7a57"...]',
      icon: TbBrackets,
      colorClass: 'text-slate-600 dark:text-slate-400',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      action: () => handleShowPreview('Array', exportArray(colors), 'palette.json'),
    },
    {
      id: 'json-object',
      name: 'Object',
      description: '{"Golden Apricot":"df9a57"...}',
      icon: SiJson,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900/20',
      action: () => handleShowPreview('Object', exportObject(colors), 'palette.json'),
    },
    {
      id: 'extended-array',
      name: 'Extended Array',
      description: 'Completo com RGB, HSL, CMYK...',
      icon: SiJson,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900/20',
      action: () =>
        handleShowPreview('Extended Array', exportExtendedArray(colors), 'palette.json'),
    },
    {
      id: 'xml',
      name: 'XML',
      description: 'Formato XML para Android',
      icon: FaAndroid,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-100 dark:bg-green-900/20',
      action: () => handleShowPreview('XML', exportXML(colors), 'palette.xml'),
    },
    {
      id: 'embed',
      name: 'Embed',
      description: 'Widget para embedar',
      icon: FaLink,
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-100 dark:bg-violet-900/20',
      action: () => handleShowPreview('Embed', exportEmbed(colors), 'embed.html'),
    },
  ]

  const styleOptions: ExportOption[] = [
    {
      id: 'css-hex',
      name: 'CSS HEX',
      description: 'Variáveis CSS com HEX',
      icon: FaCss3Alt,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-100 dark:bg-blue-900/20',
      action: () => {
        const css = `/* CSS HEX */\n${exportCSSHex(colors)}\n\n/* CSS HSL */\n${exportCSSHSL(colors)}`
        handleShowPreview('CSS', css, 'palette.css')
      },
    },
    {
      id: 'scss',
      name: 'SCSS',
      description: 'HEX, HSL, RGB e Gradients',
      icon: FaSass,
      colorClass: 'text-pink-600',
      bgClass: 'bg-pink-100 dark:bg-pink-900/20',
      action: () => {
        const scss = `${exportSCSSHex(colors)}\n\n${exportSCSSHSL(colors)}\n\n${exportSCSSRGB(colors)}\n\n${exportSCSSGradients(colors)}`
        handleShowPreview('SCSS', scss, 'palette.scss')
      },
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      description: 'v3/v4 com múltiplos formatos',
      icon: SiTailwindcss,
      colorClass: 'text-cyan-600',
      bgClass: 'bg-cyan-100 dark:bg-cyan-900/20',
      action: () => setTailwindModal(true),
    },
  ]

  const assetOptions: ExportOption[] = [
    {
      id: 'url',
      name: 'Link Direto',
      description: 'URL compartilhável',
      icon: FaLink,
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-100 dark:bg-violet-900/20',
      action: () => {
        const url = `${window.location.origin}${window.location.pathname}?colors=${colors.map((c) => c.hex.replace('#', '')).join('-')}`
        handleCopy(url, 'url', 'Link')
      },
    },
    {
      id: 'image',
      name: 'Imagem PNG',
      description: 'Exportar paleta visual',
      icon: FaFileImage,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-100 dark:bg-orange-900/20',
      action: () => toast.info('Em breve: Download de Imagem'),
    },
    {
      id: 'pdf',
      name: 'Relatório PDF',
      description: 'Documentação completa',
      icon: FaFilePdf,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-100 dark:bg-red-900/20',
      action: () => toast.info('Em breve: Download de PDF'),
    },
    {
      id: 'ase',
      name: 'Adobe ASE',
      description: 'Photoshop / Illustrator',
      icon: SiAdobe,
      colorClass: 'text-fuchsia-900 dark:text-fuchsia-400',
      bgClass: 'bg-fuchsia-100 dark:bg-fuchsia-900/20',
      action: () => toast.info('Em breve: Download ASE'),
    },
  ]

  // Componente de Cartão
  const ExportCard = ({ option }: { option: ExportOption }) => (
    <button
      onClick={option.action}
      className={cn(
        'group relative flex w-full flex-col items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-5 text-left transition-all hover:border-neutral-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
        copiedId === option.id && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-950',
      )}>
      {/* Ícone e Badge */}
      <div className='flex w-full items-start justify-between'>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110',
            option.bgClass,
            option.colorClass,
          )}>
          <option.icon />
        </div>
        {option.badge && (
          <span className='rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-400'>
            {option.badge}
          </span>
        )}
      </div>

      {/* Textos */}
      <div>
        <h4 className='font-semibold text-neutral-900 dark:text-neutral-100'>{option.name}</h4>
        <p className='text-sm text-neutral-500 dark:text-neutral-400'>{option.description}</p>
      </div>

      {/* Indicador de Ação (Arrow) */}
      <div className='absolute top-1/2 right-4 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100'>
        <ChevronRight className='text-neutral-300' />
      </div>

      {/* Overlay de Sucesso (Copiado) */}
      <AnimatePresence>
        {copiedId === option.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-blue-600/95 text-white backdrop-blur-[1px]'>
            <Check className='mb-1 h-8 w-8' strokeWidth={3} />
            <span className='text-sm font-bold tracking-wide uppercase'>Copiado!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-2xl outline-none dark:bg-neutral-950'>
        {/* --- HEADER --- */}
        <div className='flex items-center justify-between border-b border-neutral-100 bg-white px-8 py-6 dark:border-neutral-800 dark:bg-neutral-900'>
          <div>
            <DialogTitle className='text-2xl font-bold text-neutral-900 dark:text-white'>
              Exportar Paleta
            </DialogTitle>
            <DialogDescription className='text-neutral-500'>
              Selecione o formato ideal para o seu workflow.
            </DialogDescription>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onOpenChange(false)}
            className='rounded-full'>
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* --- CONTEÚDO --- */}
        <div className='flex h-[600px] flex-col bg-neutral-50/50 md:flex-row dark:bg-black/20'>
          <Tabs defaultValue='code' className='flex flex-1 flex-col md:flex-row'>
            {/* SIDEBAR DE NAVEGAÇÃO */}
            <div className='w-full border-r border-neutral-100 bg-white px-4 py-6 md:w-64 dark:border-neutral-800 dark:bg-neutral-900/50'>
              <TabsList className='flex h-auto w-full flex-col gap-2 bg-transparent'>
                <ExportTabTrigger value='code' label='Código & Dados' />
                <ExportTabTrigger value='styles' label='Estilos (CSS)' />
                <ExportTabTrigger value='assets' label='Assets & Links' />
              </TabsList>

              {/* Info Box na Sidebar */}
              <div className='mt-auto hidden rounded-xl bg-blue-50 p-4 md:block dark:bg-blue-900/20'>
                <p className='text-xs font-medium text-blue-700 dark:text-blue-300'>Dica Pro</p>
                <p className='mt-1 text-xs text-blue-600/80 dark:text-blue-400/80'>
                  Você pode usar o atalho <kbd className='font-sans font-bold'>Cmd+C</kbd> na tela
                  principal para copiar o formato padrão.
                </p>
              </div>
            </div>

            {/* ÁREA DE OPÇÕES (GRID) */}
            <div className='flex-1 overflow-y-auto p-6 md:p-8'>
              <TabsContent value='code' className='mt-0 focus-visible:outline-none'>
                <SectionTitle>Formatos de Dados</SectionTitle>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {codeOptions.map((opt) => (
                    <ExportCard key={opt.id} option={opt} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='styles' className='mt-0 focus-visible:outline-none'>
                <SectionTitle>Folhas de Estilo</SectionTitle>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {styleOptions.map((opt) => (
                    <ExportCard key={opt.id} option={opt} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='assets' className='mt-0 focus-visible:outline-none'>
                <SectionTitle>Arquivos & Compartilhamento</SectionTitle>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {assetOptions.map((opt) => (
                    <ExportCard key={opt.id} option={opt} />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>

      {/* Modais de Preview */}
      <ExportPreviewModal
        open={previewModal.open}
        onOpenChange={(open) => setPreviewModal((prev) => ({ ...prev, open }))}
        title={previewModal.title}
        code={previewModal.code}
        filename={previewModal.filename}
      />

      <TailwindExportModal open={tailwindModal} onOpenChange={setTailwindModal} colors={colors} />
    </Dialog>
  )
}

// --- SUBCOMPONENTES ---

function ExportTabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className='w-full justify-start rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 transition-all data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900 dark:text-neutral-400 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-white'>
      {label}
    </TabsTrigger>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className='mb-6 flex items-center gap-2'>
      <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>{children}</h3>
      <div className='h-px flex-1 bg-neutral-100 dark:bg-neutral-800' />
    </div>
  )
}
