import { Metadata } from 'next'
import { CronToolsViewComponent } from './_components/view'

export const metadata: Metadata = {
  title: 'Cron Expression Visualizer | SuperTools',
  description:
    'Valide, visualize e entenda expressões cron em português. Veja as próximas execuções e descrições em linguagem natural.',
}

export default function CronToolsPage() {
  return <CronToolsViewComponent />
}
