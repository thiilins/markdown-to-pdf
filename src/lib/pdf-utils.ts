import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import type { PageConfig, ThemeConfig } from '@/types/config'
import { THEME_PRESETS } from '@/types/config'

/**
 * Gera PDF a partir do elemento HTML usando html2canvas e jsPDF
 */
export async function generatePDF(
  element: HTMLElement,
  pageConfig: PageConfig,
  filename: string = 'documento-exportado.pdf',
  themeConfig?: ThemeConfig,
): Promise<void> {
  const theme = themeConfig || THEME_PRESETS.modern

  // Encontra o elemento pai que pode ter transform (wrapper do zoom)
  let parentElement: HTMLElement | null = element.parentElement
  const originalParentTransform = parentElement?.style.transform || ''
  const originalParentScale = parentElement?.style.scale || ''

  // Salva estados originais do elemento
  const originalTransform = element.style.transform
  const originalScale = element.style.scale
  const originalWidth = element.style.width
  const originalHeight = element.style.height
  const originalOverflow = element.style.overflow
  const originalInlineBg = element.style.backgroundColor
  const originalPosition = element.style.position

  // Remove zoom e transformações temporariamente para captura
  if (parentElement) {
    parentElement.style.transform = 'none'
    parentElement.style.scale = '1'
  }
  element.style.transform = 'none'
  element.style.scale = '1'
  element.style.overflow = 'visible'
  element.style.position = 'relative'

  // Calcula dimensões
  const pageWidthMm = parseFloat(pageConfig.width)
  const pageHeightMm = parseFloat(pageConfig.height)
  const marginTop = parseFloat(pageConfig.margin.top)
  const marginRight = parseFloat(pageConfig.margin.right)
  const marginBottom = parseFloat(pageConfig.margin.bottom)
  const marginLeft = parseFloat(pageConfig.margin.left)

  // Largura e altura do conteúdo (sem margens)
  const contentWidthMm = pageWidthMm - marginLeft - marginRight
  const contentHeightMm = pageHeightMm - marginTop - marginBottom

  try {
    // Aguarda múltiplos frames para garantir que o layout está estável
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 100))

    // html2canvas-pro com configurações otimizadas para texto
    const canvas = await html2canvas(element, {
      scale: 3, // Alta qualidade para melhor renderização de texto
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: theme.background,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      // Ignora elementos problemáticos
      ignoreElements: (el) => {
        // Ignora imagens não carregadas
        if (el instanceof HTMLImageElement) {
          if (!el.complete || el.naturalWidth === 0) {
            return true
          }
        }
        // Ignora o indicador de informações
        if (el.classList?.contains('pointer-events-none')) {
          return true
        }
        return false
      },
    })

    // Cria o PDF
    const pdf = new jsPDF({
      orientation: pageConfig.orientation === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pageWidthMm, pageHeightMm],
      compress: true,
    })

    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const imgAspectRatio = imgWidth / imgHeight

    // Calcula dimensões da imagem no PDF (em mm)
    const imgWidthMm = contentWidthMm
    const imgHeightMm = imgWidthMm / imgAspectRatio

    // Calcula quantas páginas serão necessárias
    const pagesNeeded = Math.ceil(imgHeightMm / contentHeightMm)

    for (let page = 0; page < pagesNeeded; page++) {
      if (page > 0) {
        pdf.addPage()
      }

      // Calcula a posição Y inicial para esta página (em pixels do canvas)
      const sourceY = Math.floor((imgHeight / pagesNeeded) * page)
      // Calcula a altura da fonte (em pixels do canvas)
      const sourceHeight = Math.ceil(
        page < pagesNeeded - 1 ? imgHeight / pagesNeeded : imgHeight - sourceY,
      )

      // Cria um canvas temporário para esta página
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = imgWidth
      pageCanvas.height = sourceHeight
      const ctx = pageCanvas.getContext('2d', {
        willReadFrequently: true,
        alpha: false, // Melhora performance
      })

      if (ctx) {
        // Configura qualidade de renderização
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Copia a parte relevante do canvas original
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          imgWidth,
          sourceHeight,
          0,
          0,
          imgWidth,
          sourceHeight,
        )

        // Converte para imagem com qualidade máxima
        const imgData = pageCanvas.toDataURL('image/png', 1.0)

        // Calcula altura da imagem para esta página em mm
        const pageImgHeightMm = (sourceHeight * imgWidthMm) / imgWidth

        // Adiciona a imagem ao PDF com qualidade máxima
        pdf.addImage(
          imgData,
          'PNG',
          marginLeft,
          marginTop,
          imgWidthMm,
          pageImgHeightMm,
          undefined,
          'SLOW', // Usa 'SLOW' para melhor qualidade
        )
      }
    }

    // Restaura estados originais
    if (parentElement) {
      parentElement.style.transform = originalParentTransform
      parentElement.style.scale = originalParentScale
    }
    element.style.transform = originalTransform
    element.style.scale = originalScale
    element.style.width = originalWidth
    element.style.height = originalHeight
    element.style.overflow = originalOverflow
    element.style.backgroundColor = originalInlineBg
    element.style.position = originalPosition

    // Salva o PDF
    pdf.save(filename)
  } catch (error) {
    // Restaura estados originais em caso de erro
    if (parentElement) {
      parentElement.style.transform = originalParentTransform
      parentElement.style.scale = originalParentScale
    }
    element.style.transform = originalTransform
    element.style.scale = originalScale
    element.style.width = originalWidth
    element.style.height = originalHeight
    element.style.overflow = originalOverflow
    element.style.backgroundColor = originalInlineBg
    element.style.position = originalPosition

    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}
