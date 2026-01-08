import { Admonition } from '@/components/markdown-editor/admonition'
import { ReactNode } from 'react'

/**
 * Detecta se um blockquote é um Admonition (GitHub-style callout)
 * Formato: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
 */
export function parseAdmonition(children: ReactNode): {
  isAdmonition: boolean
  type?: 'note' | 'tip' | 'important' | 'warning' | 'caution'
  content?: ReactNode
} {
  // Converte children para string para análise
  const childrenArray = Array.isArray(children) ? children : [children]

  // Procura pelo primeiro parágrafo que pode conter o marcador [!TYPE]
  for (const child of childrenArray) {
    if (!child || typeof child !== 'object') continue

    // @ts-ignore - Acessa props do elemento React
    const childProps = child.props
    if (!childProps || !childProps.children) continue

    const firstChild = Array.isArray(childProps.children)
      ? childProps.children[0]
      : childProps.children

    if (typeof firstChild !== 'string') continue

    // Regex para detectar [!TYPE]
    const match = firstChild.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i)

    if (match) {
      const type = match[1].toLowerCase() as 'note' | 'tip' | 'important' | 'warning' | 'caution'

      // Remove o marcador [!TYPE] do conteúdo
      const contentWithoutMarker = firstChild.replace(
        /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i,
        '',
      )

      // Reconstrói o conteúdo sem o marcador
      const newChildren = Array.isArray(childProps.children)
        ? [contentWithoutMarker, ...childProps.children.slice(1)]
        : contentWithoutMarker

      return {
        isAdmonition: true,
        type,
        content: newChildren,
      }
    }
  }

  return { isAdmonition: false }
}

/**
 * Componente customizado para blockquote que detecta Admonitions
 */
export function BlockquoteWithAdmonition({ children, ...props }: any) {
  const parsed = parseAdmonition(children)

  if (parsed.isAdmonition && parsed.type) {
    return <Admonition type={parsed.type}>{parsed.content}</Admonition>
  }

  // Renderiza blockquote normal
  return <blockquote {...props}>{children}</blockquote>
}
