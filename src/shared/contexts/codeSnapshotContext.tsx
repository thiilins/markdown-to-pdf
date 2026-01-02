'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

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
  setConfig: React.Dispatch<React.SetStateAction<SnapshotConfig>>
  updateConfig: (key: keyof SnapshotConfig, value: any) => void
  resetConfig: () => void
}
const defaultCode = `import { useState, useCallback } from 'react'
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

const defaultConfig: SnapshotConfig = {
  language: 'javascript',
  theme: 'vscDarkPlus',
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
  const [code, setCode] = useState(defaultCode)
  const [config, setConfig] = useState<SnapshotConfig>(defaultConfig)

  const updateConfig = (key: keyof SnapshotConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
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
