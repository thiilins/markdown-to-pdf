import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import { FileSpreadsheet, FileText, Upload } from 'lucide-react'
export function ExcelMdUploadInput({
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isDragging,
  fileInputRef,
  handleFileUpload,
}: {
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDragging: boolean
}) {
  return (
    <TabsContent value='upload' className='m-0 flex-1 overflow-hidden p-0'>
      <div
        className='relative flex h-full flex-col'
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        {/* Overlay de Drag & Drop */}
        {isDragging && (
          <div className='bg-background/95 border-primary absolute inset-0 z-50 flex items-center justify-center rounded-lg border-4 border-dashed backdrop-blur-md'>
            <div className='animate-in fade-in zoom-in pointer-events-none text-center duration-200'>
              <div className='bg-primary/20 mx-auto mb-4 w-fit animate-bounce rounded-full p-6 shadow-lg'>
                <Upload className='text-primary h-12 w-12' />
              </div>
              <h3 className='mb-2 text-2xl font-bold'>Solte o arquivo aqui</h3>
              <p className='text-muted-foreground text-sm'>Suporta Excel (.xlsx, .xls) e CSV</p>
              <div className='bg-primary/10 mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2'>
                <div className='bg-primary h-2 w-2 animate-pulse rounded-full' />
                <span className='text-xs font-medium'>Pronto para processar</span>
              </div>
            </div>
          </div>
        )}

        {/* Área de Upload */}
        <div className='flex flex-1 items-center justify-center p-8'>
          <div className='max-w-md text-center'>
            <div className='bg-muted/30 mx-auto mb-6 w-fit rounded-full p-8'>
              <FileSpreadsheet className='text-muted-foreground h-16 w-16' />
            </div>

            <h3 className='mb-2 text-xl font-bold'>Envie seu arquivo</h3>
            <p className='text-muted-foreground mb-6 text-sm'>
              Arraste e solte ou clique para selecionar
            </p>

            <input
              ref={fileInputRef}
              type='file'
              accept='.xlsx,.xls,.csv'
              onChange={handleFileUpload}
              className='hidden'
            />

            <Button size='lg' onClick={() => fileInputRef.current?.click()} className='gap-2'>
              <Upload className='h-5 w-5' />
              Selecionar Arquivo
            </Button>

            <div className='mt-6 space-y-2'>
              <p className='text-muted-foreground text-xs font-medium'>Formatos suportados:</p>
              <div className='flex justify-center gap-2'>
                <div className='bg-muted/50 flex items-center gap-1.5 rounded-full px-3 py-1'>
                  <FileSpreadsheet className='h-3 w-3' />
                  <span className='text-xs font-medium'>.xlsx</span>
                </div>
                <div className='bg-muted/50 flex items-center gap-1.5 rounded-full px-3 py-1'>
                  <FileSpreadsheet className='h-3 w-3' />
                  <span className='text-xs font-medium'>.xls</span>
                </div>
                <div className='bg-muted/50 flex items-center gap-1.5 rounded-full px-3 py-1'>
                  <FileText className='h-3 w-3' />
                  <span className='text-xs font-medium'>.csv</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
