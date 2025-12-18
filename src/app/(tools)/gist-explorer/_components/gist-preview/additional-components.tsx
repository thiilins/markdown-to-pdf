import { Skeleton } from '@/components/ui/skeleton'
import { FileCode } from 'lucide-react'
export const LoadingPreviewComponent = () => {
  return (
    <div className='bg-muted/10 flex flex-1 items-center justify-center'>
      <div className='w-full max-w-2xl space-y-4 p-8'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-64 w-full' />
      </div>
    </div>
  )
}
export const NoGistSelectedComponent = () => {
  return (
    <div className='bg-muted/10 flex h-full! min-h-[calc(100vh-3rem)] flex-1 items-center justify-center'>
      <div className='text-muted-foreground text-center'>
        <FileCode className='mx-auto mb-4 h-16 w-16 opacity-20' />
        <p className='font-medium'>Selecione um Gist para visualizar</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Escolha um Gist da lista ao lado para ver seu conteúdo
        </p>
      </div>
    </div>
  )
}
