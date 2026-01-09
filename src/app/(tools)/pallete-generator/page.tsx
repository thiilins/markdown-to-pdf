import { type Metadata } from 'next'
import { PalleteGeneratorViewComponent } from './_component/view'

export const metadata: Metadata = {
  title: 'Palette Studio & WCAG Checker | MD to PDF Pro',
  description:
    'Gere paletas de cores profissionais e valide acessibilidade WCAG 2.1. Extraia cores de imagens e exporte em múltiplos formatos.',
}

export default function PaletteGeneratorPage() {
  return <PalleteGeneratorViewComponent />
}
