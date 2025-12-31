import { IconType } from 'react-icons'
import { FaJava } from 'react-icons/fa'

// Ícones de Arquivos Genéricos (Lucide - Visual mais limpo)
import { LuFile, LuFileCode, LuFileJson, LuFileText } from 'react-icons/lu'

// Ícones de Marcas/Linguagens (Simple Icons - Oficiais)
import {
  SiCplusplus,
  SiCss3,
  SiDart,
  SiDocker,
  SiDotenv,
  SiElixir,
  SiGit,
  SiGnubash,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLua,
  SiMarkdown,
  SiMysql,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRuby,
  SiRust,
  SiSass,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiXml,
  SiYaml,
} from 'react-icons/si'
import { TbBrandCSharp, TbBrandPowershell } from 'react-icons/tb'
// Ícones Adicionais (FontAwesome/VSCode)
import { VscTerminal } from 'react-icons/vsc'

// Mapeamento principal
export const FILE_ICONS: Record<string, IconType> = {
  // Web Standard
  html: SiHtml5,
  htm: SiHtml5,
  css: SiCss3,
  scss: SiSass,
  sass: SiSass,
  less: SiCss3,

  // JavaScript / TypeScript Ecosystem
  js: SiJavascript,
  javascript: SiJavascript,
  jsx: SiReact,
  ts: SiTypescript,
  typescript: SiTypescript,
  tsx: SiReact,
  json: LuFileJson,

  // Frameworks
  vue: SiVuedotjs,
  svelte: LuFileCode, // Ou adicione SiSvelte se quiser importar
  tailwind: SiTailwindcss,

  // Backend / Systems
  py: SiPython,
  python: SiPython,
  go: SiGo,
  golang: SiGo,
  rs: SiRust,
  rust: SiRust,
  java: FaJava,
  c: LuFileCode, // C genérico
  cpp: SiCplusplus,
  'c++': SiCplusplus,
  cs: TbBrandCSharp,
  csharp: TbBrandCSharp,
  php: SiPhp,
  rb: SiRuby,
  ruby: SiRuby,
  lua: SiLua,
  swift: SiSwift,
  kt: SiKotlin,
  kotlin: SiKotlin,
  dart: SiDart,
  elixir: SiElixir,

  // Shell / Scripts
  sh: SiGnubash,
  bash: SiGnubash,
  zsh: VscTerminal,
  shell: SiGnubash,
  ps1: TbBrandPowershell,
  powershell: TbBrandPowershell,
  bat: VscTerminal,
  cmd: VscTerminal,

  // Data / Config
  xml: SiXml,
  yaml: SiYaml,
  yml: SiYaml,
  toml: LuFileCode,
  ini: LuFileCode,
  env: SiDotenv,
  dotenv: SiDotenv,
  sql: SiPostgresql, // Ou SiMysql dependendo da preferência
  mysql: SiMysql,
  postgres: SiPostgresql,

  // Docs
  md: SiMarkdown,
  markdown: SiMarkdown,
  txt: LuFileText,
  text: LuFileText,
  pdf: LuFileText,

  // Ops
  dockerfile: SiDocker,
  docker: SiDocker,
  gitignore: SiGit,
  git: SiGit,

  // Default
  default: LuFile,
}

export const getIcon = (fileNameOrLanguage: string): IconType => {
  if (!fileNameOrLanguage) return FILE_ICONS.default

  const normalizedName = fileNameOrLanguage.toLowerCase()

  // 1. Tenta buscar direto pelo nome (ex: "javascript", "dockerfile")
  if (FILE_ICONS[normalizedName]) {
    return FILE_ICONS[normalizedName]
  }

  // 2. Tenta buscar pela extensão (ex: "index.tsx" -> pega "tsx")
  const extension = normalizedName.split('.').pop()
  if (extension && FILE_ICONS[extension]) {
    return FILE_ICONS[extension]
  }

  // 3. Casos especiais (nomes de arquivos específicos)
  if (normalizedName === '.env' || normalizedName.startsWith('.env.')) return FILE_ICONS.env
  if (normalizedName === 'dockerfile') return FILE_ICONS.docker

  // 4. Retorna padrão
  return FILE_ICONS.default
}
