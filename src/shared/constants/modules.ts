import {
  Binary,
  Braces,
  Camera,
  Clock,
  Code2,
  Database,
  FileCode,
  FileDigit,
  FileDown,
  FileEdit,
  FileJson,
  FileText,
  FileType,
  GitBranch,
  GitCompare,
  Globe,
  KeyRound,
  LockKeyhole,
  Palette,
  ScanText,
  ShieldCheck,
  Wand2,
} from 'lucide-react'
import { SiOpenapiinitiative } from 'react-icons/si'

// ----------------------------------------------------------------------
// 1. MODULES FRONT (Landing Page / Cards)
// Organizado por categorias lógicas para facilitar a navegação visual
// ----------------------------------------------------------------------

export const Modules_Front: ModuleItem[] = [
  {
    label: 'Markdown & Documentação',
    icon: FileEdit,
    description: 'Utilitários para escrita e documentação técnica',
    submenu: [
      {
        label: 'MD Editor',
        href: '/md-editor',
        icon: FileEdit,
        description: 'Editor Markdown com visualização em tempo real',
      },
      {
        label: 'MD to PDF',
        href: '/md-to-pdf',
        icon: FileDown,
        description: 'Exporte documentação Markdown para PDF',
      },
      {
        label: 'MD to HTML',
        href: '/md-to-html',
        icon: FileType,
        description: 'Converta Markdown para HTML puro',
      },
      {
        label: 'Web Extractor',
        href: '/web-extractor',
        icon: Globe,
        description: 'Extraia artigos de sites',
      },
      {
        label: 'OpenAPI to MD',
        href: '/open-api-md',
        icon: SiOpenapiinitiative,
        description: 'Converta especificações OpenAPI/Swagger em documentação Markdown',
      },
    ],
  },
  {
    label: 'Formatadores de Código',
    icon: Braces,
    description: 'Ferramentas para padronizar e limpar seu código',
    submenu: [
      {
        label: 'JSON Formatter',
        href: '/json-formatter',
        icon: FileJson,
        description: 'Valide, visualize e formate objetos JSON',
      },
      {
        label: 'SQL Formatter',
        href: '/sql-formatter',
        icon: Database,
        description: 'Beautifier para consultas SQL complexas',
      },
      {
        label: 'HTML Formatter',
        href: '/html-formatter',
        icon: FileCode,
        description: 'Indente e organize código HTML',
      },
      {
        label: 'CSS Formatter',
        href: '/css-formatter',
        icon: Palette,
        description: 'Organize folhas de estilo CSS',
      },
      {
        label: 'JS Formatter',
        href: '/javascript-formatter',
        icon: Code2,
        description: 'Formate e verifique sintaxe JavaScript',
      },
    ],
  },

  {
    label: 'Conversores & Utilitários',
    icon: Wand2,
    description: 'Ferramentas de transformação e análise de dados',
    submenu: [
      {
        label: 'JSON to TS',
        href: '/json-to-ts',
        icon: FileDigit,
        description: 'Gere interfaces TypeScript a partir de JSON',
      },
      {
        label: 'Diff Checker',
        href: '/diff-checker',
        icon: GitCompare,
        description: 'Compare textos e encontre diferenças',
      },
      {
        label: 'Base64 Converter',
        href: '/base64',
        icon: Binary,
        description: 'Codifique e decodifique Base64',
      },
      {
        label: 'HTML to Text',
        href: '/html-to-text',
        icon: FileText,
        description: 'Extraia texto puro de arquivos HTML',
      },
      {
        label: 'Extrator de Dados',
        href: '/data-extractor',
        icon: ScanText, // Ou Regex
        description: 'Busque Emails, CPFs e URLs em textos',
      },
      {
        label: 'Gist Explorer',
        href: '/gist-explorer',
        icon: GitBranch,
        description: 'Busque e visualize Gists do GitHub',
      },
      {
        label: 'Cron Tools',
        href: '/cron-tools',
        icon: Clock,
        description: 'Valide e visualize expressões cron',
      },
    ],
  },
  {
    label: 'Segurança & Acesso',
    icon: ShieldCheck,
    description: 'Ferramentas para proteção e verificação de dados',
    submenu: [
      {
        label: 'Gerador de Senhas',
        href: '/password-gen',
        icon: KeyRound,
        description: 'Crie credenciais fortes e aleatórias',
      },
      {
        label: 'JWT Debugger',
        href: '/jwt-decoder',
        icon: LockKeyhole,
        description: 'Decodifique e inspecione tokens JWT',
      },
    ],
  },
]

