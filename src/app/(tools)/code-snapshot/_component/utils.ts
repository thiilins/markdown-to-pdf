'use client'
import { PRESET_SIZES } from '@/shared/contexts/codeSnapshotContext'
import { toast } from 'sonner'

// Constantes de zoom
export const MAX_ZOOM = 1.5
export const MIN_ZOOM = 0.3

// SnapshotConfig está definido em types.d.ts como declaração global

/**
 * Calcula as dimensões finais baseado no preset selecionado
 */
export function calculateDimensions(config: SnapshotConfig) {
  const selectedPreset = PRESET_SIZES.find((p) => p.id === config.presetSize) || PRESET_SIZES[0]
  const isCustom = config.presetSize === 'custom'
  const finalWidth = isCustom ? 1024 + config.widthOffset : selectedPreset.width
  const finalHeight = isCustom ? 0 : selectedPreset.height

  return { finalWidth, finalHeight, selectedPreset, isCustom }
}

/**
 * Calcula a altura do header baseado no tema da janela
 */
export function calculateHeaderHeight(windowTheme: SnapshotConfig['windowTheme']): number {
  return windowTheme !== 'none' ? 60 : 0
}

/**
 * Calcula a altura do footer baseado nas configurações
 */
export function calculateFooterHeight(config: SnapshotConfig): number {
  const showLanguageInFooter = config.languagePosition === 'footer'
  const hasCustomText = config.footerCustomText.trim().length > 0
  const hasFooterContent =
    config.showFooter || showLanguageInFooter || hasCustomText || config.footerOptions.length > 0

  return hasFooterContent ? 40 : 0
}

/**
 * Calcula a altura disponível para o código
 */
export function calculateAvailableCodeHeight(
  finalHeight: number,
  padding: number,
  headerHeight: number,
  footerHeight: number,
): number {
  return finalHeight > 0 ? finalHeight - padding * 2 - headerHeight - footerHeight : 0
}

/**
 * Calcula o zoom inicial responsivo
 */
export function calculateInitialZoom(params: {
  screenWidth: number
  screenHeight: number
  finalWidth: number
  finalHeight: number
  currentScale?: number
  forceReset?: boolean
}): number {
  const {
    screenWidth,
    screenHeight,
    finalWidth,
    finalHeight,
    currentScale,
    forceReset = false,
  } = params

  const baseWidth = 1920
  const minWidth = 400
  const maxZoom = 1
  const minZoom = MIN_ZOOM

  if (!forceReset && currentScale && currentScale !== 1) {
    return currentScale
  }

  let calculatedZoom = maxZoom
  if (screenWidth >= baseWidth) {
    calculatedZoom = maxZoom
  } else if (screenWidth <= minWidth) {
    calculatedZoom = minZoom
  } else {
    const ratio = (screenWidth - minWidth) / (baseWidth - minWidth)
    calculatedZoom = minZoom + (maxZoom - minZoom) * ratio
  }

  if (screenWidth < 768 && finalWidth > 0) {
    const availableWidth = screenWidth - 24
    const availableHeight = screenHeight - 150
    const contentWidth = finalWidth
    const contentHeight = finalHeight > 0 ? finalHeight : availableHeight

    const widthZoom = availableWidth / contentWidth
    const heightZoom = contentHeight > 0 ? availableHeight / contentHeight : widthZoom
    const fitZoom = Math.min(widthZoom, heightZoom, 1)

    calculatedZoom = Math.max(minZoom, Math.min(calculatedZoom, fitZoom * 0.95))
  }

  return Math.max(minZoom, Math.min(maxZoom, calculatedZoom))
}

/**
 * Calcula o tamanho de fonte ajustado
 */
