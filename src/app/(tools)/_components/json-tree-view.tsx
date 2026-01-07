'use client'

import { ChevronRight, Copy, FileJson } from 'lucide-react'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { safeJsonParse } from '@/lib/security-utils'
import { formatJsonPath } from './json-path-utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const treeData = useMemo(() => {
    if (!jsonText.trim()) return null

    const parseResult = safeJsonParse(jsonText)
    if (!parseResult.success || !parseResult.data) {
      return null
    }

    return buildTree(parseResult.data, [])
  }, [jsonText])

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
      <div className='flex h-full items-center justify-center p-8'>
        <div className='text-center'>
          <FileJson className='text-muted-foreground mx-auto mb-2 h-12 w-12' />
          <p className='text-muted-foreground text-sm'>JSON inválido ou vazio</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full overflow-auto p-4'>
      <div className='space-y-1'>
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

  return (
    <div className='select-none'>
      <div
        className={cn(
          'group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50',
          level > 0 && 'ml-4',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}>
        {/* Ícone de expansão */}
        {canExpand ? (
          <button
            onClick={handleToggle}
            className='text-muted-foreground hover:text-foreground flex h-5 w-5 items-center justify-center rounded transition-colors'>
            <ChevronRight
              className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-90')}
            />
          </button>
        ) : (
          <div className='w-5' />
        )}

        {/* Chave */}
        {node.key !== null && (
          <span className='text-primary font-mono text-sm font-semibold'>
            {typeof node.key === 'number' ? `[${node.key}]` : node.key}:
          </span>
        )}

        {/* Valor */}
        <span className={cn('font-mono text-sm', getValueColorClass(node.type))}>
          {renderValue(node.value, node.type)}
        </span>

        {/* Tipo badge */}
        <span className='text-muted-foreground ml-auto text-xs'>{node.type}</span>

        {/* Botão de copiar path */}
        {node.path.length > 0 && (
          <Button
            variant='ghost'
            size='icon'
            className='opacity-0 h-6 w-6 group-hover:opacity-100 transition-opacity'
            onClick={handleCopy}
            title={`Copiar JSON Path: ${pathString}`}>
            <Copy className='h-3 w-3' />
          </Button>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className='ml-2 border-l border-muted/30'>
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
    node.children = Object.entries(data).map(([key, value]) =>
      buildTree(value, [...path, key]),
    )
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
              <span className='cursor-pointer underline decoration-dotted hover:text-primary'>
                {displayValue}
              </span>
            </PopoverTrigger>
            <PopoverContent className='w-80 p-2' align='start'>
              <img
                src={stringValue}
                alt='Preview'
                className='w-full rounded border'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <p className='text-muted-foreground mt-2 text-xs break-all'>{stringValue}</p>
            </PopoverContent>
          </Popover>
        )
      }
      return displayValue
    case 'number':
      return String(value)
    case 'boolean':
      return String(value)
    case 'null':
      return 'null'
    case 'object':
      return `{${Object.keys(value).length} propriedade(s)}`
    case 'array':
      return `[${value.length} item(s)]`
    default:
      return String(value)
  }
}

function getValueColorClass(type: JsonTreeNode['type']): string {
  switch (type) {
    case 'string':
      return 'text-green-600 dark:text-green-400'
    case 'number':
      return 'text-blue-600 dark:text-blue-400'
    case 'boolean':
      return 'text-purple-600 dark:text-purple-400'
    case 'null':
      return 'text-gray-500 dark:text-gray-400'
    case 'object':
      return 'text-orange-600 dark:text-orange-400'
    case 'array':
      return 'text-pink-600 dark:text-pink-400'
    default:
      return ''
  }
}

