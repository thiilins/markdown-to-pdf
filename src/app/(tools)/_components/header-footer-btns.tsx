import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { BrushCleaning } from 'lucide-react'
import { HeaderFooterButton } from '../md-to-pdf/_components/header-footer-modal'

export const HeaderFooterBtns = () => {
  const { onResetHeaderFooter } = useHeaderFooter()
  return (
    <div className='bg-primary/10 flex items-center gap-1 rounded-md p-1'>
      <IconButtonTooltip
        key='reset-header-footer'
        onClick={onResetHeaderFooter}
        content='Resetar Cabeçalho e Rodapé'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
        icon={BrushCleaning}
      />
      <HeaderFooterButton key='header-footer' />
    </div>
  )
}