export function calculateFontSize(params: {
  actualHeight: number
  maxHeight: number
  baseFontSize: number
}): number {
  const { actualHeight, maxHeight, baseFontSize } = params

  if (actualHeight <= maxHeight) {
    return baseFontSize
  }

  const heightRatio = maxHeight / actualHeight
  return Math.max(baseFontSize * heightRatio * 0.95, baseFontSize * 0.6)
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * HELPER CRÍTICO:
 * Extrai o CSS das fontes manualmente para evitar o erro "SecurityError: cssRules".
 * Se o acesso direto falhar (CORS), tenta buscar o arquivo via fetch.
 */
async function getSafeFontEmbedCSS(): Promise<string> {
  const styles = await Promise.all(
    Array.from(document.styleSheets).map(async (sheet) => {
      try {
        // Tenta acessar as regras diretamente (rápido, funciona para estilos locais)
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('')
      } catch (e) {
        // Se falhar (CORS/SecurityError), tenta buscar o conteúdo via URL
        if (sheet.href) {
          try {
            const response = await fetch(sheet.href)
            if (response.ok) {
              return await response.text()
            }
          } catch (fetchErr) {
            console.warn(`Falha ao carregar fonte externa: ${sheet.href}`, fetchErr)
          }
        }
        return ''
      }
    }),
  )
  return styles.join('\n')
}

/**
 * Processa uma imagem para exportação
 */
export async function processImage(
  element: HTMLElement | null,
  action: 'blob' | 'png',
): Promise<Blob | string | null> {
  if (!element) return null

  await document.fonts.ready
  await new Promise((resolve) => setTimeout(resolve, 300))

  const { toBlob, toPng } = await import('html-to-image')

  const filter = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      const tagName = el.tagName?.toLowerCase()
      if (['script', 'iframe', 'object', 'embed'].includes(tagName)) {
        return false
      }
    }
    return true
  }

  // 1. Prepara o CSS das fontes antecipadamente de forma segura
  const fontCss = await getSafeFontEmbedCSS()

  // Opções de ALTA FIDELIDADE
  const highQualityOptions = {
    cacheBust: true,
    pixelRatio: 3,
    filter,
    useCORS: true,
    // Aqui está o segredo: Passamos o CSS processado manualmente.
    // Isso impede a lib de tentar ler cssRules sozinha e quebrar.
    fontEmbedCSS: fontCss,
  }

  try {
    return action === 'blob'
      ? await toBlob(element, highQualityOptions)
      : await toPng(element, highQualityOptions)
  } catch (error: any) {
    console.warn('Erro na geração HD, tentando fallback seguro:', error)

    // Fallback de SEGURANÇA (Se tudo der errado, gera sem as fontes externas para não travar o app)
    // É melhor ter uma imagem com fonte padrão do que nenhuma imagem.
    const safeOptions = {
      cacheBust: true,
      pixelRatio: 2,
      filter,
      useCORS: false,
      skipFonts: true, // Pula fontes no fallback
      fontEmbedCSS: '', // Limpa CSS no fallback
      onclone: (clonedDoc: Document) => {
        const styleLinks = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'))
        styleLinks.forEach((link) => link.remove())
      },
    }

    return action === 'blob'
      ? await toBlob(element, safeOptions)
      : await toPng(element, safeOptions)
  }
}

/**
 * Baixa a imagem do snippet
 */
export const onDownload = async (ref: React.RefObject<HTMLDivElement | null>) => {
  try {
    const dataUrl = (await processImage(ref.current, 'png')) as string
    if (!dataUrl) {
      throw new Error('Falha ao gerar imagem')
    }
    const link = document.createElement('a')
    link.download = `snippet-${new Date().toISOString().slice(0, 10)}.png`
    link.href = dataUrl
    link.click()
    toast.success('Snippet salvo com sucesso!')
  } catch (err: any) {
    console.error('Erro ao exportar imagem:', err)
    toast.error('Não foi possível gerar a imagem. Tente novamente.')
  }
}

/**
 * Copia a imagem do snippet para a área de transferência
 */
export const onCopyImage = async (ref: React.RefObject<HTMLDivElement | null>) => {
  try {
    const blob = (await processImage(ref.current, 'blob')) as Blob
    if (!blob) {
      throw new Error('Falha ao gerar imagem')
    }

    // Garante que o documento está focado antes de copiar
    if (document.hasFocus() === false) {
      window.focus()
      // Pequeno delay para garantir que o foco foi aplicado
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Tenta copiar para a área de transferência
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    toast.success('Copiado para a área de transferência!')
  } catch (err: any) {
    console.error('Erro ao copiar imagem:', err)

    // Se falhar por falta de foco, tenta novamente após um pequeno delay
    if (err?.name === 'NotAllowedError' || err?.message?.includes('not focused')) {
      try {
        window.focus()
        await new Promise((resolve) => setTimeout(resolve, 200))
        const blob = (await processImage(ref.current, 'blob')) as Blob
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          toast.success('Copiado para a área de transferência!')
          return
        }
      } catch (retryErr) {
        console.error('Erro ao copiar após retry:', retryErr)
      }
    }

    toast.error('Não foi possível copiar a imagem.')
  }
}

/**
 * Gera a configuração de conteúdo
 */
export const generateContentConfig = (config: SnapshotConfig) => {
  const { finalHeight } = calculateDimensions(config)
  const headerHeight = calculateHeaderHeight(config.windowTheme)
  const footerHeight = calculateFooterHeight(config)
  const availableCodeHeight = calculateAvailableCodeHeight(
    finalHeight,
    config.padding,
    headerHeight,
    footerHeight,
  )
  return {
    availableCodeHeight,
    headerHeight,
    footerHeight,
  }
}
