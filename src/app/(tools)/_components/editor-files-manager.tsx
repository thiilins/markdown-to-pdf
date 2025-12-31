'use client'

import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { useMemo } from 'react'

export function FilesManager() {
  const { list, markdown, onSelectMarkdown, onAddMarkdown } = useMarkdown()
  const fileOptions = useMemo(() => {
    return list.map((file) => ({
      value: file.id,
      label: file.name,
    }))
  }, [list])

  return (
    <>
      <SelectWithFilterComponent
        className={{
          trigger: 'mr-2 h-8 max-w-[300px]!',
          buttonTrigger: 'bg-background hover:bg-accent/50 max-w-[320px]',
          content: 'w-full max-w-md',
          item: 'w-full',
        }}
        id='file-selector'
        placeholder='Selecione um arquivo...'
        data={fileOptions}
        value={markdown?.id || ''}
        onChange={(value) => onSelectMarkdown(value)}
      />
    </>
  )
}
