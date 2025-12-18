import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { processGistForImport } from '@/shared/utils'
import { ChevronDown, FileCode2, Files, Github, MessageSquareReply } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileSelector } from './file-selector'
import { getIcon } from './icons'

export const GistPreviewHeader = () => {
  const { selectedFile } = useGist()
  if (!selectedFile) return null
  const Icon = getIcon(selectedFile?.language || '')

  return (
    <div className='bg-muted/30 flex items-center justify-between border-b p-4'>
      <div className='flex items-center gap-3 overflow-hidden'>
        <div className='bg-background/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm'>
          <Icon className='text-primary h-6 w-6' />
        </div>
        <div className='flex flex-col overflow-hidden'>
          <h2 className='truncate text-sm leading-none font-semibold'>
            {selectedFile?.filename || 'Sem nome'}
          </h2>
          {selectedFile?.description && (
            <p className='text-muted-foreground mt-1 truncate text-xs'>
              {selectedFile?.description}
            </p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2 pl-4'>
        <FileSelector />
        <ViewOnGitHubButton />
        <ActionButtons />
      </div>
    </div>
  )
}

export const ViewOnGitHubButton = () => {
  const { selectedFile } = useGist()
  if (!selectedFile?.html_url) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline' size='icon' asChild className='h-9 w-9 shrink-0'>
          <Link href={selectedFile.html_url} target='_blank' rel='noopener noreferrer'>
            <Github className='h-4 w-4' />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Ver no GitHub</TooltipContent>
    </Tooltip>
  )
}

export const ActionButtons = () => {
  const { selectedGist, selectedFile, fileContents } = useGist()
  const { setMarkdown } = useMDToPdf()
  const router = useRouter()

  const handleMergeImport = () => {
    if (!selectedGist) return
    // Feature 3.3: Merge & Import
    const fullContent = processGistForImport(selectedGist, fileContents)
    setMarkdown(fullContent)
    router.push('/md-to-pdf')
  }

  const handleSingleFileImport = () => {
    if (!selectedFile) return
    const content = fileContents[selectedFile.filename]
    if (!content) return

    // Feature 3.4: Fork to Editor (Edição rápida sem headers extras)
    setMarkdown(content)
    router.push('/md-to-pdf')
  }

  const isMultiFile = (selectedGist?.files.length || 0) > 1

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='h-9 gap-2 px-3'>
          <MessageSquareReply className='h-4 w-4' />
          <span className='hidden sm:inline'>Importar</span>
          <ChevronDown className='h-3 w-3 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem onClick={handleSingleFileImport}>
          <FileCode2 className='mr-2 h-4 w-4' />
          <div className='flex flex-col'>
            <span>Editar este arquivo</span>
            <span className='text-muted-foreground text-[10px]'>Importa conteúdo cru (Raw)</span>
          </div>
        </DropdownMenuItem>

        {isMultiFile && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMergeImport}>
              <Files className='mr-2 h-4 w-4' />
              <div className='flex flex-col'>
                <span>Mesclar todos arquivos</span>
                <span className='text-muted-foreground text-[10px]'>Junta tudo em um Markdown</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
