'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { ArrowDownFromLine, ArrowUpFromLine, FileText } from 'lucide-react'
import { useState } from 'react'
import { SlotConfigForm } from './helpers'

export const HeaderFooterModal = () => {
  const [selectedSlot, setSelectedSlot] = useState<'header' | 'footer'>('header')
  const { modalOpen, handleOpenModal, handleCloseModal } = useHeaderFooter()

  const handleOpenChange = (open: boolean, save?: boolean) => {
    if (open) {
      handleOpenModal()
    } else {
      handleCloseModal(save)
    }
  }
  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='flex h-[90vh] max-w-[1240px] min-w-[70dvw] flex-col overflow-hidden p-0'>
        <Tabs value={selectedSlot} className='flex flex-1 flex-col overflow-hidden'>
          <div className='flex w-full items-center justify-between p-6 pb-2'>
            <DialogTitle className='flex items-center justify-center'>
              <header className='flex items-center justify-center'>
                <FileText className='text-primary h-14 w-14' />
                <div className='flex flex-col'>
                  <h3 className='text-primary flex items-center gap-2 text-xl font-bold sm:text-3xl'>
                    Estética do PDF
                  </h3>
                  <span className='text-[13px] text-wrap sm:text-sm'>
                    Ajuste como as informações se repetem no topo e no rodapé do seu arquivo.
                  </span>
                </div>
              </header>
            </DialogTitle>
            <div className='bg-primary/20 grid items-end gap-2 rounded-md p-2'>
              <div className='flex items-center gap-1'>
                <IconButtonTooltip
                  onClick={() => setSelectedSlot('header')}
                  content='Cabeçalho'
                  className={{
                    button: cn(
                      'border-primary flex h-8 w-10 cursor-pointer items-center justify-center border',
                      selectedSlot === 'header'
                        ? 'bg-primary hover:bg-primary text-white hover:text-white'
                        : 'hover:text-primary text-primary bg-white hover:bg-white',
                    ),
                  }}
                  icon={ArrowUpFromLine}
                />
                <IconButtonTooltip
                  onClick={() => setSelectedSlot('footer')}
                  content='Rodapé'
                  className={{
                    button: cn(
                      'border-primary flex h-8 w-10 cursor-pointer items-center justify-center border',
                      selectedSlot === 'footer'
                        ? 'bg-primary hover:bg-primary text-white hover:text-white'
                        : 'hover:text-primary text-primary bg-white hover:bg-white',
                    ),
                  }}
                  icon={ArrowDownFromLine}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className='scrollbar-thin flex-1 overflow-y-auto p-6'>
            <TabsContent value='header' className='mt-0'>
              <SlotConfigForm slotType='header' />
            </TabsContent>

            <TabsContent value='footer' className='mt-0'>
              <SlotConfigForm slotType='footer' />
            </TabsContent>
          </div>
        </Tabs>

        <div className='bg-muted/20 flex justify-end gap-3 border-t p-4'>
          <Button variant='outline' onClick={() => handleCloseModal(false)}>
            Fechar sem Salvar
          </Button>
          <Button onClick={() => handleCloseModal(true)}>Aplicar Configurações</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const HeaderFooterButton = () => {
  const { handleOpenModal } = useHeaderFooter()

  return (
    <>
      <IconButtonTooltip
        onClick={handleOpenModal}
        content='Cabeçalho e Rodapé'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
        icon={FileText}
      />
      <HeaderFooterModal />
    </>
  )
}
