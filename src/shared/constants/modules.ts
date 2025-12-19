import { GitBranch, Globe, RotateCw, ToolCase } from 'lucide-react'

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
      {
        label: 'Gist Explorer',
        href: '/gist-explorer',
        icon: GitBranch,
        description: 'Explore Gists do GitHub',
      },
      {
        label: 'Web Extractor',
        href: '/web-extractor',
        icon: Globe,
        description: 'Extraia conteúdo de sites e blogs para Markdown',
      },
    ],
  },
]
