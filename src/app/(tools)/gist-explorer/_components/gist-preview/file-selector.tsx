'use client'

import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { useGist } from '@/shared/contexts/gistContext'

export const FileSelector = () => {
  const { fileOptions: files, selectedFile, handleSelectFile } = useGist()
  const selectedFileData = files.find((f) => f.value === selectedFile?.filename)
  return (
    <div className='max-w-full'>
      <SelectWithFilterComponent
        className={{
          trigger: 'w-full',
          buttonTrigger: 'bg-background hover:bg-accent/50 w-full',
          content: 'w-full max-w-md',
          item: 'w-full',
        }}
        id='file-selector'
        placeholder='Selecione um arquivo...'
        data={files.map((f) => ({ value: f.value, label: f.label }))}
        value={selectedFileData?.value || ''}
        onChange={(value) => handleSelectFile(value)}
      />
    </div>
  )
}
