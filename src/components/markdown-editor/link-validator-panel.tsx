'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { extractLinks, validateAllLinks } from '@/shared/utils/link-validator'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Hash,
  Link2,
  Loader2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface LinkValidatorPanelProps {
  markdown: string
  className?: string
}

export function LinkValidatorPanel({ markdown, className }: LinkValidatorPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [links, setLinks] = useState<LinkInfo[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!markdown) {
      setLinks([])
      return
    }
    const extractedLinks = extractLinks(markdown)
    setLinks(extractedLinks)
  }, [markdown])

  const handleValidate = useCallback(async () => {
    if (links.length === 0) return
    setIsValidating(true)
    setProgress(0)

    const validatedLinks = await validateAllLinks(links, markdown, (validated, total) => {
      setProgress((validated / total) * 100)
    })

    setLinks(validatedLinks)
    setIsValidating(false)
  }, [links, markdown])

  const brokenLinks = links.filter((link) => link.isValid === false)
  const validLinks = links.filter((link) => link.isValid === true)
  const pendingLinks = links.filter((link) => link.isValid === null)

  if (links.length === 0) return null

  return (
    <div
      className={cn(
        'absolute right-6 bottom-6 z-40 transition-all duration-500 ease-in-out',
        isOpen ? 'w-96' : 'w-[48px]',
        className,
      )}>
      <div
        className={cn(
          'flex flex-col overflow-hidden border border-slate-200/60 bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-500',
          'rounded-[24px]', // Mantém o círculo perfeito quando fechado (48/2 = 24)
          isOpen ? 'max-h-[550px]' : 'max-h-[48px]',
        )}>
        {/* Header - Altura fixa controlada */}
        <div
          className={cn(
            'flex h-[48px] shrink-0 items-center transition-all duration-300',
            isOpen
              ? 'justify-between border-b border-slate-100 bg-slate-50/50 px-4'
              : 'justify-center',
          )}>
          {isOpen && (
            <div className='animate-in fade-in flex items-center gap-2.5 whitespace-nowrap duration-500'>
              <div className='bg-primary shadow-primary/20 flex h-7 w-7 items-center justify-center rounded-xl text-white shadow-lg'>
                <Link2 className='h-4 w-4' />
              </div>
              <div className='flex flex-col'>
                <span className='text-[13px] font-bold tracking-tight text-slate-900'>Links</span>
                <span className='text-[10px] font-medium tracking-widest text-slate-400 uppercase'>
                  Verificador
                </span>
              </div>
              {brokenLinks.length > 0 && (
                <Badge
                  variant='destructive'
                  className='ml-1 h-5 rounded-full px-1.5 text-[10px] font-bold'>
                  {brokenLinks.length}
                </Badge>
              )}
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'h-8 w-8 shrink-0 rounded-full transition-all duration-300',
              !isOpen && 'hover:bg-primary/10 text-primary hover:scale-110',
            )}>
            {isOpen ? <X className='h-4 w-4 text-slate-500' /> : <Link2 className='h-5 w-5' />}
          </Button>
        </div>

        {/* Content Area */}
        <div
          className={cn(
            'w-full flex-1 transition-opacity duration-300',
            isOpen ? 'visible opacity-100' : 'invisible h-0 opacity-0',
          )}>
          <div className='flex flex-col gap-4 p-5'>
            {/* Stats Grid */}
            <div className='grid grid-cols-3 gap-3'>
              {[
                { label: 'Total', value: links.length, color: 'text-slate-600', bg: 'bg-slate-50' },
                {
                  label: 'Válidos',
                  value: validLinks.length,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50/50',
                },
                {
                  label: 'Erros',
                  value: brokenLinks.length,
                  color: 'text-rose-600',
                  bg: 'bg-rose-50/50',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={cn('rounded-2xl p-3 text-center transition-all', stat.bg)}>
                  <div className={cn('text-xl font-black tracking-tighter', stat.color)}>
                    {stat.value}
                  </div>
                  <div className='text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            {pendingLinks.length > 0 && (
              <div className='space-y-3'>
                <Button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className='h-10 w-full gap-2 rounded-xl bg-slate-900 shadow-md transition-all hover:bg-slate-800 active:scale-[0.98]'>
                  {isValidating ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span className='text-xs font-semibold'>
                        Validando {Math.round(progress)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='h-4 w-4' />
                      <span className='text-xs font-semibold'>
                        Verificar {pendingLinks.length} Links
                      </span>
                    </>
                  )}
                </Button>
                {isValidating && <Progress value={progress} className='h-1.5 bg-slate-100' />}
              </div>
            )}

            {/* Links Display */}
            <ScrollArea className='-mr-2 h-[280px] pr-3'>
              <div className='space-y-3'>
                {brokenLinks.length > 0 ? (
                  <>
                    <div className='flex items-center gap-2 px-1'>
                      <AlertTriangle className='h-3 w-3 text-rose-500' />
                      <span className='text-[11px] font-bold tracking-wider text-slate-500 uppercase'>
                        Problemas Detectados
                      </span>
                    </div>
                    {brokenLinks.map((link, index) => (
                      <div
                        key={`${link.url}-${index}`}
                        className='group relative flex flex-col gap-1.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-rose-200 hover:shadow-md'>
                        <div className='flex items-center justify-between gap-2'>
                          <div className='flex items-center gap-2 truncate'>
                            <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600'>
                              {link.type === 'anchor' ? (
                                <Hash className='h-3 w-3' />
                              ) : (
                                <ExternalLink className='h-3 w-3' />
                              )}
                            </div>
                            <span className='truncate text-xs font-bold text-slate-800'>
                              {link.text}
                            </span>
                          </div>
                          <Badge
                            variant='outline'
                            className='h-4 border-rose-100 bg-rose-50 text-[9px] font-bold text-rose-600'>
                            LINHA {link.line}
                          </Badge>
                        </div>

                        <div className='truncate rounded bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-400'>
                          {link.url}
                        </div>

                        {link.error && (
                          <div className='flex items-center gap-1.5 text-[10px] font-medium text-rose-500'>
                            <AlertCircle className='h-3 w-3' />
                            <span>{link.error}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : validLinks.length > 0 && !isValidating ? (
                  <div className='animate-in zoom-in-95 flex flex-col items-center justify-center py-8 text-center duration-500'>
                    <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500'>
                      <CheckCircle2 className='h-6 w-6' />
                    </div>
                    <h4 className='text-sm font-bold text-slate-800'>Tudo limpo!</h4>
                    <p className='text-[11px] text-slate-500'>
                      Nenhum link quebrado encontrado no documento.
                    </p>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center py-8 text-center text-slate-400'>
                    <Link2 className='mb-2 h-8 w-8 opacity-20' />
                    <p className='text-[11px] font-medium'>Extraindo links do markdown...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
