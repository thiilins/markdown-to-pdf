'use client'

import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { useGist } from '@/shared/contexts/gistContext'

export const FileSelector = () => {
  const { fileOptions: files, selectedFile, handleSelectFile } = useGist()
  const selectedFileData = files.find((f) => f.value === selectedFile?.filename)
  return (
    <div className='w-full'>
      <SelectWithFilterComponent
        className={{
          trigger: 'w-[300px]',
          buttonTrigger: 'w-[300px]',
          content: 'w-[300px]',
          item: 'w-[300px]',
        }}
        id='file-selector'
        data={files.map((f) => ({ value: f.value, label: f.label }))}
        value={selectedFileData?.value || ''}
        onChange={(value) => handleSelectFile(value)}
      />
    </div>
  )
}
