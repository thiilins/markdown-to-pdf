import { Metadata } from 'next'
import { ChangelogView } from './_component/view'

export const metadata: Metadata = {
  title: 'Changelog | SuperTOOLS',
  description: 'Histórico completo de versões e atualizações do SuperTOOLS',
}

export default function ChangelogPage() {
  return <ChangelogView />
}