// ----------------------------------------------------------------------
// 2. MODULES (Header / Menu)
// Lista plana (flat) porém ordenada logicamente para menus simples
// ----------------------------------------------------------------------

export const Modules: ModuleItem[] = [
  {
    label: 'JSON Formatter',
    href: '/json-formatter',
    icon: FileJson,
    description: 'Formatar JSON',
  },
  {
    label: 'SQL Formatter',
    href: '/sql-formatter',
    icon: Database,
    description: 'Formatar SQL',
  },
  {
    label: 'JS Formatter',
    href: '/javascript-formatter',
    icon: Code2,
    description: 'Formatar JavaScript',
  },
  {
    label: 'HTML Formatter',
    href: '/html-formatter',
    icon: FileCode,
    description: 'Formatar HTML',
  },
  {
    label: 'CSS Formatter',
    href: '/css-formatter',
    icon: Palette,
    description: 'Formatar CSS',
  },

  {
    label: 'MD Editor',
    href: '/md-editor',
    icon: FileEdit,
    description: 'Editor Markdown',
  },
  {
    label: 'Web Extractor',
    href: '/web-extractor',
    icon: Globe,
    description: 'Extraia artigos de sites',
  },
  {
    label: 'OpenAPI to MD',
    href: '/open-api-md',
    icon: SiOpenapiinitiative,
    description: 'Converta especificações OpenAPI/Swagger em documentação Markdown',
  },
  {
    label: 'Code Snapshot',
    href: '/code-snapshot',
    icon: Camera,
    description: 'Snapshots de Código',
  },

  // --- Conversores ---
  {
    label: 'JSON to TS',
    href: '/json-to-ts',
    icon: FileDigit,
    description: 'JSON para TypeScript',
  },
  {
    label: 'MD to PDF',
    href: '/md-to-pdf',
    icon: FileDown,
    description: 'Markdown para PDF',
  },
  {
    label: 'MD to HTML',
    href: '/md-to-html',
    icon: FileType,
    description: 'Markdown para HTML',
  },
  {
    label: 'HTML to Text',
    href: '/html-to-text',
    icon: FileText,
    description: 'HTML para Texto',
  },
  {
    label: 'Base64 Tool',
    href: '/base64',
    icon: Binary,
    description: 'Converter Base64',
  },

  // --- Utils ---
  {
    label: 'Diff Checker',
    href: '/diff-checker',
    icon: GitCompare,
    description: 'Comparar Textos',
  },
  {
    label: 'Extrator de Dados',
    href: '/data-extractor',
    icon: ScanText,
    description: 'Extrair Regex/Dados',
  },
  {
    label: 'Gist Explorer',
    href: '/gist-explorer',
    icon: GitBranch,
    description: 'Explorar Gists',
  },
  {
    label: 'Cron Tools',
    href: '/cron-tools',
    icon: Clock,
    description: 'Validar Cron',
  },

  // --- Segurança ---
  {
    label: 'Gerador de Senhas',
    href: '/password-gen',
    icon: KeyRound,
    description: 'Gerar Senhas',
  },
  {
    label: 'JWT Debugger',
    href: '/jwt-decoder',
    icon: LockKeyhole,
    description: 'Decodificar JWT',
  },
]
