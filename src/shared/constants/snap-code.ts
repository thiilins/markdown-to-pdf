import { AlignCenter, AlignLeft, AlignRight, ListEnd, ListStart, Terminal } from 'lucide-react'
import { FaApple, FaChrome, FaCode, FaLinux, FaWindowClose, FaWindows } from 'react-icons/fa'

export const DEFAULT_CODE = `import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface SnapshotProps {
  code: string
  language: 'typescript' | 'javascript' | 'python'
  theme?: string
}

export function CodeCard({ code, language }: SnapshotProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setIsCopied(true)

    // 📸 Feedback visual para o usuário
    toast.success('Snippet copiado com sucesso!')

    setTimeout(() => setIsCopied(false), 2000)
  }, [code])

  return (
    <div className="rounded-xl border bg-zinc-950 p-4 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-zinc-400">{language}</span>
        <button onClick={copyToClipboard} className="text-sm font-medium">
          {isCopied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="font-mono text-sm text-blue-300">
        {code}
      </pre>
    </div>
  )
}`
export const GRADIENTS = [
  { name: 'Midnight', value: 'linear-gradient(to top, #09203f 0%, #537895 100%)' },
  { name: 'Hyper', value: 'linear-gradient(to right, #ec008c, #fc6767)' },
  { name: 'Oceanic', value: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)' },
  { name: 'Peachy', value: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Emerald', value: 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Violet', value: 'linear-gradient(to top, #5f72bd 0%, #9b23ea 100%)' },
  { name: 'Sunset', value: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)' },
  { name: 'Forest', value: 'linear-gradient(to right, #134e5e 0%, #71b280 100%)' },
  { name: 'Lavender', value: 'linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)' },
  { name: 'Crimson', value: 'linear-gradient(to right, #f093fb 0%, #f5576c 100%)' },
  { name: 'Aurora', value: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)' },
  { name: 'Tropical', value: 'linear-gradient(to right, #f093fb 0%, #f5576c 50%, #4facfe 100%)' },
  { name: 'Mint', value: 'linear-gradient(to right, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Cosmic', value: 'linear-gradient(to right, #fa709a 0%, #fee140 50%, #30cfd0 100%)' },
  { name: 'Royal', value: 'linear-gradient(to right, #141e30 0%, #243b55 100%)' },
  { name: 'Coral', value: 'linear-gradient(to right, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
  { name: 'Neon', value: 'linear-gradient(to right, #00c9ff 0%, #92fe9d 100%)' },
  {
    name: 'Purple Dream',
    value: 'linear-gradient(to right, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  { name: 'Golden Hour', value: 'linear-gradient(to right, #f6d365 0%, #fda085 100%)' },
  { name: 'Deep Blue', value: 'linear-gradient(to right, #1e3c72 0%, #2a5298 100%)' },
  {
    name: 'Pink Lemonade',
    value: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
  },
  { name: 'Electric', value: 'linear-gradient(to right, #f093fb 0%, #4facfe 100%)' },
  { name: 'Mystic', value: 'linear-gradient(to right, #a8caba 0%, #5d4e75 100%)' },
  { name: 'Fire', value: 'linear-gradient(to right, #f12711 0%, #f5af19 100%)' },
  {
    name: 'Ocean Depth',
    value: 'linear-gradient(to right, #134e5e 0%, #71b280 50%, #134e5e 100%)',
  },
  { name: 'Cyberpunk', value: 'linear-gradient(to right, #c31432, #240b36)' },
  { name: 'Synthwave', value: 'linear-gradient(to right, #fc00ff, #00dbde)' },
  { name: 'Jungle', value: 'linear-gradient(to right, #11998e, #38ef7d)' },
  { name: 'Blue Raspberry', value: 'linear-gradient(to right, #00b09b, #96c93d)' },
  { name: 'Flare', value: 'linear-gradient(to right, #f12711, #f5af19)' },
  { name: 'Metapolis', value: 'linear-gradient(to right, #654ea3, #eaafc8)' },
  { name: 'Kyoto', value: 'linear-gradient(to right, #c21500, #ffc500)' },
  { name: 'Amethyst', value: 'linear-gradient(to right, #9d50bb, #6e48aa)' },

  // --- Suaves e Pastéis (Ótimo para fundos de UI) ---
  {
    name: 'Cloudy Apple',
    value: 'linear-gradient(to right, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)',
  },
  { name: 'Snowy', value: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)' },
  { name: 'Pale Wood', value: 'linear-gradient(to right, #eacda3, #d6ae7b)' },
  { name: 'Perfect White', value: 'linear-gradient(to top, #fdfbfb 0%, #ebedee 100%)' },
  { name: 'Lemon Twist', value: 'linear-gradient(to right, #3ca55c, #b5ac49)' },
  { name: 'Rose Water', value: 'linear-gradient(to right, #e55d87, #5fc3e4)' },

  // --- Temas Escuros e Profundos ---
  { name: 'Space Gray', value: 'linear-gradient(to right, #232526, #414345)' },
  { name: 'Vampire', value: 'linear-gradient(to right, #870000, #190a05)' },
  { name: 'Deep Space', value: 'linear-gradient(to right, #000000, #434343)' },
  { name: 'Midnight Bloom', value: 'linear-gradient(to right, #2b5876, #4e4376)' },
  { name: 'Frost', value: 'linear-gradient(to right, #000428, #004e92)' },
  { name: 'Dark Slate', value: 'linear-gradient(to right, #434343 0%, black 100%)' },

  // --- Estilos Metálicos e Luxo ---
  {
    name: 'Gold Luxury',
    value: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
  },
  { name: 'Silver', value: 'linear-gradient(to right, #d7d2cc 0%, #304352 100%)' },
  { name: 'Bronze', value: 'linear-gradient(to right, #780206, #061161)' },
  { name: 'Titanium', value: 'linear-gradient(to right, #283048, #859398)' },

  // --- Gradientes Complexos (3+ cores) ---
  {
    name: 'Instagram-ish',
    value:
      'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  },
  {
    name: 'Messenger',
    value: 'linear-gradient(to right, #00c6ff, #0072ff)',
  },
  {
    name: 'Summer Games',
    value: 'linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)',
  },
  {
    name: 'Rainbow Blue',
    value: 'linear-gradient(to right, #00f260, #0575e6)',
  },
  {
    name: 'Evening Sunshine',
    value: 'linear-gradient(to right, #b92b27, #1565c0)',
  },
  { name: 'Solid Black', value: '#000000' },
  { name: 'Solid White', value: '#ffffff' },
  { name: 'Solid Gray', value: '#1a1a1a' },
  { name: 'Solid Dark Blue', value: '#0a1929' },
  {
    name: 'Transparent',
    value: 'transparent',
  },
]

export const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'html',
  'css',
  'json',
  'sql',
  'bash',
  'go',
  'rust',
  'cpp',
  'c',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'dart',
  'scala',
  'r',
  'matlab',
  'lua',
  'perl',
  'shell',
  'powershell',
  'yaml',
  'toml',
  'xml',
  'markdown',
  'dockerfile',
  'nginx',
  'apache',
  'graphql',
  'vue',
  'svelte',
  'jsx',
  'tsx',
  'sass',
  'less',
  'stylus',
  'coffeescript',
  'elm',
  'haskell',
  'clojure',
  'erlang',
  'elixir',
  'ocaml',
  'fsharp',
  'vbnet',
  'objectivec',
]

export const FONT_FAMILIES = [
  'JetBrains Mono',
  'Fira Code',
  'Source Code Pro',
  'Consolas',
  'Monaco',
  'Courier New',
  'Roboto Mono',
  'Inconsolata',
  'Cascadia Code',
  'Hack',
  'IBM Plex Mono',
  'Space Mono',
  'Ubuntu Mono',
  'Droid Sans Mono',
  'Menlo',
  'SF Mono',
]

export const CODE_THEMES = [
  { name: 'Dracula', value: 'dracula' },
  { name: 'VS Code Dark+', value: 'vscDarkPlus' },
  { name: 'One Dark', value: 'oneDark' },
  { name: 'One Light', value: 'oneLight' },
  { name: 'Omni', value: 'darcula' },
  { name: 'Material Dark', value: 'materialDark' },
  { name: 'Material Oceanic', value: 'materialOceanic' },
  { name: 'Night Owl', value: 'nightOwl' },
  { name: 'Nord', value: 'nord' },
  { name: 'Gruvbox Dark', value: 'gruvboxDark' },
  { name: 'Gruvbox Light', value: 'gruvboxLight' },
  { name: 'Synthwave 84', value: 'synthwave84' },
  { name: 'Shades of Purple', value: 'shadesOfPurple' },
  { name: 'Lucario', value: 'lucario' },
  { name: 'Coldark Dark', value: 'coldarkDark' },
  { name: 'Coldark Cold', value: 'coldarkCold' },
  { name: 'A11y Dark', value: 'a11yDark' },
  { name: 'Atom Dark', value: 'atomDark' },
  { name: 'Duotone Dark', value: 'duotoneDark' },
  { name: 'Duotone Space', value: 'duotoneSpace' },
  { name: 'Duotone Earth', value: 'duotoneEarth' },
  { name: 'Duotone Forest', value: 'duotoneForest' },
  { name: 'Duotone Sea', value: 'duotoneSea' },
  { name: 'Holi Theme', value: 'holiTheme' },
  { name: 'Hopscotch', value: 'hopscotch' },
  { name: 'Twilight', value: 'twilight' },
  { name: 'Tomorrow', value: 'tomorrow' },
  { name: 'Solarized Dark Atom', value: 'solarizedDarkAtom' },
  { name: 'Solarized Light', value: 'solarizedlight' },
  { name: 'VS Dark', value: 'vsDark' },
  { name: 'VS', value: 'vs' },
  { name: 'Dark', value: 'dark' },
  { name: 'Okaidia', value: 'okaidia' },
  { name: 'Coy', value: 'coy' },
  { name: 'Coy Without Shadows', value: 'coyWithoutShadows' },
  { name: 'Funky', value: 'funky' },
  { name: 'Pojoaque', value: 'pojoaque' },
  { name: 'Xonokai', value: 'xonokai' },
  { name: 'Z Touch', value: 'zTouch' },
]

export const WINDOW_THEMES = [
  { name: 'macOS', value: 'mac', icon: FaApple },
  { name: 'Windows', value: 'windows', icon: FaWindows },
  { name: 'Chrome', value: 'chrome', icon: FaChrome },
  { name: 'Linux', value: 'linux', icon: FaLinux },
  { name: 'VS Code', value: 'vscode', icon: FaCode },
  { name: 'Terminal Retro', value: 'retro', icon: Terminal },
  { name: 'None', value: 'none', icon: FaWindowClose },
]

export const LANGUAGE_POSITIONS = [
  { name: 'Cabeçalho', value: 'header', icon: ListStart },
  { name: 'Rodapé', value: 'footer', icon: ListEnd },
]

export const FOOTER_POSITIONS = [
  { name: 'Esquerda', value: 'left', icon: AlignLeft },
  { name: 'Centro', value: 'center', icon: AlignCenter },
  { name: 'Direita', value: 'right', icon: AlignRight },
]

export const PRESET_SIZES: PresetSize[] = [
  { id: 'custom', name: 'Custom', width: 800, height: 0, description: 'Tamanho personalizado' },
  { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, description: '1:1.91' },
  { id: 'facebook-story', name: 'Facebook Story', width: 1080, height: 1920, description: '9:16' },
  { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080, description: '1:1' },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    description: '9:16',
  },
  { id: 'instagram-reel', name: 'Instagram Reel', width: 1080, height: 1920, description: '9:16' },
  { id: 'tiktok', name: 'TikTok', width: 1080, height: 1920, description: '9:16' },
  { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, description: '1.91:1' },
  {
    id: 'linkedin-article',
    name: 'LinkedIn Article',
    width: 1200,
    height: 627,
    description: '1.91:1',
  },
  { id: 'twitter-post', name: 'Twitter/X Post', width: 1200, height: 675, description: '16:9' },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    description: '16:9',
  },
  { id: 'a4', name: 'A4 Document', width: 1123, height: 1587, description: 'A4 (300 DPI)' },
  {
    id: 'a4-landscape',
    name: 'A4 Landscape',
    width: 1587,
    height: 1123,
    description: 'A4 Horizontal',
  },
]
