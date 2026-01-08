'use client'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-clipboard'
import { mapLanguage } from '@/shared/utils'
import { Copy } from 'lucide-react' // Adicionei Check para feedback visual
import { useCallback } from 'react' // Adicionado useState e useEffect
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { toast } from 'sonner'

export const PreComponent = ({ node, children, ...props }: any) => {
  const [, copy] = useCopyToClipboard()
  const extractLanguageFromChildren = useCallback((children: any): string | null => {
    // Se children é um objeto React (componente code)
    if (children?.props?.className) {
      const className = children.props.className
      const match = className.match(/language-(\w+)/)
      if (match) return match[1]
    }

    // Se children é um array, procura o primeiro elemento code
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child?.props?.className) {
          const className = child.props.className
          const match = className.match(/language-(\w+)/)
          if (match) return match[1]
        }
        // Recursão para elementos aninhados
        if (child?.props?.children) {
          const lang = extractLanguageFromChildren(child.props.children)
          if (lang) return lang
        }
      }
    }

    return null
  }, [])

  // IMPORTANTE: Detecta se é Mermaid e deixa passar (não renderiza como código)
  const extractCodeText = useCallback((children: any): string => {
    if (typeof children === 'string') {
      return children
    }

    if (Array.isArray(children)) {
      return children
        .map((child: any) => {
          if (typeof child === 'string') return child
          if (child?.props?.children) return extractCodeText(child.props.children)
          return ''
        })
        .join('')
    }

    if (children?.props?.children) {
      return extractCodeText(children.props.children)
    }

    return ''
  }, [])

  const handleCopyCode = useCallback(
    async (children: any) => {
      try {
        const textToCopy = extractCodeText(children)

        if (!textToCopy) {
          console.warn('Estrutura de código complexa, tentando extração forçada.')
          return
        }

        await copy(textToCopy)
        toast.success('Código copiado!')
      } catch (error) {
        console.error('Erro ao copiar', error)
        toast.error('Erro ao copiar código')
      }
    },
    [copy, extractCodeText],
  )

  const codeText = extractCodeText(children)
  const language = extractLanguageFromChildren(children)
  if (language === 'mermaid') {
    // Retorna um pre simples para o Mermaid processar
    return (
      <pre {...props} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {children}
      </pre>
    )
  }

  return (
    <div className='group not-prose relative my-6 overflow-hidden rounded-lg border bg-zinc-950 shadow-sm dark:bg-zinc-900'>
      {/* Header do Código */}
      <div className='flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2'>
        <div className='flex items-center gap-3'>
          <div className='flex gap-1.5'>
            <div className='h-2.5 w-2.5 rounded-full bg-red-500/80' />
            <div className='h-2.5 w-2.5 rounded-full bg-yellow-500/80' />
            <div className='h-2.5 w-2.5 rounded-full bg-green-500/80' />
          </div>
          {language && (
            <span className='font-mono text-[10px] font-medium tracking-wider text-white uppercase opacity-60'>
              {language}
            </span>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleCopyCode(children)
          }}
          className='flex items-center gap-1.5 rounded-md bg-transparent px-2 py-1 text-[10px] font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white'
          title='Copiar código'>
          <Copy className='h-3 w-3' />
          <span>Copiar</span>
        </Button>
      </div>

      <SyntaxHighlighter
        language={mapLanguage(language || 'text')}
        style={darcula}
        showLineNumbers={false}
        wrapLines={true}
        wrapLongLines={true}
        customStyle={{
          margin: 0,
          padding: '2rem',
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          fontSize: '13px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}>
        {codeText}
      </SyntaxHighlighter>
    </div>
  )
}
