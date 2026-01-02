'use client'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { useEffect } from 'react'

export function ValidateFontComponent() {
  const { config } = useCodeSnapshot()
  useEffect(() => {
    const systemFonts = ['Consolas', 'Monaco', 'Courier New', 'Menlo', 'SF Mono']
    if (systemFonts.includes(config.fontFamily)) {
      return
    }
    const getGoogleFontName = (fontName: string) => {
      const fontMap: Record<string, string> = {
        'Fira Code': 'Fira+Code',
        'JetBrains Mono': 'JetBrains+Mono',
        'Source Code Pro': 'Source+Code+Pro',
        'Roboto Mono': 'Roboto+Mono',
        'Cascadia Code': 'Cascadia+Code',
        'IBM Plex Mono': 'IBM+Plex+Mono',
        'Space Mono': 'Space+Mono',
        'Ubuntu Mono': 'Ubuntu+Mono',
        'Droid Sans Mono': 'Droid+Sans+Mono',
        Hack: 'Hack',
        Inconsolata: 'Inconsolata',
      }
      return fontMap[fontName] || fontName.replace(/\s+/g, '+')
    }

    const googleFontName = getGoogleFontName(config.fontFamily)
    const fontId = 'code-snapshot-font-loader'
    const existingLink = document.getElementById(fontId) as HTMLLinkElement
    if (existingLink) {
      existingLink.remove()
    }
    const linkElement = document.createElement('link')
    linkElement.id = fontId
    linkElement.rel = 'stylesheet'
    linkElement.href = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@300;400;500;600;700&display=swap`
    document.head.appendChild(linkElement)
    if (document.fonts) {
      const checkFont = async () => {
        try {
          await document.fonts.ready
          const fontFace = new FontFace(
            config.fontFamily,
            `url(https://fonts.gstatic.com/s/${googleFontName.toLowerCase().replace(/\+/g, '')}/v*/)`,
          )
          await fontFace.load()
          document.fonts.add(fontFace)
        } catch (error) {
          console.warn(`Fonte ${config.fontFamily} não pôde ser carregada, usando fallback`)
        }
      }
      checkFont()
    }
  }, [config.fontFamily])
  return <></>
}
