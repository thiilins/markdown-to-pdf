import type { Metadata } from 'next'
import { ExcelMdViewComponent } from './_component/view'

export const metadata: Metadata = {
  title: 'Excel/CSV to Markdown - Gerador de Tabelas | SuperTOOLS',
  description:
    'Converta planilhas Excel, arquivos CSV ou arrays JSON em tabelas Markdown formatadas. Suporte a upload de arquivos e conversão instantânea com preview em tempo real.',
  keywords: [
    'excel to markdown',
    'csv to markdown',
    'json to markdown',
    'table generator',
    'markdown table',
    'excel converter',
    'csv parser',
    'planilha markdown',
    'gerador de tabelas',
  ],
}

export default function ExcelMdPage() {
  return <ExcelMdViewComponent />
}
