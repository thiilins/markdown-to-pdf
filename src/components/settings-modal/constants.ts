import { Code, Eye, FileText, Maximize2, Palette, Settings, Type } from 'lucide-react'

const ALL_TABS = ['page', 'typography', 'theme', 'editor']
export const CONFIG_MODAL_SHOW_OPTIONS: Record<string, string[]> = {
  '/': ALL_TABS,
  '/md-to-pdf': ALL_TABS,
  '/gist-explorer': ['typography', 'theme'],
  '*': ALL_TABS,
}

const ALL_EDITOR = ['wordWrap', 'minimap', 'lineNumbers', 'theme']
export const CONFIG_EDITOR_SHOW_OPTIONS: Record<string, string[]> = {
  '/': ALL_EDITOR,
  '/md-to-pdf': ALL_EDITOR,
  '/gist-explorer': [],
  '*': ALL_EDITOR,
}
export const CONFIG_MODAL_COLORS = {
  page: {
    color: {
      icon: {
        from: 'from-blue-500 to-indigo-600',
        to: 'to-indigo-600',
      },
      text: 'text-blue-600',
    },
    description: 'Configurações de tamanho e orientação do documento e unidade de medida',
    title: 'Configurações Gerais',
    icon: FileText,
    value: 'page',
  },
  typography: {
    color: {
      icon: {
        from: 'from-violet-500 to-indigo-600',
        to: 'to-indigo-600',
      },
      text: 'text-violet-600',
    },
    description: 'Configurações de tipografia do documento',
    title: 'Tipografia',
    icon: Type,
    value: 'typography',
  },
  spacing: {
    color: {
      icon: {
        from: 'from-emerald-500 to-green-600',
        to: 'to-green-600',
      },
      text: 'text-green-600',
    },
    description: 'Configurações de espaçamento do documento',
    title: 'Espaçamento',
    icon: Maximize2,
    value: 'spacing',
  },
  theme: {
    color: {
      icon: {
        from: 'from-fuchsia-500 to-purple-600',
        to: 'to-purple-600',
      },
      text: 'text-purple-600',
    },
    description: 'Configurações de tema do documento',
    title: 'Tema',
    icon: Palette,
    value: 'theme',
  },
  editor: {
    color: {
      icon: {
        from: 'from-zinc-500',
        to: 'to-slate-600',
      },
      text: 'text-green-600',
    },
    description: 'Configurações de editor do documento',
    title: 'Editor',
    icon: Code,
    value: 'editor',
  },
  view: {
    color: {
      icon: {
        from: 'from-orange-500 to-yellow-600',
        to: 'to-yellow-600',
      },
      text: 'text-orange-600',
    },
    description: 'Ajuste a aparência do editor',
    title: 'Visualização',
    icon: Eye,
    value: 'view',
  },
  advanced: {
    color: {
      icon: {
        from: 'from-red-500 to-pink-600',
        to: 'to-pink-600',
      },
      text: 'text-red-600',
    },
    description: 'Recursos adicionais do editor',
    title: 'Opções Avançadas',
    icon: Settings,
    value: 'advanced',
  },
}
