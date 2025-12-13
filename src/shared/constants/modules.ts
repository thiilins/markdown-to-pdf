import { RotateCw, ToolCase } from 'lucide-react'

export const Modules: ModuleItem[] = [
  {
    label: 'Tools',
    icon: ToolCase,
    submenu: [
      {
        label: 'MD to PDF',
        href: '/md-to-pdf',
        icon: RotateCw,
        description: 'Converta arquivos Markdown em PDFs',
      },
    ],
  },
]
