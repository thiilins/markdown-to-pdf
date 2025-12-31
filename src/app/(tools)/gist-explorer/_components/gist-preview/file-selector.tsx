'use client'

import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { getIcon } from '@/shared/constants/file-icons' // Assumindo que essa função existe baseada no contexto anterior
import { useGist } from '@/shared/contexts/gistContext'
import { FileCode2 } from 'lucide-react'

export const FileSelector = () => {
  const { fileOptions: files, selectedFile, handleSelectFile } = useGist()

  // Mapeia os dados para incluir o ícone correto
  const mappedData = files.map((f) => {
    // Tenta pegar a extensão ou linguagem para definir o ícone
    // Se f.language não estiver disponível no fileOptions, você pode precisar ajustar a origem
    // ou inferir pela extensão do f.label (ex: .js, .md)
    const icon = getIcon(f.label.split('.').pop() || 'text') || FileCode2

    return {
      value: f.value,
      label: f.label,
      icon: icon,
    }
  })

  return (
    <div className='w-full max-w-sm min-w-[200px]'>
      <SelectWithFilterComponent
        id='file-selector'
        placeholder='Selecione um arquivo...'
        emptyMessage='Arquivo não encontrado.'
        data={mappedData}
        value={selectedFile?.filename || ''}
        onChange={(value) => handleSelectFile(value)}
        className={{
          buttonTrigger:
            'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 border-dashed transition-colors',
          content: 'w-[350px]',
        }}
      />
    </div>
  )
}
