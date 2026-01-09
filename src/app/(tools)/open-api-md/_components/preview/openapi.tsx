'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Book,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Globe,
  Info,
  Layers,
  Lock,
  Search,
  Server,
  Tag,
} from 'lucide-react'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { METHOD_COLORS } from '../constants'
import type { ParsedOpenAPI, ParsedPath, ParsedSchema } from '../utils'

interface OpenApiPreviewProps {
  filteredPaths: ParsedPath[]
  filteredSchemas: ParsedSchema[]
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  setActiveMethods: (activeMethods: string[]) => void
  result: ParsedOpenAPI
  pathsByTag: Map<string, ParsedPath[]>
  untaggedPaths: ParsedPath[]
}

const CopyButton = ({ text, className }: { text: string; className?: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita abrir o accordion se estiver num header
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className={`h-6 w-6 ${className}`}
      onClick={handleCopy}
      title='Copiar'>
      {isCopied ? (
        <Check className='h-3 w-3 text-green-500' />
      ) : (
        <Copy className='text-muted-foreground h-3 w-3' />
      )}
    </Button>
  )
}
const SchemaProperty = ({
  name,
  schema,
  required,
  depth = 0,
}: {
  name: string
  schema: any
  required: boolean
  depth?: number
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const isObject =
    schema.type === 'object' || (schema.properties && Object.keys(schema.properties).length > 0)
  const isArray = schema.type === 'array'

  // Indentação visual baseada na profundidade
  const paddingLeft = `${depth * 1.5}rem`

  return (
    <div className='border-border/50 border-l first:border-t-0'>
      <div
        className={`hover:bg-muted/30 flex items-center gap-2 py-2 pr-2 transition-colors ${
          depth > 0 ? 'border-border/30 border-t' : ''
        }`}
        style={{ paddingLeft: depth === 0 ? '0.5rem' : paddingLeft }}>
        {/* Ícone de Expandir/Colapsar para objetos complexos */}
        {isObject || (isArray && schema.items?.type === 'object') ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-muted-foreground hover:text-foreground shrink-0 focus:outline-none'>
            {isExpanded ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )}
          </button>
        ) : (
          <div className='w-3' /> // Espaçador
        )}

        <div className='flex flex-1 flex-wrap items-center gap-2 overflow-hidden'>
          <span className='text-foreground font-mono text-sm font-semibold'>{name}</span>

          <div className='flex items-center gap-1.5'>
            {required && (
              <span className='text-[10px] font-bold tracking-wider text-red-500 uppercase'>
                Required
              </span>
            )}
            <Badge
              variant='outline'
              className='text-muted-foreground h-5 px-1.5 text-[10px] font-normal'>
              {schema.type || 'any'}
            </Badge>
            {isArray && (
              <Badge variant='secondary' className='h-5 px-1.5 text-[10px]'>
                Array of {schema.items?.type || 'any'}
              </Badge>
            )}
          </div>

          {schema.description && (
            <span className='text-muted-foreground ml-auto max-w-[300px] truncate text-xs md:ml-2'>
              {schema.description}
            </span>
          )}
        </div>
      </div>

      {/* Renderização Recursiva */}
      {isExpanded && (
        <div className='bg-muted/5'>
          {isObject &&
            schema.properties &&
            Object.entries(schema.properties).map(([key, value]: [string, any]) => (
              <SchemaProperty
                key={key}
                name={key}
                schema={value}
                required={schema.required?.includes(key)}
                depth={depth + 1}
              />
            ))}
          {isArray &&
            schema.items?.type === 'object' &&
            schema.items.properties &&
            Object.entries(schema.items.properties).map(([key, value]: [string, any]) => (
              <SchemaProperty
                key={key}
                name={key}
                schema={value}
                required={schema.items.required?.includes(key)}
                depth={depth + 1}
              />
            ))}
        </div>
      )}
    </div>
  )
}
const EndpointCard = ({ path }: { path: ParsedPath }) => {
  const [isOpen, setIsOpen] = useState(false)
  const methodColors = METHOD_COLORS[path.method] || METHOD_COLORS.GET

  return (
    <Card
      className={`overflow-hidden border-l-4 transition-all hover:shadow-md ${isOpen ? 'ring-border ring-1' : ''}`}
      style={{ borderLeftColor: methodColors.text.split(' ')[0].replace('text-', 'var(--') }}>
      {/* Header Clicável (Accordion Trigger) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='bg-card hover:bg-muted/10 cursor-pointer transition-colors'>
        <div className='flex items-center justify-between gap-4 p-4'>
          <div className='flex flex-1 items-center gap-3 overflow-hidden'>
            {/* Badge do Método */}
            <div
              className={`flex h-7 w-16 shrink-0 items-center justify-center rounded border text-xs font-bold ${methodColors.bg} ${methodColors.text} ${methodColors.border} `}>
              {path.method}
            </div>

            {/* Caminho e Resumo */}
            <div className='flex min-w-0 flex-col'>
              <div className='flex items-center gap-2'>
                <code className='truncate text-sm font-semibold'>{path.path}</code>
                <CopyButton
                  text={path.path}
                  className='opacity-0 transition-opacity group-hover:opacity-100'
                />
              </div>
              <span className='text-muted-foreground truncate text-xs'>
                {path.summary || 'Sem descrição'}
              </span>
            </div>
          </div>

          <div className='flex shrink-0 items-center gap-3'>
            {path.tags?.map((tag) => (
              <Badge key={tag} variant='secondary' className='hidden h-5 text-[10px] sm:flex'>
                {tag}
              </Badge>
            ))}
            <ChevronDown
              className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      {isOpen && (
        <>
          <Separator />
          <CardContent className='animate-in fade-in slide-in-from-top-2 space-y-6 p-4 duration-200'>
            {path.description && (
              <p className='text-muted-foreground text-sm'>{path.description}</p>
            )}

            {/* Parâmetros */}
            {path.parameters && path.parameters.length > 0 && (
              <div className='space-y-3'>
                <div className='flex items-center gap-2 border-b pb-2'>
                  <Info className='text-primary h-4 w-4' />
                  <h4 className='text-sm font-semibold'>Parâmetros</h4>
                </div>
                <div className='grid gap-2'>
                  {path.parameters.map((param, idx) => (
                    <div
                      key={idx}
                      className='bg-muted/20 flex items-center justify-between rounded-md border p-2 text-sm'>
                      <div className='flex items-center gap-3'>
                        <code className='bg-muted rounded px-1 py-0.5 text-xs font-bold'>
                          {param.name}
                        </code>
                        <span className='text-muted-foreground text-xs'>({param.in})</span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span className='font-mono text-xs'>{param.schema?.type}</span>
                        {param.required && (
                          <Badge variant='destructive' className='h-4 px-1 text-[10px]'>
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {path.requestBody && (
              <div className='space-y-3'>
                <div className='flex items-center gap-2 border-b pb-2'>
                  <FileText className='text-primary h-4 w-4' />
                  <h4 className='text-sm font-semibold'>Corpo da Requisição</h4>
                  {path.requestBody.required && (
                    <Badge variant='outline' className='border-red-500 text-[10px] text-red-500'>
                      Obrigatório
                    </Badge>
                  )}
                </div>
                {path.requestBody.content &&
                  Object.entries(path.requestBody.content).map(([contentType, content], idx) => (
                    <div key={idx} className='bg-muted/10 overflow-hidden rounded-lg border'>
                      <div className='bg-muted/30 flex items-center justify-between border-b px-3 py-2'>
                        <span className='text-xs font-medium'>{contentType}</span>
                        {content.example && (
                          <CopyButton text={JSON.stringify(content.example, null, 2)} />
                        )}
                      </div>
                      {content.example && (
                        <SyntaxHighlighter
                          style={oneDark as any}
                          language='json'
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            fontSize: '12px',
                            background: '#09090b',
                          }}>
                          {JSON.stringify(content.example, null, 2)}
                        </SyntaxHighlighter>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Respostas */}
            {path.responses && path.responses.length > 0 && (
              <div className='space-y-3'>
                <div className='flex items-center gap-2 border-b pb-2'>
                  <CheckCircle2 className='text-primary h-4 w-4' />
                  <h4 className='text-sm font-semibold'>Respostas</h4>
                </div>
                <div className='space-y-3'>
                  {path.responses.map((response, idx) => {
                    const statusFirstChar = response.statusCode.charAt(0)
                    const statusColor =
                      statusFirstChar === '2'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : statusFirstChar === '4'
                          ? 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                          : statusFirstChar === '5'
                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                            : 'bg-slate-500/10 text-slate-600 border-slate-500/20'

                    return (
                      <div key={idx} className='overflow-hidden rounded-lg border'>
                        <div className='bg-muted/20 flex items-center gap-3 p-3'>
                          <div
                            className={`rounded border px-2 py-1 text-xs font-bold ${statusColor}`}>
                            {response.statusCode}
                          </div>
                          <p className='flex-1 text-sm font-medium'>{response.description}</p>
                        </div>
                        {response.content &&
                          Object.entries(response.content).map(([contentType, content], cIdx) => (
                            <div key={cIdx}>
                              <div className='bg-muted/10 flex items-center justify-between border-t border-b px-3 py-1.5'>
                                <span className='text-muted-foreground text-[10px]'>
                                  {contentType}
                                </span>
                                {content.example && (
                                  <CopyButton text={JSON.stringify(content.example, null, 2)} />
                                )}
                              </div>
                              {content.example && (
                                <SyntaxHighlighter
                                  style={oneDark as any}
                                  language='json'
                                  customStyle={{
                                    margin: 0,
                                    padding: '0.75rem',
                                    fontSize: '12px',
                                    background: '#09090b',
                                  }}>
                                  {JSON.stringify(content.example, null, 2)}
                                </SyntaxHighlighter>
                              )}
                            </div>
                          ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  )
}
const SchemaCard = ({ schema }: { schema: ParsedSchema }) => {
  return (
    <Card className='w-full flex-1 overflow-hidden'>
      <CardHeader className='bg-muted/20 border-b px-4 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm font-bold'>{schema.name}</CardTitle>
            <Badge variant='outline' className='text-[10px]'>
              {schema.type}
            </Badge>
          </div>
          {schema.example && <CopyButton text={JSON.stringify(schema.example, null, 2)} />}
        </div>
        {schema.description && (
          <CardDescription className='mt-1 text-xs'>{schema.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className='p-0'>
        {/* Visualizador de Árvore */}
        {schema.properties ? (
          <div className='p-2'>
            {Object.entries(schema.properties).map(([propName, propSchema]: [string, any]) => (
              <SchemaProperty
                key={propName}
                name={propName}
                schema={propSchema}
                required={schema.required?.includes(propName) || false}
              />
            ))}
          </div>
        ) : (
          <div className='text-muted-foreground p-4 text-center text-sm italic'>
            Objeto sem propriedades definidas
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OpenApiPreviewComponent({
  filteredPaths,
  filteredSchemas,
  searchTerm,
  setSearchTerm,
  setActiveMethods,
  result,
  pathsByTag,
  untaggedPaths,
}: OpenApiPreviewProps) {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 pb-20'>
        {/* Resultado Vazio */}
        {filteredPaths.length === 0 && filteredSchemas.length === 0 && (
          <div className='rounded-xl border-2 border-dashed py-12 text-center'>
            <Search className='text-muted-foreground mx-auto mb-3 h-10 w-10 opacity-20' />
            <p className='text-muted-foreground font-medium'>Nenhum resultado encontrado</p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Tente ajustar seus termos de busca ou filtros.
            </p>
            <Button
              variant='link'
              onClick={() => {
                setSearchTerm('')
                setActiveMethods([])
              }}
              className='mt-2'>
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Servidores */}
        {!searchTerm && result.servers && result.servers.length > 0 && (
          <section className='mb-8 space-y-3'>
            <div className='flex items-center gap-2'>
              <Server className='text-primary h-5 w-5' />
              <h3 className='text-lg font-semibold'>Servidores</h3>
            </div>
            <div className='grid gap-3 md:grid-cols-2'>
              {result.servers.map((server, idx) => (
                <Card key={idx} className='bg-muted/10'>
                  <CardContent className='flex items-start gap-3 p-4'>
                    <Globe className='text-muted-foreground mt-0.5 h-5 w-5' />
                    <div>
                      <code className='bg-muted rounded px-1.5 py-0.5 font-mono text-sm font-semibold'>
                        {server.url}
                      </code>
                      {server.description && (
                        <p className='text-muted-foreground mt-1 text-xs'>{server.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Autenticação */}
        {!searchTerm &&
          result.securitySchemes &&
          Object.keys(result.securitySchemes).length > 0 && (
            <section className='mb-8 space-y-3'>
              <div className='flex items-center gap-2'>
                <Lock className='text-primary h-5 w-5' />
                <h3 className='text-lg font-semibold'>Autenticação</h3>
              </div>
              <div className='grid gap-3 md:grid-cols-3'>
                {Object.entries(result.securitySchemes).map(([schemeName, scheme]) => (
                  <Card key={schemeName} className='bg-muted/10'>
                    <CardHeader className='p-4 pb-2'>
                      <CardTitle className='font-mono text-sm'>{schemeName}</CardTitle>
                    </CardHeader>
                    <CardContent className='p-4 pt-0'>
                      <div className='mb-2 flex gap-2'>
                        <Badge variant='outline' className='text-[10px]'>
                          {scheme.type}
                        </Badge>
                        {scheme.scheme && (
                          <Badge variant='outline' className='text-[10px]'>
                            {scheme.scheme}
                          </Badge>
                        )}
                      </div>
                      {scheme.description && (
                        <p className='text-muted-foreground text-xs'>{scheme.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Separator className='my-6' />
            </section>
          )}

        {/* Lista de Endpoints por Tag (com Sticky Header) */}
        <div className='space-y-8'>
          {Array.from(pathsByTag.entries()).map(([tag, paths]) => (
            <section key={tag} className='relative'>
              {/* Sticky Header para a Tag */}
              <div className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 mb-4 flex items-center justify-between border-b py-3 backdrop-blur'>
                <div className='flex items-center gap-2'>
                  <Tag className='text-primary h-5 w-5' />
                  <h3 className='text-lg font-bold'>{tag}</h3>
                </div>
                <Badge variant='secondary'>{paths.length}</Badge>
              </div>

              <div className='grid gap-4'>
                {paths.map((path, idx) => (
                  <EndpointCard key={idx} path={path} />
                ))}
              </div>
            </section>
          ))}

          {/* Endpoints sem Tag */}
          {untaggedPaths.length > 0 && (
            <section className='relative'>
              <div className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 mb-4 flex items-center justify-between border-b py-3 backdrop-blur'>
                <div className='flex items-center gap-2'>
                  <Layers className='text-primary h-5 w-5' />
                  <h3 className='text-lg font-bold'>Geral</h3>
                </div>
                <Badge variant='secondary'>{untaggedPaths.length}</Badge>
              </div>
              <div className='grid gap-4'>
                {untaggedPaths.map((path, idx) => (
                  <EndpointCard key={idx} path={path} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Schemas */}
        {filteredSchemas.length > 0 && (
          <>
            <div className='my-10 flex items-center gap-4'>
              <Separator className='flex-1' />
              <div className='text-muted-foreground flex items-center gap-2'>
                <Book className='h-4 w-4' />
                <span className='text-sm font-semibold tracking-wider uppercase'>
                  Modelos de Dados
                </span>
              </div>
              <Separator className='flex-1' />
            </div>

            <div className='grid items-start gap-6 md:grid-cols-2 xl:grid-cols-2'>
              {filteredSchemas.map((schema, idx) => (
                <SchemaCard key={idx} schema={schema} />
              ))}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  )
}
