'use client'

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardPaste,
  Clock,
  Copy,
  Database,
  Edit,
  FileCode2,
  Fingerprint,
  Info,
  Key,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { CodeFormatterEditor } from '../../_components/code-formatter-editor'
import { decodeJwt, formatJson, generateJwtToken, type JwtParts } from '../../_components/jwt-utils'

// Token de exemplo padrão
const DEMO_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3Mjc4NzEwMjIsImlzcyI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2V4YW1wbGUuY29tIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// Mapeamento de claims padrão JWT com descrições detalhadas
const STANDARD_CLAIMS: Record<
  string,
  { short: string; description: string; format?: (value: any) => string }
> = {
  sub: {
    short: 'Subject',
    description: 'Identificador único do usuário ou entidade para o qual o token foi emitido',
  },
  iss: {
    short: 'Issuer',
    description: 'Identifica o serviço ou aplicação que emitiu o token (geralmente uma URL)',
  },
  aud: {
    short: 'Audience',
    description:
      'Identifica os destinatários para os quais o token é destinado (pode ser uma string ou array)',
  },
  exp: {
    short: 'Expiration Time',
    description: 'Timestamp Unix (em segundos) indicando quando o token expira',
    format: (value: number) => {
      const date = new Date(value * 1000)
      return `${value} (${date.toLocaleString('pt-BR')})`
    },
  },
  nbf: {
    short: 'Not Before',
    description:
      'Timestamp Unix indicando quando o token se torna válido (não aceito antes desta data)',
    format: (value: number) => {
      const date = new Date(value * 1000)
      return `${value} (${date.toLocaleString('pt-BR')})`
    },
  },
  iat: {
    short: 'Issued At',
    description: 'Timestamp Unix indicando quando o token foi emitido/criado',
    format: (value: number) => {
      const date = new Date(value * 1000)
      return `${value} (${date.toLocaleString('pt-BR')})`
    },
  },
  jti: {
    short: 'JWT ID',
    description: 'Identificador único do token (usado para prevenir replay attacks)',
  },
  typ: {
    short: 'Type',
    description: 'Tipo do token (geralmente "JWT")',
  },
  alg: {
    short: 'Algorithm',
    description: 'Algoritmo de assinatura usado (ex: HS256, RS256, ES256)',
  },
  kid: {
    short: 'Key ID',
    description: 'Identificador da chave usada para assinar o token (usado em rotação de chaves)',
  },
}

