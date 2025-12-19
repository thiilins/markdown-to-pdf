'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface PreviewPanelProps {
  markdown: string
  className?: string
}

export function PreviewPanel({ markdown, className }: PreviewPanelProps) {
  return (
    <div className={cn('flex h-full flex-col overflow-hidden', className)}>
      <ScrollArea className='h-full w-full flex-1 overflow-y-auto'>
        <div className='p-6'>
          <div className='prose prose-slate dark:prose-invert mx-auto max-w-4xl'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }: any) => {
                  return (
                    <img
                      {...props}
                      className='my-4 rounded-lg border shadow-sm'
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                      alt={props.alt || ''}
                      loading='lazy'
                      onError={(e: any) => {
                        // Se a imagem falhar ao carregar, esconde ou mostra placeholder
                        e.target.style.display = 'none'
                      }}
                    />
                  )
                },
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={darcula as any}
                      language={match[1]}
                      PreTag='div'
                      customStyle={{
                        margin: '1rem 0',
                        padding: '1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                      }}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={cn('bg-muted rounded px-1.5 py-0.5 text-sm', className)}
                      {...props}>
                      {children}
                    </code>
                  )
                },
                p: ({ node, ...props }: any) => <p className='mb-4 leading-7' {...props} />,
                h1: ({ node, ...props }: any) => (
                  <h1 className='mt-6 mb-4 text-3xl leading-tight font-bold' {...props} />
                ),
                h2: ({ node, ...props }: any) => (
                  <h2 className='mt-5 mb-3 text-2xl leading-tight font-semibold' {...props} />
                ),
                h3: ({ node, ...props }: any) => (
                  <h3 className='mt-4 mb-2 text-xl font-semibold' {...props} />
                ),
                ul: ({ node, ...props }: any) => (
                  <ul className='mb-4 ml-6 list-disc space-y-2' {...props} />
                ),
                ol: ({ node, ...props }: any) => (
                  <ol className='mb-4 ml-6 list-decimal space-y-2' {...props} />
                ),
                blockquote: ({ node, ...props }: any) => (
                  <blockquote
                    className='border-primary/50 bg-muted/50 my-4 border-l-4 pl-4 italic'
                    {...props}
                  />
                ),
              }}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
