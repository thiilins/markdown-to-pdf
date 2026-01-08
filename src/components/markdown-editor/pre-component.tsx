'use client'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'
import { mapLanguage } from '@/shared/utils'
import { Check, Copy, Terminal } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { toast } from 'sonner'

export const PreComponent = ({ node, children, ...props }: any) => {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  // Reset do ícone de cópia após 2 segundos
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const extractLanguageFromChildren = useCallback((children: any): string | null => {
    if (children?.props?.className) {
      const className = children.props.className
      const match = className.match(/language-(\w+)/)
      if (match) return match[1]
    }

    if (Array.isArray(children)) {
      for (const child of children) {
        if (child?.props?.className) {
          const className = child.props.className
          const match = className.match(/language-(\w+)/)
          if (match) return match[1]
        }
        if (child?.props?.children) {
          const lang = extractLanguageFromChildren(child.props.children)
          if (lang) return lang
        }
      }
    }
    return null
  }, [])

  const extractCodeText = useCallback((children: any): string => {
    if (typeof children === 'string') return children
    if (Array.isArray(children)) {
      return children
        .map((child: any) => {
          if (typeof child === 'string') return child
          if (child?.props?.children) return extractCodeText(child.props.children)
          return ''
        })
        .join('')
    }
    if (children?.props?.children) return extractCodeText(children.props.children)
    return ''
  }, [])

  const handleCopyCode = useCallback(
    async (children: any) => {
      try {
        const textToCopy = extractCodeText(children)
        if (!textToCopy) return

        await copy(textToCopy)
        setCopied(true)
        toast.success('Código copiado!')
      } catch (error) {
        toast.error('Erro ao copiar código')
      }
    },
    [copy, extractCodeText],
  )

  const codeText = extractCodeText(children)
  const language = extractLanguageFromChildren(children)

  // ESCAPE PARA MERMAID: Mantido conforme solicitado
  if (language === 'mermaid') {
    return (
      <pre
        {...props}
        className='mermaid-raw'
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          backgroundColor: 'transparent',
          margin: 0,
        }}>
        {children}
      </pre>
    )
  }

  return (
    <div className='group not-prose relative my-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl'>
      {/* Header do Código: Melhor contraste e tipografia */}
      <div className='flex items-center justify-between border-b border-white/5 bg-slate-900/50 px-4 py-2.5'>
        <div className='flex items-center gap-4'>
          {/* Traffic Lights Estilizados */}
          <div className='flex gap-2'>
            <div className='h-3 w-3 rounded-full bg-[#FF5F56] shadow-inner' />
            <div className='h-3 w-3 rounded-full bg-[#FFBD2E] shadow-inner' />
            <div className='h-3 w-3 rounded-full bg-[#27C93F] shadow-inner' />
          </div>

          <div className='flex items-center gap-2 border-l border-white/10 pl-4'>
            <Terminal className='h-3.5 w-3.5 text-slate-500' />
            {language && (
              <span className='font-mono text-[11px] font-bold tracking-widest text-indigo-400 uppercase'>
                {language}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleCopyCode(children)
          }}
          variant='ghost'
          size='sm'
          className={cn(
            'h-8 gap-2 rounded-lg px-3 text-[11px] font-bold transition-all print:hidden',
            copied
              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-white',
          )}>
          {copied ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
          <span>{copied ? 'Copiado' : 'Copiar'}</span>
        </Button>
      </div>

      {/* Área de Código com SyntaxHighlighter */}
      <div className='relative px-1'>
        <SyntaxHighlighter
          language={mapLanguage(language || 'text')}
          style={darcula}
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
          customStyle={{
            margin: 0,
            padding: '1.5rem 1.25rem',
            width: '100%',
            backgroundColor: 'transparent',
            fontSize: '13.5px',
            lineHeight: '1.7',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}>
          {codeText}
        </SyntaxHighlighter>

        {/* Efeito de brilho sutil no fundo */}
        <div className='pointer-events-none absolute inset-0 bg-linear-to-tr from-indigo-500/5 via-transparent to-transparent opacity-50' />
      </div>

      {/* Rodapé Decorativo (Opcional, mas mantém o estilo dos outros cards) */}
      <div className='flex h-1.5 w-full bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20' />
    </div>
  )
}
