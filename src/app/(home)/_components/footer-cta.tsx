'use client'

import { Button } from '@/components/ui/button'
import { SectionWrapper } from './global'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

export const FooterCtaComponent = () => (
  <SectionWrapper
    id='footer-cta'
    className='relative overflow-hidden bg-slate-950 py-32 text-center'>
    <div className='absolute inset-0 bg-[url(/grid.svg)] opacity-10' />
    <div className='absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[120px]' />

    <div className='relative z-10 container px-4'>
      <h2 className='mb-6 text-4xl font-black text-white md:text-6xl'>Pronto para Otimizar?</h2>
      <p className='mx-auto mb-10 max-w-2xl text-xl text-slate-400'>
        Junte-se a desenvolvedores que usam nossa suíte para acelerar fluxos complexos.
      </p>

      <div className='flex flex-wrap justify-center gap-4'>
        <Button
          onClick={() => scrollToSection('tools')}
          className='h-14 rounded-full bg-white px-8 text-base font-bold text-black transition-colors hover:bg-slate-200'>
          Começar Agora
        </Button>
        {/* <Button
          asChild
          variant='outline'
          className='h-14 rounded-full border-white/20 bg-transparent px-8 text-base text-white hover:bg-white/10'>
          <Link href='https://github.com/thiilins/markdown-to-pdf' target='_blank'>
            GitHub
          </Link>
        </Button> */}
      </div>

      <div className='mt-20 border-t border-white/10 pt-10 text-sm text-slate-500'>
        <p>&copy; {new Date().getFullYear()} MD Tools Suite. Built specifically for Builders.</p>
      </div>
    </div>
  </SectionWrapper>
)
