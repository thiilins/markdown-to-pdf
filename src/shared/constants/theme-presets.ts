export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  // --- Clássicos Refinados ---
  classic: {
    name: 'Clássico',
    description: 'Tema tradicional de alto contraste com fundo branco puro',
    background: '#ffffff',
    textColor: '#111111',
    headingColor: '#000000',
    codeBackground: '#f0f0f0',
    codeTextColor: '#d01040',
    linkColor: '#0969da',
    borderColor: '#d0d7de',
    blockquoteColor: '#57606a',
  },
  modern: {
    name: 'Moderno',
    description: 'Estilo clean com cinzas suaves e tipografia nítida',
    background: '#f9fafb',
    textColor: '#374151',
    headingColor: '#111827',
    codeBackground: '#e5e7eb',
    codeTextColor: '#be185d',
    linkColor: '#2563eb',
    borderColor: '#e5e7eb',
    blockquoteColor: '#6b7280',
  },
  dark: {
    name: 'Escuro Suave',
    description: 'Tema escuro balanceado para evitar fadiga ocular',
    background: '#1e1e1e',
    textColor: '#d4d4d4',
    headingColor: '#ffffff',
    codeBackground: '#2d2d2d',
    codeTextColor: '#9cdcfe',
    linkColor: '#3794ff',
    borderColor: '#404040',
    blockquoteColor: '#a0a0a0',
  },
  minimal: {
    name: 'Minimalista',
    description: 'Foco total no conteúdo, sem distrações visuais',
    background: '#ffffff',
    textColor: '#333333',
    headingColor: '#222222',
    codeBackground: '#f8f9fa',
    codeTextColor: '#444444',
    linkColor: '#222222', // Links pretos sublinhados (estilo editorial)
    borderColor: '#eeeeee',
    blockquoteColor: '#666666',
  },

  // --- Tons e Temperaturas ---
  warm: {
    name: 'Café',
    description: 'Tons terrosos e quentes, confortável para leitura longa',
    background: '#fcf6f0',
    textColor: '#4a3b32',
    headingColor: '#2c1810',
    codeBackground: '#efebe9',
    codeTextColor: '#8d6e63',
    linkColor: '#d84315',
    borderColor: '#e7ded9',
    blockquoteColor: '#795548',
  },
  cool: {
    name: 'Gelo',
    description: 'Tons azulados frios para um visual profissional e técnico',
    background: '#f0f9ff',
    textColor: '#0f172a',
    headingColor: '#0c4a6e',
    codeBackground: '#e0f2fe',
    codeTextColor: '#0369a1',
    linkColor: '#0284c7',
    borderColor: '#bae6fd',
    blockquoteColor: '#475569',
  },

  // --- Populares / Dev Themes ---
  dracula: {
    name: 'Dracula',
    description: 'O famoso tema escuro com alto contraste e cores vibrantes',
    background: '#282a36',
    textColor: '#f8f8f2',
    headingColor: '#bd93f9', // Purple
    codeBackground: '#44475a',
    codeTextColor: '#ff79c6', // Pink
    linkColor: '#8be9fd', // Cyan
    borderColor: '#6272a4',
    blockquoteColor: '#f1fa8c', // Yellowish
  },
  omni: {
    name: 'Omni',
    description: 'Tema escuro moderno com tons de roxo e preto profundo',
    background: '#191622',
    textColor: '#E1E1E6',
    headingColor: '#FF79C6', // Pink do Omni
    codeBackground: '#2A2139', // Um tom levemente mais claro que o fundo
    codeTextColor: '#EFFA78', // Yellow do Omni para destaque
    linkColor: '#BD93F9', // Blue/Purple do Omni
    borderColor: '#41414D',
    blockquoteColor: '#8D79BA', // Cyan/Purple muted
  },
  nord: {
    name: 'Nord',
    description: 'Paleta ártica, azul-acinzentada, fria e elegante',
    background: '#2e3440',
    textColor: '#d8dee9',
    headingColor: '#88c0d0',
    codeBackground: '#3b4252',
    codeTextColor: '#a3be8c',
    linkColor: '#81a1c1',
    borderColor: '#434c5e',
    blockquoteColor: '#eceff4',
  },
  monokai: {
    name: 'Monokai',
    description: 'Clássico dos editores de código, fundo escuro e cores vivas',
    background: '#272822',
    textColor: '#f8f8f2',
    headingColor: '#a6e22e', // Green
    codeBackground: '#3e3d32',
    codeTextColor: '#fd971f', // Orange
    linkColor: '#66d9ef', // Blue
    borderColor: '#75715e',
    blockquoteColor: '#e6db74',
  },

  // --- Solarized ---
  solarizedLight: {
    name: 'Solarized Light',
    description: 'Cores calibradas com precisão para baixo contraste confortável',
    background: '#fdf6e3',
    textColor: '#657b83',
    headingColor: '#586e75',
    codeBackground: '#eee8d5',
    codeTextColor: '#b58900',
    linkColor: '#268bd2',
    borderColor: '#93a1a1',
    blockquoteColor: '#859900',
  },
  solarizedDark: {
    name: 'Solarized Dark',
    description: 'Versão escura do Solarized, tons de ciano profundo',
    background: '#002b36',
    textColor: '#839496',
    headingColor: '#93a1a1',
    codeBackground: '#073642',
    codeTextColor: '#cb4b16',
    linkColor: '#268bd2',
    borderColor: '#586e75',
    blockquoteColor: '#2aa198',
  },

  // --- GitHub Inspired ---
  githubLight: {
    name: 'GitHub Light',
    description: 'Inspirado na interface clara do GitHub',
    background: '#ffffff',
    textColor: '#24292f',
    headingColor: '#1F2328',
    codeBackground: '#f6f8fa',
    codeTextColor: '#24292f',
    linkColor: '#0969da',
    borderColor: '#d0d7de',
    blockquoteColor: '#57606a',
  },
  githubDark: {
    name: 'GitHub Dark',
    description: 'Inspirado na interface escura do GitHub (Dimmed)',
    background: '#0d1117',
    textColor: '#c9d1d9',
    headingColor: '#e6edf3',
    codeBackground: '#161b22',
    codeTextColor: '#e6edf3',
    linkColor: '#58a6ff',
    borderColor: '#30363d',
    blockquoteColor: '#8b949e',
  },

  // --- Leitura & Papel ---
  sepia: {
    name: 'Sépia',
    description: 'Estilo livro antigo, excelente para leituras longas',
    background: '#f4ecd8',
    textColor: '#5b4636',
    headingColor: '#433422',
    codeBackground: '#eaddcf',
    codeTextColor: '#8a6a4b',
    linkColor: '#a65626',
    borderColor: '#dcc6a8',
    blockquoteColor: '#7a624f',
  },
  newspaper: {
    name: 'Jornal',
    description: 'Alto contraste acromático similar a papel de jornal',
    background: '#f3f2ea',
    textColor: '#1a1a1a',
    headingColor: '#000000',
    codeBackground: '#e6e6e6',
    codeTextColor: '#333333',
    linkColor: '#0056b3',
    borderColor: '#a6a6a6',
    blockquoteColor: '#404040',
  },
  gruvbox: {
    name: 'Gruvbox Dark',
    description: 'Tema retro com contraste "médio" e cores pastéis quentes',
    background: '#282828',
    textColor: '#ebdbb2',
    headingColor: '#fabd2f', // Yellow
    codeBackground: '#3c3836',
    codeTextColor: '#fb4934', // Red
    linkColor: '#83a598', // Blue
    borderColor: '#504945',
    blockquoteColor: '#d3869b', // Purple
  },

  // --- Temas Criativos ---
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Futurista, fundo preto e cores neon vibrantes',
    background: '#050505',
    textColor: '#00ff9f',
    headingColor: '#f0f', // Magenta
    codeBackground: '#121212',
    codeTextColor: '#0ff', // Cyan
    linkColor: '#ffff00', // Yellow
    borderColor: '#333',
    blockquoteColor: '#b300b3',
  },
  lavender: {
    name: 'Lavanda',
    description: 'Tema claro com tons suaves de roxo e lilás',
    background: '#fcfaff',
    textColor: '#2e2a36',
    headingColor: '#4c1d95',
    codeBackground: '#f3e8ff',
    codeTextColor: '#6b21a8',
    linkColor: '#7c3aed',
    borderColor: '#e9d5ff',
    blockquoteColor: '#5b21b6',
  },
  midnight: {
    name: 'Meia-noite',
    description: 'Azul marinho profundo, elegante e relaxante',
    background: '#0f172a',
    textColor: '#cbd5e1',
    headingColor: '#f1f5f9',
    codeBackground: '#1e293b',
    codeTextColor: '#93c5fd',
    linkColor: '#60a5fa',
    borderColor: '#334155',
    blockquoteColor: '#94a3b8',
  },
  forest: {
    name: 'Floresta',
    description: 'Tons de verde e natureza, orgânico e fresco',
    background: '#f2f8f5',
    textColor: '#1b4d3e',
    headingColor: '#064e3b',
    codeBackground: '#d1fae5',
    codeTextColor: '#065f46',
    linkColor: '#059669',
    borderColor: '#a7f3d0',
    blockquoteColor: '#047857',
  },
  obsidian: {
    name: 'Obsidiana',
    description: 'Preto quase absoluto com texto prata, simulando o app Obsidian',
    background: '#161616',
    textColor: '#dcddde',
    headingColor: '#c586c0',
    codeBackground: '#202020',
    codeTextColor: '#ce9178',
    linkColor: '#4ec9b0',
    borderColor: '#333333',
    blockquoteColor: '#858585',
  },

  // --- Acessibilidade ---
  highContrast: {
    name: 'Alto Contraste',
    description: 'Maximiza a legibilidade com preto puro e branco puro',
    background: '#000000',
    textColor: '#ffffff',
    headingColor: '#ffff00', // Amarelo para destaque máximo
    codeBackground: '#000000', // Sem fundo distinto, usa borda
    codeTextColor: '#00ff00', // Verde terminal
    linkColor: '#66ccff',
    borderColor: '#ffffff',
    blockquoteColor: '#ffffff',
  },

  // --- Customizado ---
  custom: {
    name: 'Personalizado',
    description: 'Base para customização do usuário',
    background: '#ffffff',
    textColor: '#000000',
    headingColor: '#1a1a1a',
    codeBackground: '#f5f5f5',
    codeTextColor: '#333333',
    linkColor: '#0066cc',
    borderColor: '#e0e0e0',
    blockquoteColor: '#4a5568',
  },
}
