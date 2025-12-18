// src/lib/gist-utils.ts

const languageMap: Record<string, string> = {
  // .NET & Microsoft
  'C#': 'csharp',
  'F#': 'fsharp',
  'VB.NET': 'vbnet',
  'Visual Basic .NET': 'vbnet',
  PowerShell: 'powershell',

  // C-Family
  'C++': 'cpp',
  'Objective-C': 'objectivec',
  Arduino: 'arduino',

  // Web (Frontend & Backend)
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  React: 'jsx', // Fallback comum para arquivos .jsx
  JSX: 'jsx',
  TSX: 'tsx',
  Vue: 'vue',
  Svelte: 'svelte',
  HTML: 'markup',
  XML: 'markup',
  SVG: 'markup',
  CSS: 'css',
  SCSS: 'scss',
  Less: 'less',
  PHP: 'php',

  // Mobile
  Swift: 'swift',
  Kotlin: 'kotlin',
  Dart: 'dart',

  // Data & Config
  JSON: 'json',
  YAML: 'yaml',
  TOML: 'toml',
  GraphQL: 'graphql',
  SQL: 'sql',
  PostgreSQL: 'sql',
  'PL/SQL': 'plsql',

  // Scripting & System
  Python: 'python',
  Ruby: 'ruby',
  Go: 'go',
  Rust: 'rust',
  Shell: 'bash',
  Bash: 'bash',
  Zsh: 'bash',
  Makefile: 'makefile',
  Dockerfile: 'docker',
  Nginx: 'nginx',
  ApacheConf: 'apacheconf',

  // Documentação e Outros
  Markdown: 'markdown',
  TeX: 'latex',
  LaTeX: 'latex',
  'Vim Script': 'vim',
  'Protocol Buffers': 'protobuf',
  Perl: 'perl',
  Scala: 'scala',
  Lua: 'lua',
}

/**
 * Envolve o conteúdo em blocos de código Markdown se não for .md
 */
export function wrapContentInMarkdown(filename: string, content: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || ''

  if (extension === 'md' || extension === 'markdown') {
    return content
  }

  // Mapa básico de extensões
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    html: 'html',
    css: 'css',
    json: 'json',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    sql: 'sql',
  }

  const language = languageMap[extension] || ''
  return `\`\`\`${language}\n${content}\n\`\`\``
}

export const isValidList = (list: Gist[]) => {
  return Array.isArray(list) && list.length > 0
}

export function getLanguageFromFilename(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  return languageMap[extension] || 'text'
}

/**
 * Envelopa o conteúdo de um arquivo em um bloco de código Markdown.
 * Se já for Markdown, retorna como está.
 */
export function wrapGistContent(filename: string, content: string): string {
  const language = getLanguageFromFilename(filename)

  // Se for markdown, adicionamos apenas um título visual para separar se for merge
  if (language === 'markdown') {
    return `### 📄 ${filename}\n\n${content}`
  }

  // Se for código, envelopamos com syntax highlighting
  return `### 💻 ${filename}\n\`\`\`${language}\n${content}\n\`\`\``
}
/**
 * Mescla múltiplos arquivos em um único Markdown com separadores
 */
export function mergeGistFiles(files: GistFile[], rawContents: Record<string, string>): string {
  // Ordena README primeiro
  const sortedFiles = [...files].sort((a, b) => {
    if (a.filename.toLowerCase() === 'readme.md') return -1
    if (b.filename.toLowerCase() === 'readme.md') return 1
    return a.filename.localeCompare(b.filename)
  })

  return sortedFiles
    .map((file) => {
      const content = rawContents[file.filename]
      if (!content) return ''

      const separator = `\n\n---\n### 📄 ${file.filename}\n---\n\n`
      const wrapped = wrapContentInMarkdown(file.filename, content)

      return separator + wrapped
    })
    .join('')
}

