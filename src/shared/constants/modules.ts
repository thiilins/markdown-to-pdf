import { GitBranch, Globe, PencilRuler, RotateCw, ToolCase } from 'lucide-react'
import { TbPhotoCode } from 'react-icons/tb'

export const Modules: ModuleItem[] = [
  {
    label: 'MD Editor',
    href: '/md-editor',
    icon: PencilRuler,
    description: 'Editor de Markdown',
  },
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
  {
    label: 'Code Snapshot',
    href: '/code-snapshot',
    icon: TbPhotoCode,
    description: 'Crie snapshots de código',
  },
]
export const Modules_Front: ModuleItem[] = [
  {
    label: 'Tools',
    icon: ToolCase,
    submenu: [
      {
        label: 'MD Editor',
        href: '/md-editor',
        icon: PencilRuler,
        description: 'Editor de Markdown',
      },
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
      {
        label: 'Code Snapshot',
        href: '/code-snapshot',
        icon: TbPhotoCode,
        description: 'Crie snapshots de código',
      },
    ],
  },
]
