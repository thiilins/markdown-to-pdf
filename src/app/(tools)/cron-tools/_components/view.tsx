'use client'

import { ToolShell } from '@/app/(tools)/_components/tool-shell'
import { Clock } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CronInput } from './cron-input'
import { CronOutput } from './cron-output'
import { parseCronExpression, type CronParseResult } from './cron-utils'

const DEFAULT_CRON = '*/15 * * * *' // Mudei o padrão para algo mais visualmente interessante

export function CronToolsViewComponent() {
  const [cronExpression, setCronExpression] = useState<string>(DEFAULT_CRON)
  const [result, setResult] = useState<CronParseResult | null>(null)

  const handleParse = useCallback(() => {
    if (!cronExpression.trim()) {
      setResult(null)
      return
    }

    try {
      const parsed = parseCronExpression(cronExpression)
      setResult(parsed)
    } catch (error: any) {
      setResult(null)
    }
  }, [cronExpression])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cronExpression.trim()) {
        handleParse()
      }
    }, 300) // Reduzi o debounce para parecer mais responsivo
    return () => clearTimeout(timer)
  }, [cronExpression, handleParse])

  const handleCopy = useCallback(async () => {
    if (!cronExpression) return
    await navigator.clipboard.writeText(cronExpression)
    toast.success('Expressão copiada!')
  }, [cronExpression])

  const handleClear = useCallback(() => {
    setCronExpression('')
    setResult(null)
  }, [])

  const handleReset = useCallback(() => {
    setCronExpression('0 0 * * *')
  }, [])

  return (
    <ToolShell
      title='Cron Expression Visualizer'
      description='Entenda, valide e debugue agendamentos cron complexos com visualização em timeline.'
      icon={Clock}
      layout='resizable'
      orientation='horizontal'
      defaultPanelSizes={[45, 55]} // Dei um pouco mais de espaço para o output
      inputLabel='Editor'
      outputLabel='Visualização'
      inputComponent={
        <CronInput value={cronExpression} onChange={setCronExpression} onValidate={handleParse} />
      }
      outputComponent={<CronOutput result={result} expression={cronExpression} />}
      showCopyButton={true}
      showClearButton={true}
      showResetButton={true}
      onCopyOutput={handleCopy}
      onClear={handleClear}
      onReset={handleReset}
      stats={
        result && result.validation.isValid
          ? [
              {
                label: 'Próxima',
                value: result.nextExecutions[0]?.relative || '-',
                variant: 'default',
              },
              {
                label: 'Frequência',
                value: result.description.split(' ').slice(0, 3).join(' ') + '...', // Resumo curto
                variant: 'secondary',
              },
            ]
          : []
      }
      mobileTabs={true}
      mobileDefaultTab='input'
    />
  )
}
