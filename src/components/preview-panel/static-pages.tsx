'use client'

import { useCopyToClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { PreviewStyle } from '@/shared/styles/preview-styles'
import { Copy } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
interface StaticStylePreviewProps {
  markdown: string
  typographyConfig: TypographyConfig
  themeConfig?: ThemeConfig
  className?: string
  contentRef: React.RefObject<HTMLDivElement | null>
}

export function StaticPreview({
  markdown,
  typographyConfig,
  themeConfig,
  className,
  contentRef,
}: StaticStylePreviewProps) {
  const theme = themeConfig || THEME_PRESETS.modern
  const [, copy] = useCopyToClipboard()
  const getTypographyStyles = useMemo(() => {
    return {
      '--font-headings': typographyConfig.headings,
      '--font-body': typographyConfig.body,
      '--font-code': typographyConfig.code,
      '--font-quote': typographyConfig.quote,
      '--base-size': `${typographyConfig.baseSize}px`,
      '--h1-size': `${typographyConfig.h1Size}px`,
      '--h2-size': `${typographyConfig.h2Size}px`,
      '--h3-size': `${typographyConfig.h3Size}px`,
      '--line-height': String(typographyConfig.lineHeight),
    } as React.CSSProperties
  }, [typographyConfig])

  const handleCopyCode = useCallback(
    async (text: any) => {
      const textToCopy = text?.props?.children || 'Não foi possível copiar o código'
      await copy(textToCopy)
      console.log('copied', textToCopy)
      toast.success('Copiado para a área de transferência')
    },
    [copy],
  )
  const markdownComponents: Components = useMemo(
    () => ({
      div: ({ node, className, children, ...props }) => {
        if (className === 'page-break') {
          return <div className='page-break' {...props} />
        }
        return (
          <div className={className} {...props}>
            {children}
          </div>
        )
      },
      pre: ({ node, children, ...props }) => {
        return (
          <pre {...props} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            <div className='flex h-5 w-full items-center justify-end'>
              <div
                id='copy-code-button'
                className='bg-muted mt-2 cursor-pointer rounded-[5px] p-2'
                onClick={() => handleCopyCode(children as string)}>
                <Copy className='text-muted-foreground h-4 w-4' />
              </div>
            </div>
            {children}
          </pre>
        )
      },
      code: ({ node, className, children, ...props }: any) => {
        const isInline = !className || !className.includes('language-')
        if (isInline) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
        return (
          <code
            className={className}
            {...props}
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {children}
          </code>
        )
      },
    }),
    [handleCopyCode],
  )

  return (
    <div
      className={cn(
        'bg-background dark:bg-background relative h-full w-full rounded-md',
        className,
      )}
      style={{ backgroundColor: theme.background }}>
      <div className='custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8'>
        <div
          className='mx-auto max-w-4xl rounded-lg border shadow-sm transition-colors duration-200'
          style={{
            backgroundColor: theme.background,
            borderColor: theme.borderColor,
            ...getTypographyStyles,
          }}>
          <div
            className='rounded-md bg-white p-8 text-left shadow-2xl md:p-12'
            style={{
              backgroundColor: theme.background,
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(0 0 0 / 0.05)',
            }}>
            <div
              className='prose prose-slate max-w-none'
              style={{
                ...getTypographyStyles,
              }}>
              <PreviewStyle theme={theme} />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
