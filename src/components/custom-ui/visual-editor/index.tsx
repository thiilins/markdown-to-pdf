'use client'

import { ConditionalRender } from '../conditional-render'
// Extensões TipTap

import { VisualEditorProvider, useVisualEditor } from './VisualEditorContext'
import { HtmlEditor, VisualEditor, VisualEditorStructure } from './editors'

export const VisualEditorComponent = ({
  className,
  editorClassName,
}: {
  className?: string
  editorClassName?: string
}) => {
  const { viewMode, editor } = useVisualEditor()
  return (
    <ConditionalRender condition={!!editor}>
      <VisualEditorStructure editor={editor!} className={className}>
        <ConditionalRender condition={viewMode === 'visual'}>
          <VisualEditor editor={editor!} viewMode={viewMode} editorClassName={editorClassName} />
        </ConditionalRender>
        <ConditionalRender condition={viewMode === 'html'}>
          <HtmlEditor editor={editor!} viewMode={viewMode} />
        </ConditionalRender>
      </VisualEditorStructure>
    </ConditionalRender>
  )
}

export const VisualEditorComponentWithProvider = ({
  className,
  ...props
}: VisualEditorComponentProps) => {
  return (
    <VisualEditorProvider {...props}>
      <VisualEditorComponent className={className} />
    </VisualEditorProvider>
  )
}
