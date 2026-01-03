'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { ReactNode, createContext, useContext } from 'react'
import { DEFAULT_CODE } from '../constants/snap-code'

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

interface CodeSnapshotContextType {
  code: string
  setCode: (code: string) => void
  config: SnapshotConfig
  setConfig: (config: SnapshotConfig) => void
  updateConfig: (key: keyof SnapshotConfig, value: any) => void
  resetConfig: () => void
}

const defaultConfig: SnapshotConfig = {
  language: 'javascript',
  theme: 'dracula',
  background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  padding: 64,
  showLineNumbers: true,
  windowTheme: 'mac',
  fontFamily: 'JetBrains Mono',
  fontSize: 14,
  scale: 1,
  borderRadius: 12,
  shadowIntensity: 50,
  fontLigatures: true,
  widthOffset: 0, // Largura adicional ao padrão (0 = usa apenas o padrão) - usado apenas em modo custom
  wordWrap: true, // Sempre ativo para evitar scroll
  showHeaderTitle: true,
  showHeaderLanguage: true, // Deprecated - manter para compatibilidade
  headerTitle: 'code.ts',
  presetSize: 'custom', // Tamanho padrão: custom
  // Footer
  showFooter: false,
  footerOptions: [], // Opções do footer (até 3)
  footerCustomText: '', // Texto customizado para o footer
  languagePosition: 'header', // Linguagem no header por padrão
  footerPosition: 'right', // Footer alinhado à direita por padrão
  // Posicionamento do Conteúdo
  contentVerticalAlign: 'center', // Alinhamento vertical padrão: centro
}

const CodeSnapshotContext = createContext<CodeSnapshotContextType | undefined>(undefined)

export function CodeSnapshotProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = usePersistedStateInDB('code-snapshot-code', DEFAULT_CODE)
  const [config, setConfig] = usePersistedStateInDB<SnapshotConfig>(
    'code-snapshot-config',
    defaultConfig,
  )

  const updateConfig = (key: keyof SnapshotConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  const resetConfig = () => {
    setConfig({ ...defaultConfig })
  }

  return (
    <CodeSnapshotContext.Provider
      value={{ code, setCode, config, setConfig, updateConfig, resetConfig }}>
      {children}
    </CodeSnapshotContext.Provider>
  )
}

export function useCodeSnapshot() {
  const context = useContext(CodeSnapshotContext)
  if (!context) {
    throw new Error('useCodeSnapshot must be used within a CodeSnapshotProvider')
  }
  return context
}