export default function JwtDecoderView() {
  const [tokenInput, setTokenInput] = useState<string>('')
  const [jwtParts, setJwtParts] = useState<JwtParts>({
    header: {},
    payload: {},
    signature: '',
    isValid: false,
  })
  const [mounted, setMounted] = useState(false)
  // Estado para simulador de modificação
  const [editedPayload, setEditedPayload] = useState<string>('')
  const [isEditingPayload, setIsEditingPayload] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (tokenInput.trim()) {
      try {
        const decoded = decodeJwt(tokenInput)
        setJwtParts(decoded)
        // Sincroniza o payload editado quando o token muda
        if (decoded.isValid && !isEditingPayload) {
          setEditedPayload(formatJson(decoded.payload))
        }
      } catch (e) {
        setJwtParts((prev) => ({ ...prev, isValid: false }))
      }
    } else {
      setJwtParts({
        header: {},
        payload: {},
        signature: '',
        isValid: false,
      })
      setEditedPayload('')
    }
  }, [tokenInput, isEditingPayload])

  // Métricas do token
  const tokenMetrics = useMemo(() => {
    const sizeBytes = new Blob([tokenInput]).size
    const exp = jwtParts.payload?.exp
    const iat = jwtParts.payload?.iat
    const now = Math.floor(Date.now() / 1000)

    let timeStatus = 'N/A'
    let progress = 0
    let timeRemaining = ''

    if (exp && iat) {
      const total = exp - iat
      const current = exp - now
      progress = Math.max(0, Math.min(100, (current / total) * 100))

      if (current <= 0) {
        timeStatus = 'Expirado'
      } else {
        const hours = Math.floor(current / 3600)
        const minutes = Math.floor((current % 3600) / 60)
        if (hours > 0) {
          timeRemaining = `${hours}h ${minutes}m`
        } else {
          timeRemaining = `${minutes}m`
        }
        timeStatus = `Expira em ${timeRemaining}`
      }
    }

    return {
      sizeBytes,
      timeStatus,
      progress,
      isExpired: exp ? exp < now : false,
      expDate: exp ? new Date(exp * 1000) : null,
      iatDate: iat ? new Date(iat * 1000) : null,
    }
  }, [tokenInput, jwtParts])

  // Análise de claims com descrições
  const analyzedClaims = useMemo(() => {
    if (!jwtParts.payload || Object.keys(jwtParts.payload).length === 0) return []

    return Object.entries(jwtParts.payload).map(([key, value]) => {
      const claimInfo = STANDARD_CLAIMS[key]
      const description = claimInfo
        ? `${claimInfo.short} - ${claimInfo.description}`
        : 'Claim customizada'
      let displayValue = value

      // Formatar valores especiais usando a função de formatação se disponível
      if (claimInfo?.format) {
        displayValue = claimInfo.format(value)
      } else if (key === 'exp' || key === 'iat' || key === 'nbf') {
        const date = new Date(Number(value) * 1000)
        displayValue = `${value} (${date.toLocaleString('pt-BR')})`
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value)
      } else {
        displayValue = String(value)
      }

      return {
        key,
        value: displayValue,
        description,
        shortDescription: claimInfo?.short || key,
        fullDescription: claimInfo?.description || 'Claim customizada',
        isStandard: !!claimInfo,
      }
    })
  }, [jwtParts.payload])

  // Token gerado a partir do payload editado
  const generatedToken = useMemo(() => {
    if (!isEditingPayload || !editedPayload.trim()) return null

    try {
      const parsedPayload = JSON.parse(editedPayload)
      const newToken = generateJwtToken(jwtParts.header, parsedPayload, jwtParts.signature)
      return newToken
    } catch {
      return null
    }
  }, [editedPayload, isEditingPayload, jwtParts.header, jwtParts.signature])

  if (!mounted) return null

  return (
    <div className='bg-background text-foreground flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <header className='bg-muted/20 flex shrink-0 flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary ring-primary/20 flex h-10 w-10 items-center justify-center rounded-lg ring-1'>
            <Key className='h-5 w-5' />
          </div>
          <div>
            <h1 className='text-lg leading-none font-bold tracking-tight'>JWT Decoder</h1>
            <div className='mt-1 flex items-center gap-2'>
              <Badge variant='outline' className='h-4 px-1 text-[10px]'>
                v1.0
              </Badge>
              <p className='text-muted-foreground text-xs'>Decodifique e analise tokens JWT</p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant={jwtParts.isValid ? 'default' : 'destructive'} className='h-8 gap-2 px-3'>
            {jwtParts.isValid ? (
              <>
                <CheckCircle2 className='h-3.5 w-3.5' />
                Válido
              </>
            ) : (
              <>
                <AlertTriangle className='h-3.5 w-3.5' />
                Inválido
              </>
            )}
          </Badge>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setTokenInput(DEMO_TOKEN)
              toast.success('Token de exemplo carregado')
            }}
            className='h-9 gap-2'>
            <ClipboardPaste className='h-3.5 w-3.5' />
            <span className='hidden sm:inline'>Exemplo</span>
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setTokenInput('')
              toast.success('Token limpo')
            }}
            className='text-destructive h-9 w-9 p-0'
            title='Limpar'>
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className='grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-2'>
        {/* Input Column */}
        <Card className='border-muted flex flex-col overflow-hidden'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 border-b py-3'>
            <CardTitle className='flex items-center gap-2 text-sm font-semibold'>
              <FileCode2 className='h-4 w-4' />
              Token JWT
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText()
                    setTokenInput(text)
                    toast.success('Token colado da área de transferência')
                  } catch {
                    toast.error('Erro ao acessar área de transferência')
                  }
                }}
                className='h-8 gap-1.5 text-xs'>
                <ClipboardPaste className='h-3.5 w-3.5' />
                Colar
              </Button>
            </div>
          </CardHeader>
          <div className='relative min-h-[300px] flex-1'>
            <CodeFormatterEditor value={tokenInput} onChange={setTokenInput} language='plaintext' />
          </div>
          <div className='bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs'>
            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-1.5'>
                <Activity className='h-3 w-3 text-emerald-500' />
                {tokenMetrics.sizeBytes} bytes
              </span>
              {jwtParts.header?.alg && (
                <span className='flex items-center gap-1.5'>
                  <ShieldCheck className='h-3 w-3 text-indigo-500' />
                  {jwtParts.header.alg}
                </span>
              )}
            </div>
            {tokenMetrics.expDate && (
              <span
                className={cn(
                  'flex items-center gap-1.5',
                  tokenMetrics.isExpired && 'text-destructive',
                )}>
                <Clock className='h-3 w-3' />
                {tokenMetrics.timeStatus}
              </span>
            )}
          </div>
        </Card>

        {/* Output Column */}
        <Card className='border-muted bg-muted/30 flex flex-col overflow-hidden'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 border-b py-3'>
            <CardTitle className='flex items-center gap-2 text-sm font-semibold'>
              <Database className='h-4 w-4' />
              Decodificado
            </CardTitle>
          </CardHeader>

          {!jwtParts.isValid && tokenInput.trim() ? (
            <div className='flex flex-1 items-center justify-center p-8'>
              <div className='space-y-2 text-center'>
                <AlertTriangle className='text-destructive/50 mx-auto h-12 w-12' />
                <p className='text-muted-foreground text-sm font-medium'>Token JWT inválido</p>
                <p className='text-muted-foreground/70 text-xs'>
                  {jwtParts.error || 'Verifique o formato do token'}
                </p>
              </div>
            </div>
          ) : !tokenInput.trim() ? (
            <div className='flex flex-1 items-center justify-center p-8'>
              <div className='space-y-2 text-center'>
                <Key className='text-muted-foreground/30 mx-auto h-12 w-12' />
                <p className='text-muted-foreground text-sm font-medium'>
                  Cole ou digite um token JWT
                </p>
                <p className='text-muted-foreground/70 text-xs'>
                  O token será decodificado automaticamente
                </p>
              </div>
            </div>
          ) : (
            <div className='flex flex-1 flex-col overflow-hidden'>
              {/* Métricas rápidas */}
              <div className='bg-muted/50 grid grid-cols-3 gap-2 border-b p-3'>
                <div className='space-y-1'>
                  <p className='text-muted-foreground text-[10px] font-semibold uppercase'>
                    Algoritmo
                  </p>
                  <p className='text-sm font-bold'>{jwtParts.header?.alg || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-muted-foreground text-[10px] font-semibold uppercase'>
                    Status
                  </p>
                  <p
                    className={cn(
                      'text-sm font-bold',
                      tokenMetrics.isExpired ? 'text-destructive' : 'text-emerald-600',
                    )}>
                    {tokenMetrics.isExpired ? 'Expirado' : 'Válido'}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-muted-foreground text-[10px] font-semibold uppercase'>
                    Claims
                  </p>
                  <p className='text-sm font-bold'>{Object.keys(jwtParts.payload || {}).length}</p>
                </div>
              </div>

              {tokenMetrics.expDate && (
                <div className='bg-muted/30 border-b p-3'>
                  <div className='mb-3 space-y-2'>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-muted-foreground font-medium'>Status</span>
                      <span
                        className={cn(
                          'font-semibold',
                          tokenMetrics.isExpired ? 'text-destructive' : 'text-emerald-600',
                        )}>
                        {tokenMetrics.timeStatus}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-muted-foreground font-medium'>Data de Expiração</span>
                      <div className='text-right'>
                        <p
                          className={cn(
                            'font-mono font-semibold',
                            tokenMetrics.isExpired ? 'text-destructive' : 'text-foreground',
                          )}>
                          {tokenMetrics.expDate.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                        <p className='text-muted-foreground text-[10px] font-normal'>
                          {tokenMetrics.expDate.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                          })}
                        </p>
                      </div>
                    </div>
                    {tokenMetrics.iatDate && (
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground font-medium'>Data de Emissão</span>
                        <p className='text-foreground font-mono font-semibold'>
                          {tokenMetrics.iatDate.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground flex items-center justify-between text-[10px]'>
                      <span>Progresso da vida útil</span>
                      <span>{Math.round(tokenMetrics.progress)}%</span>
                    </div>
                    <Progress
                      value={tokenMetrics.progress}
                      className={cn('h-2', tokenMetrics.isExpired && 'opacity-60')}
                    />
                  </div>
                </div>
              )}

              {/* Tabs de conteúdo */}
              <Tabs defaultValue='payload' className='flex flex-1 flex-col overflow-hidden'>
                <div className='border-b px-4 pt-3'>
                  <TabsList className='grid w-full grid-cols-2 gap-1 sm:grid-cols-5'>
                    <TabsTrigger value='payload' className='text-xs'>
                      Payload
                    </TabsTrigger>
                    <TabsTrigger value='header' className='text-xs'>
                      Header
                    </TabsTrigger>
                    <TabsTrigger value='claims' className='text-xs'>
                      Claims
                    </TabsTrigger>
                    <TabsTrigger value='simulator' className='text-xs'>
                      Simulador
                    </TabsTrigger>
                    <TabsTrigger value='signature' className='text-xs'>
                      Assinatura
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='payload' className='m-0 flex-1 overflow-hidden p-0'>
                  <div className='relative h-full min-h-[400px]'>
                    <div className='absolute top-4 right-4 z-10'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => {
                          navigator.clipboard.writeText(formatJson(jwtParts.payload))
                          toast.success('Payload copiado')
                        }}>
                        <Copy className='h-3.5 w-3.5' />
                      </Button>
                    </div>
                    <CodeFormatterEditor
                      value={formatJson(jwtParts.payload)}
                      onChange={() => {}}
                      language='json'
                    />
                  </div>
                </TabsContent>

                <TabsContent value='header' className='m-0 flex-1 overflow-hidden p-0'>
                  <div className='relative h-full min-h-[300px]'>
                    <div className='absolute top-4 right-4 z-10'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => {
                          navigator.clipboard.writeText(formatJson(jwtParts.header))
                          toast.success('Header copiado')
                        }}>
                        <Copy className='h-3.5 w-3.5' />
                      </Button>
                    </div>
                    <CodeFormatterEditor
                      value={formatJson(jwtParts.header)}
                      onChange={() => {}}
                      language='json'
                    />
                  </div>
                </TabsContent>

                <TabsContent value='claims' className='m-0 flex-1 overflow-auto'>
                  <div className='p-4'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-[150px]'>Claim</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className='text-right'>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyzedClaims.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className='text-muted-foreground text-center'>
                              Nenhuma claim encontrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          analyzedClaims.map((claim) => (
                            <TableRow key={claim.key}>
                              <TableCell>
                                <div className='flex items-center gap-2'>
                                  {claim.isStandard ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <code className='bg-muted text-primary cursor-help rounded px-1.5 py-0.5 font-mono text-xs font-semibold'>
                                          {claim.key}
                                        </code>
                                      </TooltipTrigger>
                                      <TooltipContent className='max-w-xs'>
                                        <div className='space-y-1'>
                                          <p className='font-semibold'>{claim.shortDescription}</p>
                                          <p className='text-xs'>{claim.fullDescription}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <code className='bg-muted text-primary rounded px-1.5 py-0.5 font-mono text-xs font-semibold'>
                                      {claim.key}
                                    </code>
                                  )}
                                  {claim.isStandard && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant='outline'
                                          className='h-4 cursor-help text-[9px]'>
                                          Padrão
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className='text-xs'>Claim padrão do JWT (RFC 7519)</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className='text-muted-foreground text-sm'>
                                {claim.isStandard ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className='cursor-help underline decoration-dotted'>
                                        {claim.shortDescription}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-xs'>
                                      <p className='text-xs'>{claim.fullDescription}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  claim.description
                                )}
                              </TableCell>
                              <TableCell className='text-right'>
                                <code className='bg-muted ml-auto block max-w-[300px] truncate rounded px-2 py-1 font-mono text-xs'>
                                  {claim.value}
                                </code>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value='simulator' className='m-0 flex-1 overflow-hidden p-0'>
                  <div className='flex h-full flex-col'>
                    {/* Header do Simulador */}
                    <div className='bg-muted/30 border-b p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Edit className='text-primary h-4 w-4' />
                        <h3 className='font-semibold'>Simulador de Modificação</h3>
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        Edite o payload abaixo para ver como o token seria gerado. A assinatura não
                        será válida, mas útil para depurar estruturas de dados.
                      </p>
                    </div>

                    {/* Editor de Payload */}
                    <div className='relative flex-1'>
                      <div className='absolute top-4 right-4 z-10 flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setEditedPayload(formatJson(jwtParts.payload))
                            setIsEditingPayload(true)
                            toast.success('Payload carregado para edição')
                          }}
                          className='h-8 gap-1.5 text-xs'>
                          <Copy className='h-3 w-3' />
                          Resetar
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            try {
                              const parsed = JSON.parse(editedPayload)
                              setJwtParts((prev) => ({ ...prev, payload: parsed }))
                              setIsEditingPayload(false)
                              toast.success('Payload atualizado')
                            } catch (e) {
                              toast.error('JSON inválido. Verifique a sintaxe.')
                            }
                          }}
                          disabled={!isEditingPayload}
                          className='h-8 gap-1.5 text-xs'>
                          <CheckCircle2 className='h-3 w-3' />
                          Aplicar
                        </Button>
                      </div>
                      <CodeFormatterEditor
                        value={editedPayload || formatJson(jwtParts.payload)}
                        onChange={(value) => {
                          setEditedPayload(value)
                          setIsEditingPayload(true)
                        }}
                        language='json'
                      />
                    </div>

                    {/* Token Gerado */}
                    {generatedToken && (
                      <div className='bg-muted/30 border-t p-4'>
                        <div className='mb-2 flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <Key className='text-primary h-4 w-4' />
                            <span className='text-sm font-semibold'>Token Gerado</span>
                            <Badge variant='outline' className='text-[10px]'>
                              Assinatura inválida (apenas visualização)
                            </Badge>
                          </div>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              navigator.clipboard.writeText(generatedToken)
                              toast.success('Token gerado copiado')
                            }}
                            className='h-7 gap-1.5 text-xs'>
                            <Copy className='h-3 w-3' />
                            Copiar
                          </Button>
                        </div>
                        <div className='bg-muted/50 relative h-[120px] rounded border'>
                          <CodeFormatterEditor
                            value={generatedToken}
                            onChange={() => {}}
                            language='plaintext'
                          />
                        </div>
                        <p className='text-muted-foreground mt-2 text-[10px]'>
                          ⚠️ Este token não possui assinatura válida. Use apenas para depuração de
                          estrutura de dados.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value='signature' className='m-0 flex-1 overflow-auto p-0'>
                  <div className='flex min-h-full flex-col p-4'>
                    {/* Informações da Assinatura */}
                    <div className='mb-4 space-y-4'>
                      <div className='bg-muted/30 rounded-lg border p-4'>
                        <div className='mb-3 flex items-center gap-2'>
                          <Fingerprint className='text-primary h-5 w-5' />
                          <h3 className='font-semibold'>Informações da Assinatura</h3>
                        </div>
                        <div className='space-y-2 text-sm'>
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground font-medium'>Algoritmo:</span>
                            <Badge variant='secondary' className='font-mono'>
                              {jwtParts.header?.alg || 'N/A'}
                            </Badge>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground font-medium'>Tipo:</span>
                            <Badge variant='secondary' className='font-mono'>
                              {jwtParts.header?.typ || 'JWT'}
                            </Badge>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground font-medium'>
                              Tamanho da assinatura:
                            </span>
                            <span className='font-mono text-xs'>
                              {jwtParts.signature?.length || 0} caracteres
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Explicação da Assinatura */}
                      <div className='border-primary/20 bg-primary/5 rounded-lg border p-4'>
                        <div className='mb-2 flex items-center gap-2'>
                          <ShieldAlert className='text-primary h-4 w-4' />
                          <h4 className='text-sm font-semibold'>Como funciona a assinatura</h4>
                        </div>
                        <div className='text-muted-foreground space-y-2 text-xs'>
                          <p>
                            A assinatura JWT é criada usando o algoritmo especificado no header (
                            <code className='bg-muted rounded px-1 py-0.5 font-mono'>
                              {jwtParts.header?.alg || 'alg'}
                            </code>
                            ) para garantir a integridade do token.
                          </p>
                          <div className='bg-muted/50 rounded p-3 font-mono text-[11px] leading-relaxed'>
                            <p className='text-primary mb-1'>Fórmula:</p>
                            <p className='pl-2'>
                              {jwtParts.header?.alg === 'HS256' ||
                              jwtParts.header?.alg === 'HS384' ||
                              jwtParts.header?.alg === 'HS512' ? (
                                <>
                                  <span className='text-primary'>
                                    {jwtParts.header?.alg || 'HMAC'}
                                  </span>
                                  {'('}
                                  <br className='pl-4' />
                                  <span className='pl-4 italic'>
                                    base64UrlEncode(header) + "." + base64UrlEncode(payload),
                                    <br />
                                    secret-key
                                  </span>
                                  <br />
                                  {')'}
                                </>
                              ) : jwtParts.header?.alg === 'RS256' ||
                                jwtParts.header?.alg === 'RS384' ||
                                jwtParts.header?.alg === 'RS512' ||
                                jwtParts.header?.alg === 'ES256' ||
                                jwtParts.header?.alg === 'ES384' ||
                                jwtParts.header?.alg === 'ES512' ? (
                                <>
                                  <span className='text-primary'>
                                    {jwtParts.header?.alg || 'RSA/ECDSA'}
                                  </span>
                                  {'('}
                                  <br className='pl-4' />
                                  <span className='pl-4 italic'>
                                    base64UrlEncode(header) + "." + base64UrlEncode(payload),
                                    <br />
                                    private-key
                                  </span>
                                  <br />
                                  {')'}
                                </>
                              ) : (
                                <>
                                  <span className='text-primary'>Algoritmo</span>
                                  {'('}
                                  <br className='pl-4' />
                                  <span className='pl-4 italic'>
                                    base64UrlEncode(header) + "." + base64UrlEncode(payload),
                                    <br />
                                    key
                                  </span>
                                  <br />
                                  {')'}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Aviso de Segurança */}
                      <div className='rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
                        <div className='mb-2 flex items-center gap-2'>
                          <AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-500' />
                          <h4 className='text-sm font-semibold text-amber-900 dark:text-amber-100'>
                            Validação de Assinatura
                          </h4>
                        </div>
                        <p className='text-xs text-amber-800 dark:text-amber-200'>
                          Para validar a assinatura, você precisa da chave secreta
                          (HS256/HS384/HS512) ou chave pública (RS256/ES256/etc.) correspondente.
                          Esta ferramenta apenas decodifica o token, não valida a assinatura.
                        </p>
                      </div>
                    </div>

                    {/* Assinatura Raw */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Lock className='text-muted-foreground h-4 w-4' />
                          <span className='text-sm font-medium'>Assinatura (Base64URL)</span>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-7 gap-1.5 text-xs'
                          onClick={() => {
                            navigator.clipboard.writeText(jwtParts.signature)
                            toast.success('Assinatura copiada')
                          }}>
                          <Copy className='h-3 w-3' />
                          Copiar
                        </Button>
                      </div>
                      <div className='bg-muted/30 relative h-[250px] rounded border'>
                        <CodeFormatterEditor
                          value={jwtParts.signature || 'Nenhuma assinatura encontrada'}
                          onChange={() => {}}
                          language='plaintext'
                        />
                      </div>
                    </div>

                    {/* Informações Técnicas Adicionais */}
                    <div className='bg-muted/30 mt-4 rounded-lg border p-3'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Info className='text-muted-foreground h-4 w-4' />
                        <h4 className='text-xs font-semibold'>Informações Técnicas</h4>
                      </div>
                      <div className='text-muted-foreground space-y-1.5 text-xs'>
                        <div className='flex items-center justify-between'>
                          <span>Formato do token:</span>
                          <code className='bg-muted rounded px-1.5 py-0.5 font-mono'>
                            header.payload.signature
                          </code>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span>Encoding:</span>
                          <code className='bg-muted rounded px-1.5 py-0.5 font-mono'>
                            Base64URL
                          </code>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span>Padrão:</span>
                          <code className='bg-muted rounded px-1.5 py-0.5 font-mono'>RFC 7519</code>
                        </div>
                        {jwtParts.header?.kid && (
                          <div className='flex items-center justify-between'>
                            <span>Key ID:</span>
                            <code className='bg-muted rounded px-1.5 py-0.5 font-mono'>
                              {jwtParts.header.kid}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </Card>
      </div>

      {/* Footer Info */}
      <footer className='bg-muted/20 text-muted-foreground flex shrink-0 items-center justify-between border-t px-6 py-3 text-[10px] font-semibold tracking-wider uppercase'>
        <div className='flex items-center gap-4'>
          <span className='flex items-center gap-1.5'>
            <CheckCircle2 className='h-3 w-3 text-emerald-500' />
            RFC 7519 Compliant
          </span>
          <span className='flex items-center gap-1.5'>
            <Info className='h-3 w-3' />
            Processamento local
          </span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Fingerprint className='h-3 w-3' />
          <span>Seguro e privado</span>
        </div>
      </footer>
    </div>
  )
}
