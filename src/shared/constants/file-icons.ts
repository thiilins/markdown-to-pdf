import { BsFiletypeJson } from 'react-icons/bs'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaGolang, FaRust } from 'react-icons/fa6'
import { IoLogoJavascript } from 'react-icons/io5'
import { PiFileHtmlFill } from 'react-icons/pi'
import { SiCsswizardry, SiDotenv, SiGnubash, SiYaml } from 'react-icons/si'
import { TbBrandPowershell, TbBrandPython, TbBrandTypescript, TbSql, TbTxt } from 'react-icons/tb'

import { FaMarkdown } from 'react-icons/fa'
export const FILE_ICONS_AVAILABLE = [
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
export const FILE_ICONS = {
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
  const haveIcon = FILE_ICONS_AVAILABLE.includes(language.toLowerCase())
  const languageIcon = haveIcon
    ? FILE_ICONS[language.toLowerCase() as keyof typeof FILE_ICONS]
    : FaRegFileAlt
  return haveIcon ? languageIcon : FaRegFileAlt
}
