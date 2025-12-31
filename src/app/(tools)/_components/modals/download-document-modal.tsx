'use client'

import { SwitchComponent } from '@/components/custom-ui/switch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { CloudDownload, FileDown, FileText } from 'lucide-react'
import { useState } from 'react'
import { FaDownload, FaFilePdf, FaMarkdown } from 'react-icons/fa'

export function DownloadDocumentModal() {
  const { openDownloadDocument, setOpenDownloadDocument, onDownloadPackageMD, onDownloadOriginal } =
    useMarkdown()
  const { onDownloadPDF, disabledDownload } = useApp()
  const [all, setAll] = useState(false)

  return (
    <Dialog open={openDownloadDocument} onOpenChange={setOpenDownloadDocument}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[440px]'>
        {/* Header com destaque visual sutil */}
        <div className='bg-muted/50 flex flex-col items-center justify-center border-b pt-8 pb-6'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <CloudDownload className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6 text-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>
              Exportar Documento
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Selecione o formato de saída para o seu arquivo.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='p-6'>
          <Tabs defaultValue='others' className='w-full'>
            <TabsList className='mb-6 grid w-full grid-cols-2'>
              <TabsTrigger value='others' className='gap-2'>
                <FileText className='h-4 w-4' /> Outros
              </TabsTrigger>
              <TabsTrigger value='markdown' className='gap-2'>
                <FaMarkdown className='h-4 w-4' /> Markdown
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo para Outros Formatos */}
            <TabsContent value='others' className='mt-0 space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <Button
                  variant='outline'
                  onClick={() => onDownloadOriginal()}
                  className='hover:border-primary hover:bg-primary/5 flex h-24 flex-col gap-2 border-2 transition-all'>
                  <FileDown className='text-muted-foreground h-6 w-6' />
                  <span className='font-semibold'>Original</span>
                </Button>

                <Button
                  variant='outline'
                  onClick={() => onDownloadPDF()}
                  disabled={disabledDownload}
                  className='flex h-24 flex-col gap-2 border-2 transition-all hover:border-red-500 hover:bg-red-50 disabled:opacity-50'>
                  <FaFilePdf className='text-muted-foreground h-6 w-6' />
                  <span className='font-semibold'>PDF</span>
                </Button>
              </div>
            </TabsContent>

            {/* Conteúdo para Markdown */}
            <TabsContent value='markdown' className='mt-0 space-y-4'>
              <div className='bg-muted/30 space-y-4 rounded-xl border p-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <span className='text-sm font-medium'>Escopo do Download</span>
                    <p className='text-muted-foreground text-[10px]'>
                      {all ? 'Todos os documentos' : 'Apenas o documento atual'}
                    </p>
                  </div>
                  <SwitchComponent
                    id='current'
                    checked={all}
                    onChange={(checked) => setAll(checked)}
                    label={all ? 'Todos os documentos' : 'Apenas o documento atual'}
                  />
                </div>

                <Button
                  className='h-11 w-full gap-2 font-bold'
                  onClick={() => onDownloadPackageMD(all)}>
                  <FaDownload className='h-4 w-4' />
                  Baixar Pacote .md
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className='bg-muted/50 border-t p-4 px-6'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full sm:w-auto'
            onClick={() => setOpenDownloadDocument(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