export const mountGistSelectedfile = (
  gist: Gist,
  filename: string,
): SelectedGistFileProps | null => {
  const file = gist.files.find((file) => file.filename === filename)
  if (!file) return null
  return {
    id: gist.id,
    description: gist.description,
    public: gist.public,
    created_at: gist.created_at,
    html_url: gist.html_url,
    owner: gist.owner,
    filename: file.filename,
    language: file.language,
    raw_url: file.raw_url,
    type: file.type,
    size: file.size,
  }
}

/**
 * FEATURE 3.2: Wrapping Strategy
 * Envolve arquivos que não são markdown em blocos de código para
 * que apareçam corretamente no PDF final.
 */
export const wrapContentForMarkdown = (
  filename: string,
  content: string,
  language?: string,
): string => {
  // Se já for markdown, retorna como está
  if (filename.toLowerCase().endsWith('.md') || filename.toLowerCase().endsWith('.markdown')) {
    return content
  }

  // Tenta inferir a linguagem pela extensão se não for fornecida
  const lang = language || filename.split('.').pop() || ''

  // Retorna o conteúdo envolvido em crases (fenced code block)
  return `### ${filename}\n\n\`\`\`${lang}\n${content}\n\`\`\`\n`
}

/**
 * FEATURE 3.3: Merge & Import
 * Junta múltiplos arquivos de um Gist em um único conteúdo Markdown.
 */
export const processGistForImport = (gist: Gist, fileContents: Record<string, string>): string => {
  const files = gist.files || []

  // Ordena para que o README.md (ou similar) venha primeiro, se existir
  const sortedFiles = [...files].sort((a, b) => {
    const isReadmeA = a.filename.toLowerCase().includes('readme')
    const isReadmeB = b.filename.toLowerCase().includes('readme')
    if (isReadmeA && !isReadmeB) return -1
    if (!isReadmeA && isReadmeB) return 1
    return 0
  })

  let finalMarkdown = `# ${gist.description || 'Gist Importado'}\n\n`
  finalMarkdown += `> Importado de: [${gist.html_url}](${gist.html_url}) - Autor: ${gist.owner?.login || 'Anônimo'}\n\n---\n\n`

  sortedFiles.forEach((file) => {
    const content = fileContents[file.filename]

    if (content) {
      // Aplica o wrapping se necessário e adiciona separadores
      const processedContent = wrapContentForMarkdown(file.filename, content, file.language || '')
      finalMarkdown += `${processedContent}\n\n---\n\n`
    }
  })

  return finalMarkdown
}

/**
 * Extrai hashtags de uma string de descrição.
 */
export function extractGistTags(description: string | null): string[] {
  if (!description) return []
  const regex = /#(\w+)/g
  const matches = description.match(regex)
  if (!matches) return []
  return matches.map((tag) => tag.substring(1).toLowerCase())
}
export function mapLanguage(lang: string | null | undefined): string {
  // Caso a linguagem não seja detectada ou seja nula, tratamos como texto plano
  if (!lang) {
    return 'text'
  }

  /**
   * Se o nome vindo do GitHub existir no mapa acima, retornamos o valor mapeado.
   * Caso contrário, tentamos converter para minúsculo e remover espaços,
   * que é o padrão da maioria das linguagens no highlighter.
   */
  const normalizedLang = lang.trim()

  if (languageMap[normalizedLang]) {
    return languageMap[normalizedLang]
  }

  // Fallback para nomes que não estão no mapa mas seguem o padrão lowercase
  return normalizedLang.toLowerCase().replace(/\s+/g, '')
}
export function isImageFile(filename: string | undefined): boolean {
  if (!filename) return false

  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif', 'bmp']

  const extension = filename.split('.').pop()?.toLowerCase() || ''
  return imageExtensions.includes(extension)
}
export function isMarkdownFile(filename: string | undefined): boolean {
  if (!filename) return false

  const mdExtensions = ['md', 'markdown', 'mdown', 'mkdn']
  const extension = filename.split('.').pop()?.toLowerCase() || ''

  return mdExtensions.includes(extension)
}
