'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { safeJsonParse } from '@/lib/security-utils'
import { cn } from '@/lib/utils'
import {
  Braces,
  Brackets,
  ChevronRight,
  Circle,
  Copy,
  FileJson,
  Hash,
  Image as ImageIcon,
  Type,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { formatJsonPath } from './json-path-utils'

interface JsonTreeNode {
  key: string | number | null
  value: any
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  path: (string | number)[]
  children?: JsonTreeNode[]
  isExpanded?: boolean
}

interface JsonTreeViewProps {
  jsonText: string
  onPathCopy?: (path: string) => void
}

export function JsonTreeView({ jsonText, onPathCopy }: JsonTreeViewProps) {
  const treeData = useMemo(() => {
    if (!jsonText.trim()) return null

    const parseResult = safeJsonParse(jsonText)
    if (!parseResult.success || !parseResult.data) {
      return null
    }

    return buildTree(parseResult.data, [])
  }, [jsonText])

  // Calcular todos os paths para iniciar expandido
  const getAllPaths = useMemo(() => {
    const paths = new Set<string>()

    function collectPaths(node: JsonTreeNode) {
      if (node.children && node.children.length > 0) {
        const pathString = formatJsonPath(node.path)
        paths.add(pathString)
        node.children.forEach((child) => collectPaths(child))
      }
    }

    if (treeData) {
      collectPaths(treeData)
    }

    return paths
  }, [treeData])

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(getAllPaths)

  // Atualizar expandedPaths quando treeData mudar
  useEffect(() => {
    setExpandedPaths(getAllPaths)
  }, [getAllPaths])

  const toggleNode = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const handleCopyPath = (path: (string | number)[]) => {
    const pathString = formatJsonPath(path)
    navigator.clipboard.writeText(pathString)
    toast.success(`JSON Path copiado: ${pathString}`)
    onPathCopy?.(pathString)
  }

  if (!treeData) {
    return (
      <div className='flex h-full items-center justify-center bg-[#282A36] p-8'>
        <div className='space-y-3 text-center'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#BD93F9]/30 bg-[#44475A]/50'>
            <FileJson className='h-8 w-8 text-[#BD93F9]' />
          </div>
          <div>
            <p className='mb-1 font-medium text-[#F8F8F2]'>JSON inválido ou vazio</p>
            <p className='text-sm text-[#6272A4]'>Cole um JSON válido para visualizar em árvore</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full overflow-auto bg-[#282A36] dark:bg-[#282A36]'>
      <div className='space-y-0.5 p-4'>
        <JsonTreeNodeComponent
          node={treeData}
          expandedPaths={expandedPaths}
          onToggle={toggleNode}
          onCopyPath={handleCopyPath}
          level={0}
        />
      </div>
    </div>
  )
}

function JsonTreeNodeComponent({
  node,
  expandedPaths,
  onToggle,
  onCopyPath,
  level,
}: {
  node: JsonTreeNode
  expandedPaths: Set<string>
  onToggle: (path: string) => void
  onCopyPath: (path: (string | number)[]) => void
  level: number
}) {
  const pathString = formatJsonPath(node.path)
  const isExpanded = expandedPaths.has(pathString)
  const hasChildren = node.children && node.children.length > 0
  const canExpand = hasChildren && (node.type === 'object' || node.type === 'array')

  const handleToggle = () => {
    if (canExpand) {
      onToggle(pathString)
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopyPath(node.path)
  }

  const indentWidth = 20
  const hasSibling = false // Poderia ser calculado se necessário

  return (
    <div className='relative select-none'>
      {/* Linha de conexão vertical */}
      {level > 0 && (
        <div
          className='absolute top-0 bottom-0 left-0 w-px bg-[#BD93F9]/20'
          style={{ left: `${(level - 1) * indentWidth + 8}px` }}
        />
      )}

      <div
        className={cn(
          'group relative flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-all',
          'hover:bg-[#44475A]/60 hover:shadow-lg hover:shadow-purple-500/10',
          level === 0 && 'bg-[#21222C]/50 hover:bg-[#21222C]/70',
          'border border-transparent hover:border-[#BD93F9]/30',
        )}
        style={{ paddingLeft: `${level * indentWidth + 8}px` }}>
        {/* Ícone de tipo */}
        <div className={cn('shrink-0', getTypeIconClass(node.type))}>
          {getTypeIcon(node.type, canExpand ?? false)}
        </div>

        {/* Ícone de expansão */}
        {canExpand ? (
          <button
            onClick={handleToggle}
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all',
              'text-[#8BE9FD] hover:bg-[#44475A]/80 hover:text-[#BD93F9]',
              'border border-transparent hover:border-[#BD93F9]/40',
            )}>
            <ChevronRight
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                isExpanded && 'rotate-90',
              )}
            />
          </button>
        ) : (
          <div className='w-5 shrink-0' />
        )}

        {/* Chave */}
        {node.key !== null && (
          <span
            className={cn(
              'font-mono text-sm font-semibold',
              'text-[#8BE9FD]',
              typeof node.key === 'number' && 'text-[#BD93F9]',
            )}>
            {typeof node.key === 'number' ? `[${node.key}]` : `"${node.key}"`}:
          </span>
        )}

        {/* Valor */}
        <span className={cn('min-w-0 flex-1 font-mono text-sm', getValueColorClass(node.type))}>
          {renderValue(node.value, node.type)}
        </span>

        {/* Tipo badge */}
        <span
          className={cn(
            'ml-auto shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
            'bg-[#44475A]/40 text-[#6272A4]',
            'border border-[#6272A4]/30',
            'group-hover:border-[#BD93F9]/40 group-hover:bg-[#44475A]/60 group-hover:text-[#BD93F9]',
          )}>
          {node.type}
        </span>

        {/* Botão de copiar path */}
        {node.path.length > 0 && (
          <Button
            variant='ghost'
            size='icon'
            className={cn(
              'h-6 w-6 shrink-0 opacity-0 transition-all group-hover:opacity-100',
              'text-[#8BE9FD] hover:bg-[#44475A]/80 hover:text-[#8BE9FD]',
            )}
            onClick={handleCopy}
            title={`Copiar JSON Path: ${pathString}`}>
            <Copy className='h-3 w-3' />
          </Button>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className='relative'>
          {/* Linha horizontal conectando ao nó pai */}
          <div
            className='absolute top-0 left-0 h-4 w-px bg-[#BD93F9]/30'
            style={{ left: `${(level - 1) * indentWidth + 8}px` }}
          />
          {node.children!.map((child, idx) => (
            <JsonTreeNodeComponent
              key={idx}
              node={child}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
              onCopyPath={onCopyPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function buildTree(data: any, path: (string | number)[]): JsonTreeNode {
  const type = getValueType(data)

  const node: JsonTreeNode = {
    key: path.length > 0 ? path[path.length - 1] : null,
    value: data,
    type,
    path: [...path],
  }

  if (type === 'object' && data !== null) {
    node.children = Object.entries(data).map(([key, value]) => buildTree(value, [...path, key]))
  } else if (type === 'array') {
    node.children = data.map((item: any, index: number) => buildTree(item, [...path, index]))
  }

  return node
}

function getValueType(value: any): JsonTreeNode['type'] {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value as 'string' | 'number' | 'boolean'
}

function isImageUrl(str: string): boolean {
  if (typeof str !== 'string') return false
  const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i
  return urlPattern.test(str.trim())
}

function renderValue(value: any, type: JsonTreeNode['type']): React.ReactNode {
  switch (type) {
    case 'string':
      const stringValue = String(value)
      const isImage = isImageUrl(stringValue)
      const displayValue = `"${stringValue.slice(0, 50)}${stringValue.length > 50 ? '...' : ''}"`

      if (isImage) {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <span className='inline-flex cursor-pointer items-center gap-1.5 text-[#50FA7B] underline decoration-dotted decoration-2 underline-offset-2 transition-colors hover:text-[#8BE9FD]'>
                <ImageIcon className='h-3 w-3' />
                {displayValue}
              </span>
            </PopoverTrigger>
            <PopoverContent className='w-80 border-[#44475A] bg-[#282A36] p-2' align='start'>
              <img
                src={stringValue}
                alt='Preview'
                className='w-full rounded-md border border-[#BD93F9]/30 shadow-lg'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <p className='mt-2 font-mono text-xs break-all text-[#6272A4]'>{stringValue}</p>
            </PopoverContent>
          </Popover>
        )
      }
      return displayValue
    case 'number':
      return <span className='font-semibold text-[#F1FA8C]'>{String(value)}</span>
    case 'boolean':
      return (
        <span className={cn('font-semibold', value ? 'text-[#50FA7B]' : 'text-[#FF5555]')}>
          {String(value)}
        </span>
      )
    case 'null':
      return <span className='text-[#6272A4] italic'>null</span>
    case 'object':
      return (
        <span className='text-[#FFB86C]/80'>
          {'{'} <span className='font-semibold text-[#F1FA8C]'>{Object.keys(value).length}</span>{' '}
          propriedade
          {Object.keys(value).length !== 1 ? 's' : ''} {'}'}
        </span>
      )
    case 'array':
      return (
        <span className='text-[#FF79C6]/80'>
          {'['} <span className='font-semibold text-[#F1FA8C]'>{value.length}</span> item
          {value.length !== 1 ? 's' : ''} {']'}
        </span>
      )
    default:
      return String(value)
  }
}

function getValueColorClass(type: JsonTreeNode['type']): string {
  switch (type) {
    case 'string':
      return 'text-[#50FA7B]' // Verde Dracula
    case 'number':
      return 'text-[#F1FA8C]' // Amarelo Dracula
    case 'boolean':
      return 'text-[#BD93F9]' // Roxo Dracula
    case 'null':
      return 'text-[#6272A4]' // Comentários Dracula
    case 'object':
      return 'text-[#FFB86C]' // Laranja Dracula
    case 'array':
      return 'text-[#FF79C6]' // Rosa Dracula
    default:
      return 'text-[#F8F8F2]' // Foreground Dracula
  }
}

function getTypeIconClass(type: JsonTreeNode['type']): string {
  switch (type) {
    case 'string':
      return 'text-[#50FA7B]' // Verde Dracula
    case 'number':
      return 'text-[#F1FA8C]' // Amarelo Dracula
    case 'boolean':
      return 'text-[#BD93F9]' // Roxo Dracula
    case 'null':
      return 'text-[#6272A4]' // Comentários Dracula
    case 'object':
      return 'text-[#FFB86C]' // Laranja Dracula
    case 'array':
      return 'text-[#FF79C6]' // Rosa Dracula
    default:
      return 'text-[#6272A4]' // Comentários Dracula
  }
}

function getTypeIcon(type: JsonTreeNode['type'], canExpand: boolean): React.ReactNode {
  const iconClass = 'h-3.5 w-3.5'

  if (canExpand) {
    if (type === 'object') {
      return <Braces className={iconClass} />
    }
    if (type === 'array') {
      return <Brackets className={iconClass} />
    }
  }

  switch (type) {
    case 'string':
      return <Type className={iconClass} />
    case 'number':
      return <Hash className={iconClass} />
    case 'boolean':
      return <Circle className={iconClass} />
    case 'null':
      return <Circle className={cn(iconClass, 'opacity-40')} />
    default:
      return <Circle className={cn(iconClass, 'opacity-30')} />
  }
}
