'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { IntegrityReport } from '@/app/actions/scrapper-html-v2'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Image,
  Link2,
  FileText,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

interface IntegrityReportProps {
  report: IntegrityReport
}

export function IntegrityReportComponent({ report }: IntegrityReportProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasIssues = report.warnings.length > 0 || report.errors.length > 0
  const severity = report.errors.length > 0 ? 'error' : report.warnings.length > 0 ? 'warning' : 'success'

  const imageRecoveryRate =
    report.stats.imagesFound > 0
      ? Math.round((report.stats.imagesRecovered / report.stats.imagesFound) * 100)
      : 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={cn(
            'group flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-all',
            severity === 'error' && 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20',
            severity === 'warning' && 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-900/50 dark:bg-yellow-950/20',
            severity === 'success' && 'border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/20',
          )}>
          <div className='flex items-center gap-2'>
            {severity === 'error' && <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />}
            {severity === 'warning' && <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />}
            {severity === 'success' && <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />}
            <span className='text-xs font-semibold'>
              {severity === 'error' && 'Extração com Erros'}
              {severity === 'warning' && 'Extração com Avisos'}
              {severity === 'success' && 'Extração Completa'}
            </span>
            {hasIssues && (
              <Badge variant='secondary' className='h-4 px-1.5 text-[10px]'>
                {report.errors.length + report.warnings.length}
              </Badge>
            )}
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </Button>
      </CollapsibleTrigger>

      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent forceMount>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='overflow-hidden'>
              <div className='mt-2 space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'>
                {/* Stats Grid */}
                <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                  {/* Imagens */}
                  <div className='flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50'>
                    <div className='flex items-center gap-2'>
                      <Image className='h-4 w-4 text-zinc-500' />
                      <span className='text-xs font-medium text-zinc-600 dark:text-zinc-400'>
                        Imagens
                      </span>
                    </div>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                        {report.stats.imagesFound}
                      </span>
                      {report.stats.imagesRecovered > 0 && (
                        <span className='text-xs text-green-600 dark:text-green-400'>
                          +{report.stats.imagesRecovered} recuperadas
                        </span>
                      )}
                    </div>
                    {report.stats.imagesFound > 0 && (
                      <Progress value={imageRecoveryRate} className='h-1' />
                    )}
                  </div>

                  {/* Links */}
                  <div className='flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50'>
                    <div className='flex items-center gap-2'>
                      <Link2 className='h-4 w-4 text-zinc-500' />
                      <span className='text-xs font-medium text-zinc-600 dark:text-zinc-400'>
                        Links
                      </span>
                    </div>
                    <span className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                      {report.stats.linksProcessed}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className='flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50'>
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4 text-zinc-500' />
                      <span className='text-xs font-medium text-zinc-600 dark:text-zinc-400'>
                        Tamanho
                      </span>
                    </div>
                    <span className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                      {(report.stats.contentLength / 1024).toFixed(1)}kb
                    </span>
                  </div>

                  {/* Modo */}
                  <div className='flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50'>
                    <div className='flex items-center gap-2'>
                      <Zap className='h-4 w-4 text-zinc-500' />
                      <span className='text-xs font-medium text-zinc-600 dark:text-zinc-400'>
                        Modo
                      </span>
                    </div>
                    <span className='text-xs font-semibold text-zinc-900 dark:text-zinc-100'>
                      {report.stats.usedFallback ? 'Fallback' : 'Readability'}
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {report.warnings.length > 0 && (
                  <>
                    <Separator />
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                        <h4 className='text-xs font-semibold text-zinc-700 dark:text-zinc-300'>
                          Avisos ({report.warnings.length})
                        </h4>
                      </div>
                      <ul className='space-y-1'>
                        {report.warnings.slice(0, 5).map((warning, idx) => (
                          <li
                            key={idx}
                            className='flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400'>
                            <span className='mt-0.5 h-1 w-1 shrink-0 rounded-full bg-yellow-500' />
                            {warning}
                          </li>
                        ))}
                        {report.warnings.length > 5 && (
                          <li className='text-xs italic text-zinc-500'>
                            +{report.warnings.length - 5} avisos adicionais
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}

                {/* Errors */}
                {report.errors.length > 0 && (
                  <>
                    <Separator />
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
                        <h4 className='text-xs font-semibold text-zinc-700 dark:text-zinc-300'>
                          Erros ({report.errors.length})
                        </h4>
                      </div>
                      <ul className='space-y-1'>
                        {report.errors.map((error, idx) => (
                          <li
                            key={idx}
                            className='flex items-start gap-2 text-xs text-red-600 dark:text-red-400'>
                            <span className='mt-0.5 h-1 w-1 shrink-0 rounded-full bg-red-500' />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  )
}
