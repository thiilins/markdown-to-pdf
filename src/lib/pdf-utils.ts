// src/lib/pdf-utils.ts
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

interface PageSettings {
  orientation: 'portrait' | 'landscape'
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }
}

interface PDFOptions {
  singlePage?: boolean // Se true, gera uma única página contínua (sem cortes)
}

export async function generateProfessionalPDF(
  element: HTMLElement,
  pageConfig: PageSettings,
  filename: string = 'documento.pdf',
  themeConfig?: { background: string; textColor: string },
  options?: PDFOptions,
): Promise<void> {
  const { singlePage = false } = options || {}

  // 1. Clone e preparação
  const clone = element.cloneNode(true) as HTMLElement

  // Remove elementos que não devem aparecer no PDF
  const elementsToRemove = clone.querySelectorAll('#copy-code-button, [data-pdf-hide]')
  elementsToRemove.forEach((el) => el.remove())

  // 2. Configurações
  const bgColor = themeConfig?.background || '#ffffff'
  const marginTop = parseFloat(pageConfig.margin.top) || 10
  const marginRight = parseFloat(pageConfig.margin.right) || 10
  const marginBottom = parseFloat(pageConfig.margin.bottom) || 10
  const marginLeft = parseFloat(pageConfig.margin.left) || 10

  // Largura do conteúdo em pixels
  const contentWidthPx = 794

  // Estiliza o clone
  clone.style.width = `${contentWidthPx}px`
  clone.style.padding = `${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm`
  clone.style.backgroundColor = bgColor
  clone.style.color = themeConfig?.textColor || '#000000'
  clone.style.boxSizing = 'border-box'
  clone.style.position = 'fixed'
  clone.style.left = '-20000px'
  clone.style.top = '0'

  // Adiciona ao DOM para renderização
  document.body.appendChild(clone)

  try {
    // 3. Captura com html2canvas-pro (suporta oklch/lab)
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: bgColor,
      width: contentWidthPx,
      logging: false,
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const imgData = canvas.toDataURL('image/jpeg', 0.95)

    if (singlePage) {
      // MODO PÁGINA ÚNICA: Uma página do tamanho do conteúdo
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [imgWidth, imgHeight],
        compress: true,
      })

      pdf.setFillColor(bgColor)
      pdf.rect(0, 0, imgWidth, imgHeight, 'F')
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
      pdf.save(filename)
    } else {
      // MODO PAGINADO: Múltiplas páginas A4
      const pageHeight = 297
      const pdf = new jsPDF({
        orientation: pageConfig.orientation,
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      let heightLeft = imgHeight
      let position = 0

      const drawBackground = () => {
        pdf.setFillColor(bgColor)
        pdf.rect(0, 0, 210, 297, 'F')
      }

      // Primeira página
      drawBackground()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight

      // Páginas subsequentes
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        drawBackground()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight
      }

      pdf.save(filename)
    }
  } catch (error) {
    console.error('Erro na geração do PDF:', error)
    throw error
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone)
    }
  }
}
