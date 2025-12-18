import { BsFiletypeJson } from 'react-icons/bs'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaGolang, FaRust } from 'react-icons/fa6'
import { IoLogoJavascript } from 'react-icons/io5'
import { PiFileHtmlFill } from 'react-icons/pi'
import { SiCsswizardry, SiDotenv, SiGnubash, SiYaml } from 'react-icons/si'
import { TbBrandPowershell, TbBrandPython, TbBrandTypescript, TbSql, TbTxt } from 'react-icons/tb'

import { FaMarkdown } from 'react-icons/fa'
export const IconsAvailable = [
  'JSON',
  'PowerShell',
  'Markdown',
  'TypeScript',
  'JavaScript',
  'Dotenv',
  'Text',
  'Shell',
  'CSS',
  'HTML',
  'YAML',
  'SQL',
  'Bash',
  'Go',
  'Rust',
  'Python',
].map((icon) => icon.toLowerCase())
export const GistFileIcon = {
  json: BsFiletypeJson,
  powershell: TbBrandPowershell,
  markdown: FaMarkdown,
  typescript: TbBrandTypescript,
  javascript: IoLogoJavascript,
  dotenv: SiDotenv,
  text: TbTxt,
  shell: SiGnubash,
  css: SiCsswizardry,
  html: PiFileHtmlFill,
  yaml: SiYaml,
  sql: TbSql,
  bash: SiGnubash,
  go: FaGolang,
  rust: FaRust,
  python: TbBrandPython,
  '': FaRegFileAlt,
}

export const getIcon = (language: string) => {
  const haveIcon = IconsAvailable.includes(language.toLowerCase())
  const languageIcon = haveIcon
    ? GistFileIcon[language.toLowerCase() as keyof typeof GistFileIcon]
    : FaRegFileAlt
  return haveIcon ? languageIcon : FaRegFileAlt
}
