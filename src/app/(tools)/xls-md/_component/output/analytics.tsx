'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress' // Certifique-se de ter esse componente ou remova se não usar
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Hash,
  HelpCircle,
  ToggleLeft,
  TrendingUp,
  Type,
} from 'lucide-react'

// Função auxiliar para ícone baseado no tipo
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'number':
      return <Hash className='h-3.5 w-3.5' />
    case 'boolean':
      return <ToggleLeft className='h-3.5 w-3.5' />
    case 'string':
      return <Type className='h-3.5 w-3.5' />
    default:
      return <HelpCircle className='h-3.5 w-3.5' />
  }
}

// Função auxiliar para cor baseada no tipo
const getTypeColor = (type: string) => {
  switch (type) {
    case 'number':
      return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400'
    case 'boolean':
      return 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400'
    case 'string':
      return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800 dark:text-slate-400'
    default:
      return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400'
  }
}

export const ExcelMdAnalytics = ({
  columnStats,
  totalRows,
}: {
  columnStats: ColumnStats[]
  totalRows?: number
}) => {
  // Calcula uma pontuação de saúde dos dados (exemplo simples)
  const dataHealth =
    columnStats.length > 0
      ? Math.round(
          (columnStats.reduce((acc, stat) => {
            const completeness = totalRows ? 1 - stat.emptyCount / totalRows : 1
            return acc + completeness
          }, 0) /
            columnStats.length) *
            100,
        )
      : 0

  return (
    <TabsContent
      value='stats'
      className='m-0 flex-1 overflow-hidden p-0 data-[state=inactive]:hidden'>
      <ScrollArea className='h-full'>
        <div className='p-6 pb-20'>
          {columnStats && columnStats.length > 0 ? (
            <div className='space-y-6'>
              {/* Header com Resumo Global */}
              <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                    <TrendingUp className='text-primary h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold tracking-tight'>Análise de Dados</h3>
                    <p className='text-muted-foreground text-sm'>
                      Estatísticas descritivas das colunas detectadas
                    </p>
                  </div>
                </div>

                {/* Card de Saúde dos Dados (Opcional) */}
                {totalRows && (
                  <div className='bg-card flex items-center gap-4 rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-1'>
                      <span className='text-muted-foreground text-xs font-medium uppercase'>
                        Qualidade dos Dados
                      </span>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-2xl font-bold'>{dataHealth}%</span>
                        <span className='text-muted-foreground text-xs'>completude média</span>
                      </div>
                    </div>
                    <div className='h-10 w-10'>
                      <svg viewBox='0 0 36 36' className='h-full w-full -rotate-90 text-green-500'>
                        <path
                          className='text-muted/20'
                          d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='text-primary'
                          d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='4'
                          strokeDasharray={`${dataHealth}, 100`}
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Grid de Estatísticas */}
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {columnStats.map((stat, index) => {
                  const typeColorClass = getTypeColor(stat.type)
                  const completeness = totalRows
                    ? Math.round(((totalRows - stat.emptyCount) / totalRows) * 100)
                    : 100

                  return (
                    <Card
                      key={index}
                      className='hover:border-primary/50 overflow-hidden transition-all'>
                      <CardHeader className='bg-muted/10 border-b px-4 py-3'>
                        <div className='flex items-start justify-between gap-2'>
                          <CardTitle
                            className='truncate text-sm leading-tight font-bold'
                            title={stat.name}>
                            {stat.name}
                          </CardTitle>
                          <Badge
                            variant='outline'
                            className={`shrink-0 gap-1 border px-1.5 py-0.5 text-[10px] font-medium capitalize ${typeColorClass}`}>
                            {getTypeIcon(stat.type)}
                            {stat.type === 'mixed'
                              ? 'Misto'
                              : stat.type === 'string'
                                ? 'Texto'
                                : stat.type === 'number'
                                  ? 'Núm.'
                                  : 'Bool'}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className='space-y-4 p-4'>
                        {/* Métricas de Completude */}
                        <div className='space-y-2'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-muted-foreground'>Preenchimento</span>
                            <span className='font-medium'>{completeness}%</span>
                          </div>
                          <Progress value={completeness} className='h-1.5' />
                        </div>

                        <div className='grid grid-cols-2 gap-2 text-xs'>
                          <div className='bg-muted/30 rounded border p-2'>
                            <span className='text-muted-foreground mb-0.5 block'>Únicos</span>
                            <span className='text-sm font-semibold'>{stat.uniqueValues}</span>
                          </div>
                          <div className='bg-muted/30 rounded border p-2'>
                            <span className='text-muted-foreground mb-0.5 block'>Vazios</span>
                            <span className='text-sm font-semibold'>{stat.emptyCount}</span>
                          </div>
                        </div>

                        {/* Estatísticas Numéricas Específicas */}
                        {stat.type === 'number' && (
                          <div className='space-y-2 rounded-lg border border-blue-100 bg-blue-500/5 p-3 dark:border-blue-900/30'>
                            <div className='mb-2 flex items-center gap-1.5 text-blue-600 dark:text-blue-400'>
                              <BarChart3 className='h-3.5 w-3.5' />
                              <span className='text-xs font-semibold'>Distribuição</span>
                            </div>

                            <div className='space-y-1.5'>
                              <div className='flex items-center justify-between text-xs'>
                                <span className='text-muted-foreground'>Mín</span>
                                <span className='font-mono font-medium'>
                                  {stat.min?.toLocaleString()}
                                </span>
                              </div>
                              <div className='bg-muted/50 h-px w-full' />
                              <div className='flex items-center justify-between text-xs'>
                                <span className='text-muted-foreground'>Média</span>
                                <span className='font-mono font-medium text-blue-600 dark:text-blue-400'>
                                  {stat.avg?.toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                              <div className='bg-muted/50 h-px w-full' />
                              <div className='flex items-center justify-between text-xs'>
                                <span className='text-muted-foreground'>Máx</span>
                                <span className='font-mono font-medium'>
                                  {stat.max?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Estatísticas de Texto (placeholder para futura expansão) */}
                        {stat.type === 'string' && (
                          <div className='text-muted-foreground bg-muted/20 flex items-center gap-2 rounded border border-dashed p-2 text-xs'>
                            <Activity className='h-3.5 w-3.5' />
                            <span>Texto Variável</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className='flex h-[400px] flex-col items-center justify-center text-center'>
              <div className='bg-muted/30 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed'>
                <BarChart3 className='text-muted-foreground h-10 w-10 opacity-50' />
              </div>
              <h3 className='text-xl font-semibold'>Aguardando Dados</h3>
              <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
                Processe um arquivo CSV ou JSON para visualizar a análise estatística automática das
                colunas.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  )
}
