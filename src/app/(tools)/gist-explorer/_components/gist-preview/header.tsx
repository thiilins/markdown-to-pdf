import { Button } from '@/components/ui/button'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { processGistForImport } from '@/shared/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IoLogoGithub } from 'react-icons/io5'
import { FileSelector } from './file-selector'
export const GistPreviewHeader = () => {
  const { selectedFile } = useGist()
  if (!selectedFile) return null
  return (
    <div className='bg-muted/30 flex items-center justify-between p-4'>
      <div className='flex flex-col items-start gap-1'>
        <h2 className='truncate text-lg font-semibold'>
          {selectedFile?.filename || 'Gist sem nome'}
        </h2>
        {selectedFile?.description && (
          <p className='text-muted-foreground px-1 text-[12px] leading-relaxed'>
            {selectedFile?.description}
          </p>
        )}
      </div>
      <div className='flex max-w-full items-center gap-2'>
        <FileSelector /> <ViewOnGitHubButton />
      </div>
    </div>
  )
}

export const ViewOnGitHubButton = () => {
  const { selectedFile } = useGist()
  return (
    <Button variant='outline' asChild className='flex items-center gap-2 shadow-none'>
      <Link href={selectedFile?.html_url || ''} target='_blank' rel='noopener noreferrer'>
        <IoLogoGithub className='h-8 w-8' /> <span className='text-[9px]'>Ver no GitHub</span>
      </Link>
    </Button>
  )
}
export const ImportButton = () => {
  const { selectedGist, fileContents } = useGist()
  const { setMarkdown } = useMDToPdf()
  const router = useRouter()

  const handleImport = () => {
    if (!selectedGist) return
    const fullContent = processGistForImport(selectedGist, fileContents)
    setMarkdown(fullContent as string)
    router.push('/md-to-pdf')
  }

  return <Button onClick={handleImport}>Importar e Converter</Button>
}
