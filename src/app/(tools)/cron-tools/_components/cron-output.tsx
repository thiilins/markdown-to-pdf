'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

import {
  AlertCircle,
  Calendar,
  Clock,
  Code2,
  ExternalLink,
  Globe,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { CodeExporter } from './code-exporter'
import { getCrontabGuruUrl, type CronParseResult } from './cron-utils'
import { TimezoneConverter } from './timezone-converter'

interface CronOutputProps {
  result: CronParseResult | null
  expression: string
}

export function CronOutput({ result, expression }: CronOutputProps) {
  if (!result) {
    return (
      <div className='flex h-full flex-col items-center justify-center p-8 text-center'>
        <div className='relative mb-4'>
          <div className='bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl' />
          <Clock className='text-muted-foreground/50 relative h-16 w-16' />
        </div>
        <h3 className='text-foreground text-lg font-semibold'>Aguardando Input</h3>
        <p className='text-muted-foreground mt-2 max-w-xs text-sm'>
          Digite ou selecione uma expressão cron para visualizar a mágica acontecer.
        </p>
      </div>
    )
  }

  const { validation, description, nextExecutions, fields } = result
  const isValid = validation.isValid

  return (
    <div className='bg-muted/10 flex h-full flex-col overflow-hidden'>
      <Tabs defaultValue='timeline' className='flex h-full flex-col'>
        <div className='border-b px-6 pt-4'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='timeline' className='text-xs'>
              <Calendar className='mr-2 h-3 w-3' />
              Timeline
            </TabsTrigger>
            <TabsTrigger value='timezone' className='text-xs'>
              <Globe className='mr-2 h-3 w-3' />
              Timezone
            </TabsTrigger>
            <TabsTrigger value='code' className='text-xs'>
              <Code2 className='mr-2 h-3 w-3' />
              Código
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='timeline' className='mt-0 flex-1 overflow-hidden'>
          <ScrollArea className='h-full'>
            <div className='flex flex-col gap-6 p-6'>
              {/* Status & Descrição Principal */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'relative overflow-hidden rounded-2xl border p-6 shadow-sm',
                  isValid
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'bg-destructive/5 border-destructive/20',
                )}>
                <div className='flex items-start gap-4'>
                  <div
                    className={cn(
                      'rounded-full p-3',
                      isValid
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-destructive/10 text-destructive',
                    )}>
                    {isValid ? (
                      <Sparkles className='h-6 w-6' />
                    ) : (
                      <AlertCircle className='h-6 w-6' />
                    )}
                  </div>
                  <div className='space-y-1'>
                    <h2 className='text-foreground text-lg font-bold tracking-tight'>
                      {isValid ? description : 'Expressão Inválida'}
                    </h2>
                    {isValid ? (
                      <p className='text-muted-foreground text-sm'>
                        Execução agendada conforme padrão.
                      </p>
                    ) : (
                      <div className='space-y-1'>
                        {validation.errors.map((e, i) => (
                          <p key={i} className='text-destructive text-sm font-medium'>
                            {e}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {isValid && (
                <>
                  {/* Grid de Campos (Badges) */}
                  <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
                    {[
                      { label: 'Minuto', value: fields.minute },
                      { label: 'Hora', value: fields.hour },
                      { label: 'Dia', value: fields.dayOfMonth },
                      { label: 'Mês', value: fields.month },
                      { label: 'Semana', value: fields.dayOfWeek },
                    ].map((field, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className='bg-card flex flex-col items-center justify-center rounded-xl border p-3 text-center shadow-sm'>
                        <span className='text-muted-foreground text-[10px] font-semibold uppercase'>
                          {field.label}
                        </span>
                        <span className='text-primary mt-1 font-mono text-lg font-bold'>
                          {field.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Timeline de Próximas Execuções */}
                  <Card className='flex flex-col overflow-hidden border-none bg-transparent shadow-none'>
                    <div className='mb-6 flex items-center gap-2'>
                      <Calendar className='text-primary h-4 w-4' />
                      <h3 className='text-muted-foreground text-sm font-semibold tracking-wider uppercase'>
                        Próximas Execuções
                      </h3>
                    </div>

                     <div className='relative pl-4'>
                       {/* Linha Vertical da Timeline - Gradiente Roxo Neon */}
                       <div className='absolute top-2 bottom-6 left-[19px] w-px bg-linear-to-b from-purple-500/50 via-white/10 to-transparent' />

                       <div className='space-y-6'>
                         {nextExecutions.map((execution, index) => (
                           <motion.div
                             key={index}
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: index * 0.05 }}
                             className='group relative flex items-center gap-6'>
                             {/* Marcador da Timeline - Estilo "Planeta" com Brilho */}
                             <div className='relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0B0C15] ring-2 ring-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:ring-purple-400'>
                               <div className='h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)]' />
                             </div>

                             {/* Card da Execução - Glassmorphism Escuro */}
                             <div className='group/card flex flex-1 items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3 backdrop-blur-md transition-all hover:border-purple-500/30 hover:bg-white/[0.05] hover:shadow-[0_4px_20px_-10px_rgba(168,85,247,0.2)]'>
                               <div className='flex flex-col'>
                                 <span className='font-mono text-sm font-semibold text-slate-200 transition-colors group-hover/card:text-white'>
                                   {execution.formatted.split(',')[0]} {/* Data */}
                                 </span>
                                 <span className='text-xs text-slate-500 transition-colors group-hover/card:text-purple-300'>
                                   {execution.formatted.split(',')[1]} {/* Hora */}
                                 </span>
                               </div>
                               <Badge
                                 variant='secondary'
                                 className='border-purple-500/20 bg-purple-500/10 font-mono text-[10px] text-purple-300'>
                                 {execution.relative}
                               </Badge>
                             </div>
                           </motion.div>
                         ))}
                       </div>
                     </div>
                  </Card>

                  {/* Footer Link */}
                  <a
                    href={getCrontabGuruUrl(expression)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='border-muted-foreground/20 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary mt-auto flex items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm transition-colors'>
                    <Terminal className='h-4 w-4' />
                    <span>
                      Debugar no <strong>crontab.guru</strong>
                    </span>
                    <ExternalLink className='ml-1 h-3 w-3' />
                  </a>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='timezone' className='mt-0 flex-1 overflow-hidden'>
          <TimezoneConverter expression={expression} isValid={isValid} />
        </TabsContent>

        <TabsContent value='code' className='mt-0 flex-1 overflow-hidden'>
          <CodeExporter expression={expression} description={description} isValid={isValid} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
