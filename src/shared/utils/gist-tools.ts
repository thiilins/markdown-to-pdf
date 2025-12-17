// src/lib/gist-utils.ts

// Mapeamento de extensões para linguagens do Prism/Markdown
export const languageMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  java: 'java',
  css: 'css',
  html: 'html',
  json: 'json',
  go: 'go',
  rust: 'rust',
  sql: 'sql',
  sh: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  // Adicione mais conforme necessidade
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
 * Junta múltiplos arquivos de um Gist em uma única string Markdown
 */
export function mergeGistFiles(files: { filename: string; content: string }[]): string {
  return files.map((file) => wrapGistContent(file.filename, file.content)).join('\n\n---\n\n') // Adiciona uma linha horizontal entre arquivos
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

export const isMarkdownFile = (filename: string): boolean => {
  return filename.endsWith('.md') || filename.endsWith('.markdown')
}
