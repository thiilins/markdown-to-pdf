'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { ReactNode, createContext, useContext } from 'react'
import { DEFAULT_CODE } from '../constants/snap-code'

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
  // Diff Mode
  diffMode: false, // Modo diff desativado por padrão
  diffOriginalCode: '', // Código original para comparação
  // Line Highlights
  highlightedLines: [], // Sem linhas destacadas por padrão
  highlightColor: '#facc15', // Amarelo padrão (marca-texto)
  highlightOpacity: 0.25, // Opacidade padrão
  // Code Annotations
  annotations: [], // Sem anotações por padrão
  annotationMode: false, // Modo de adicionar anotações desativado por padrão
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
      value={{
        code,
        setCode,
        config,
        setConfig,
        updateConfig,
        resetConfig,
      }}>
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
