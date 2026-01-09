import cronParser from 'cron-parser'
import cronstrue from 'cronstrue/i18n'

export interface CronValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface CronExecution {
  date: Date
  formatted: string
  relative: string
}

export interface CronParseResult {
  description: string
  nextExecutions: CronExecution[]
  validation: CronValidationResult
  fields: {
    minute: string
    hour: string
    dayOfMonth: string
    month: string
    dayOfWeek: string
  }
}

/**
 * Valida uma expressão cron
 */
export function validateCronExpression(expression: string): CronValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!expression || !expression.trim()) {
    return {
      isValid: false,
      errors: ['Expressão cron vazia'],
      warnings: [],
    }
  }

  const trimmed = expression.trim()
  const parts = trimmed.split(/\s+/)

  // Validar número de campos (5 ou 6)
  if (parts.length < 5 || parts.length > 6) {
    errors.push(
      `Expressão cron deve ter 5 ou 6 campos (encontrados: ${parts.length}). Formato: minuto hora dia mês dia-da-semana [ano]`,
    )
    return { isValid: false, errors, warnings }
  }

  // Tentar parsear com cron-parser
  try {
    cronParser.parse(trimmed, {
      currentDate: new Date(),
      tz: 'America/Sao_Paulo',
    })
  } catch (error: any) {
    errors.push(`Erro ao parsear expressão: ${error.message}`)
    return { isValid: false, errors, warnings }
  }

  // Avisos para expressões comuns
  if (trimmed === '* * * * *') {
    warnings.push('Esta expressão executa a cada minuto. Certifique-se de que é intencional.')
  }

  if (parts[0] === '*' && parts[1] === '*') {
    warnings.push('Execução a cada minuto pode gerar alta carga no sistema.')
  }

  return {
    isValid: true,
    errors: [],
    warnings,
  }
}

/**
 * Converte expressão cron para descrição em português
 */
export function describeCronExpression(expression: string): string {
  try {
    return cronstrue.toString(expression, {
      locale: 'pt_BR',
      use24HourTimeFormat: true,
      verbose: true,
    })
  } catch (error: any) {
    return `Erro ao descrever: ${error.message}`
  }
}

/**
 * Calcula as próximas N execuções da expressão cron
 */
export function getNextExecutions(
  expression: string,
  count: number = 10,
  timezone: string = 'America/Sao_Paulo',
): CronExecution[] {
  try {
    const interval = cronParser.parse(expression, {
      currentDate: new Date(),
      tz: timezone,
    })

    const executions: CronExecution[] = []

    for (let i = 0; i < count; i++) {
      const next = interval.next().toDate()
      executions.push({
        date: next,
        formatted: formatDate(next),
        relative: getRelativeTime(next),
      })
    }

    return executions
  } catch (error: any) {
    return []
  }
}

/**
 * Formata data para exibição
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}

/**
 * Calcula tempo relativo (ex: "em 2 horas")
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `em ${days} dia${days > 1 ? 's' : ''}`
  }
  if (hours > 0) {
    return `em ${hours} hora${hours > 1 ? 's' : ''}`
  }
  if (minutes > 0) {
    return `em ${minutes} minuto${minutes > 1 ? 's' : ''}`
  }
  if (seconds > 0) {
    return `em ${seconds} segundo${seconds > 1 ? 's' : ''}`
  }
  return 'agora'
}

/**
 * Extrai campos individuais da expressão cron
 */
export function parseCronFields(expression: string): CronParseResult['fields'] {
  const parts = expression.trim().split(/\s+/)

  return {
    minute: parts[0] || '*',
    hour: parts[1] || '*',
    dayOfMonth: parts[2] || '*',
    month: parts[3] || '*',
    dayOfWeek: parts[4] || '*',
  }
}

/**
 * Parseia expressão cron completa
 */
export function parseCronExpression(expression: string): CronParseResult {
  const validation = validateCronExpression(expression)

  if (!validation.isValid) {
    return {
      description: 'Expressão inválida',
      nextExecutions: [],
      validation,
      fields: {
        minute: '',
        hour: '',
        dayOfMonth: '',
        month: '',
        dayOfWeek: '',
      },
    }
  }

  return {
    description: describeCronExpression(expression),
    nextExecutions: getNextExecutions(expression),
    validation,
    fields: parseCronFields(expression),
  }
}

/**
 * Expressões cron comuns pré-definidas
 */
export const COMMON_CRON_EXPRESSIONS = [
  { label: 'A cada minuto', value: '* * * * *' },
  { label: 'A cada 5 minutos', value: '*/5 * * * *' },
  { label: 'A cada 15 minutos', value: '*/15 * * * *' },
  { label: 'A cada 30 minutos', value: '*/30 * * * *' },
  { label: 'A cada hora', value: '0 * * * *' },
  { label: 'A cada 2 horas', value: '0 */2 * * *' },
  { label: 'A cada 6 horas', value: '0 */6 * * *' },
  { label: 'A cada 12 horas', value: '0 */12 * * *' },
  { label: 'Diariamente à meia-noite', value: '0 0 * * *' },
  { label: 'Diariamente às 6h', value: '0 6 * * *' },
  { label: 'Diariamente às 12h', value: '0 12 * * *' },
  { label: 'Diariamente às 18h', value: '0 18 * * *' },
  { label: 'Semanalmente (Domingo à meia-noite)', value: '0 0 * * 0' },
  { label: 'Semanalmente (Segunda-feira às 9h)', value: '0 9 * * 1' },
  { label: 'Mensalmente (Dia 1 à meia-noite)', value: '0 0 1 * *' },
  { label: 'Mensalmente (Dia 15 às 12h)', value: '0 12 15 * *' },
  { label: 'Anualmente (1º de Janeiro à meia-noite)', value: '0 0 1 1 *' },
  { label: 'Dias úteis às 9h', value: '0 9 * * 1-5' },
  { label: 'Fins de semana às 10h', value: '0 10 * * 0,6' },
]

/**
 * Gera URL para crontab.guru
 */
export function getCrontabGuruUrl(expression: string): string {
  const encoded = encodeURIComponent(expression.trim())
  return `https://crontab.guru/#${encoded}`
}
