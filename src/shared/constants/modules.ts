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
  Table,
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
        long_description:
          'Editor Markdown profissional com preview ao vivo, syntax highlighting, suporte a tabelas GFM, emojis, mermaid diagrams, math equations (LaTeX), code blocks com 50+ linguagens, auto-save, modo escuro/claro, exportação para HTML/PDF, e interface split-screen responsiva. Perfeito para documentação técnica, READMEs, e artigos.',
      },
      {
        label: 'MD to PDF',
        href: '/md-to-pdf',
        icon: FileDown,
        description: 'Exporte documentação Markdown para PDF',
        long_description:
          'Converta arquivos Markdown em PDFs profissionais com formatação preservada, suporte a tabelas, code blocks com syntax highlighting, imagens, links, listas, headings, e estilos customizados. Ideal para gerar relatórios, documentação técnica, ebooks, e apresentações a partir de Markdown.',
      },
      {
        label: 'MD to HTML',
        href: '/md-to-html',
        icon: FileType,
        description: 'Converta Markdown para HTML puro',
        long_description:
          'Transforme Markdown em HTML semântico e limpo com suporte a GFM (GitHub Flavored Markdown), tabelas, task lists, syntax highlighting em code blocks, emojis, e sanitização automática. Gera código HTML otimizado para SEO, acessível (ARIA), e pronto para integração em sites e aplicações web.',
      },
      {
        label: 'Web Extractor',
        href: '/web-extractor',
        icon: Globe,
        description: 'Extraia artigos de sites',
        long_description:
          'Extraia conteúdo limpo de qualquer URL: artigos, posts de blog, documentação técnica. Remove ads, sidebars, popups e elementos desnecessários, preservando apenas o conteúdo principal com formatação Markdown. Suporta extração de metadados (título, autor, data), imagens, e conversão automática para Markdown editável.',
      },
      {
        label: 'OpenAPI to MD',
        href: '/open-api-md',
        icon: SiOpenapiinitiative,
        description: 'Converta especificações OpenAPI/Swagger em documentação Markdown',
        long_description:
          'Gere documentação Markdown profissional a partir de especificações OpenAPI 3.0/Swagger 2.0. Cria tabelas de endpoints, parâmetros, schemas, exemplos de request/response, códigos de status HTTP, e autenticação. Suporta validação de spec, resolução de $ref, syntax highlighting, e organização por tags. Perfeito para READMEs de API e documentação técnica.',
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
        long_description:
          'Valide, formate, minifique e visualize JSON com syntax highlighting, detecção de erros em tempo real, tree view interativa, busca por chaves/valores, estatísticas (tamanho, profundidade), e conversão para outros formatos. Suporta JSON gigantes, pretty print configurável (2/4 espaços, tabs), e cópia rápida. Essencial para debug de APIs e manipulação de dados.',
      },
      {
        label: 'SQL Formatter',
        href: '/sql-formatter',
        icon: Database,
        description: 'Beautifier para consultas SQL complexas',
        long_description:
          'Formate e organize queries SQL (MySQL, PostgreSQL, SQL Server, Oracle) com indentação inteligente, uppercase/lowercase de keywords, alinhamento de cláusulas (SELECT, FROM, WHERE, JOIN), e syntax highlighting. Suporta CTEs, subqueries, window functions, e queries complexas. Melhora legibilidade e facilita code review de scripts SQL.',
      },
      {
        label: 'HTML Formatter',
        href: '/html-formatter',
        icon: FileCode,
        description: 'Indente e organize código HTML',
        long_description:
          'Formate e valide HTML com indentação automática, correção de tags não fechadas, remoção de espaços extras, minificação, e syntax highlighting. Suporta HTML5, templates (Handlebars, EJS), e preservação de formatação em <pre> e <code>. Ideal para limpar HTML copiado, organizar templates, e preparar código para produção.',
      },
      {
        label: 'CSS Formatter',
        href: '/css-formatter',
        icon: Palette,
        description: 'Organize folhas de estilo CSS',
        long_description:
          'Formate, organize e otimize CSS/SCSS com indentação automática, ordenação de propriedades (alfabética ou lógica), remoção de duplicatas, minificação, e syntax highlighting. Suporta CSS3, variáveis CSS, @media queries, e preprocessadores. Melhora manutenibilidade e performance de folhas de estilo.',
      },
      {
        label: 'JS Formatter',
        href: '/javascript-formatter',
        icon: Code2,
        description: 'Formate e verifique sintaxe JavaScript',
        long_description:
          'Formate JavaScript/TypeScript com Prettier: indentação consistente, ponto-e-vírgula automático, aspas simples/duplas, trailing commas, e syntax highlighting. Suporta ES6+, JSX, TSX, arrow functions, async/await, e módulos. Detecta erros de sintaxe e aplica estilo de código padronizado automaticamente.',
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
        long_description:
          'Converta JSON em interfaces/types TypeScript automaticamente com detecção inteligente de tipos (string, number, boolean, arrays, objetos aninhados, union types, optional properties). Gera código TypeScript limpo, tipado, e pronto para uso. Suporta JSON complexos, arrays de objetos, e nomenclatura PascalCase/camelCase. Economiza horas de digitação manual.',
      },
      {
        label: 'Diff Checker',
        href: '/diff-checker',
        icon: GitCompare,
        description: 'Compare textos e encontre diferenças',
        long_description:
          'Compare dois textos lado a lado com highlight de diferenças (adições, remoções, modificações), visualização unified/split, ignore whitespace, case-insensitive, e estatísticas detalhadas. Suporta comparação de código, JSON, logs, e documentos. Perfeito para code review, merge conflicts, e análise de mudanças.',
      },
      {
        label: 'Base64 Converter',
        href: '/base64',
        icon: Binary,
        description: 'Codifique e decodifique Base64',
        long_description:
          'Codifique e decodifique Base64 com suporte a texto, arquivos, imagens (preview), e data URLs. Detecta automaticamente o tipo de entrada, valida formato Base64, e oferece cópia rápida. Suporta encoding/decoding de strings UTF-8, binários, e conversão de imagens para data URLs. Essencial para APIs, tokens, e embedding de assets.',
      },
      {
        label: 'HTML to Text',
        href: '/html-to-text',
        icon: FileText,
        description: 'Extraia texto puro de arquivos HTML',
        long_description:
          'Extraia texto limpo de HTML removendo tags, scripts, styles, e formatação. Preserva estrutura (parágrafos, listas, headings), converte links em texto, e remove elementos invisíveis. Ideal para análise de conteúdo, indexação, geração de previews, e conversão de emails HTML para texto plano.',
      },
      {
        label: 'Extrator de Dados',
        href: '/data-extractor',
        icon: ScanText,
        description: 'Busque Emails, CPFs e URLs em textos',
        long_description:
          'Extraia dados estruturados de textos com regex avançado: emails, telefones, CPFs, CNPJs, URLs, IPs, datas, CEPs, e padrões customizados. Valida formatos, remove duplicatas, e exporta resultados em JSON/CSV. Suporta múltiplos padrões simultâneos, highlight de matches, e estatísticas. Perfeito para scraping, data mining, e validação de dados.',
      },
      {
        label: 'Gist Explorer',
        href: '/gist-explorer',
        icon: GitBranch,
        description: 'Busque e visualize Gists do GitHub',
        long_description:
          'Busque, visualize e gerencie GitHub Gists com syntax highlighting, filtros por linguagem, busca por usuário/descrição, preview de múltiplos arquivos, e estatísticas (stars, forks, comentários). Suporta autenticação GitHub, criação/edição de Gists, e importação de código. Interface limpa para explorar snippets públicos e privados.',
      },
      {
        label: 'Cron Tools',
        href: '/cron-tools',
        icon: Clock,
        description: 'Valide e visualize expressões cron',
        long_description:
          'Valide, teste e visualize expressões cron com explicação em linguagem natural, próximas execuções (10+ datas), validação de sintaxe, e gerador visual de cron. Suporta formatos Unix, Quartz, e AWS. Mostra timezone, frequência, e exemplos práticos. Essencial para configurar jobs, schedulers, e automações.',
      },
      {
        label: 'Excel/CSV to MD',
        href: '/xls-md',
        icon: Table,
        description: 'Converta planilhas em tabelas Markdown',
        long_description:
          'Converta Excel (.xlsx, .xls) e CSV em tabelas Markdown com alinhamento de colunas (esquerda, centro, direita), transposição, ordenação, filtros, remoção de colunas vazias, e estatísticas (tipos, valores únicos, min/max/média). Suporta upload de arquivos, paste de dados, e exportação para HTML/LaTeX/ASCII. Preview em tempo real com syntax highlighting.',
      },
      {
        label: 'Color Studio',
        href: '/color-studio',
        icon: Palette,
        description: 'Gere cores e valide acessibilidade WCAG',
        long_description:
          'Gerador de paletas de cores profissional com 6 tipos (monocromática, análoga, complementar, tríade, tétrade, tons), 6 moods (corporativo, enérgico, calmo, luxuoso, divertido, minimalista), validação WCAG 2.1 + APCA (WCAG 3.0), simulador de daltonismo, Color Mixer (blend LCH), gradientes customizáveis (linear, radial, cônico, mesh), gerador de tema Shadcn UI (34 variáveis editáveis), exportação em 8 formatos (CSS, SCSS, Tailwind, JSON, Figma Tokens, Swift, XML, Shadcn), histórico local (20 paletas), favoritos, compartilhamento via URL, e nomes automáticos de cores. Suporta OKLCH, recomendações de fonte, e preview em tempo real.',
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
        long_description:
          'Gere senhas seguras e aleatórias com controle de comprimento (8-128 caracteres), caracteres especiais, números, maiúsculas/minúsculas, e exclusão de caracteres ambíguos (0/O, 1/l). Calcula força da senha (entropia), oferece múltiplas opções simultâneas, e cópia rápida. Suporta passphrases, PINs, e senhas memoráveis. Totalmente client-side (sem envio de dados).',
      },
      {
        label: 'JWT Debugger',
        href: '/jwt-decoder',
        icon: LockKeyhole,
        description: 'Decodifique e inspecione tokens JWT',
        long_description:
          'Decodifique, valide e inspecione tokens JWT (JSON Web Tokens) com visualização de header, payload, e signature. Valida algoritmo (HS256, RS256, etc.), expiração (exp), issuer (iss), e claims customizados. Suporta verificação de assinatura com secret/public key, highlight de campos, e detecção de tokens expirados. Essencial para debug de autenticação e APIs.',
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
  {
    label: 'Excel/CSV to MD',
    href: '/xls-md',
    icon: Table,
    description: 'Planilhas para Markdown',
  },
  {
    label: 'Color Studio',
    href: '/color-studio',
    icon: Palette,
    description: 'Gere cores e valide acessibilidade WCAG',
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
