import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import type { PageConfig } from "@/types/config";

/**
 * Converte mm para pixels (assumindo 96 DPI)
 */
function mmToPx(mm: string): number {
  const mmValue = parseFloat(mm);
  return (mmValue * 96) / 25.4;
}


/**
 * Gera PDF a partir do elemento HTML usando html2canvas e jsPDF
 */
export async function generatePDF(
  element: HTMLElement,
  pageConfig: PageConfig,
  filename: string = "documento-exportado.pdf"
): Promise<void> {
  // Salva estados originais
  const originalTransform = element.style.transform;
  const originalScale = element.style.scale;
  const originalWidth = element.style.width;
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflow;
  const originalInlineBg = element.style.backgroundColor;

  // Remove zoom e transformações temporariamente para captura
  element.style.transform = "none";
  element.style.scale = "1";
  element.style.overflow = "visible";

  // Calcula dimensões
  const pageWidthMm = parseFloat(pageConfig.width);
  const pageHeightMm = parseFloat(pageConfig.height);
  const marginTop = parseFloat(pageConfig.margin.top);
  const marginRight = parseFloat(pageConfig.margin.right);
  const marginBottom = parseFloat(pageConfig.margin.bottom);
  const marginLeft = parseFloat(pageConfig.margin.left);

  // Largura e altura do conteúdo (sem margens)
  const contentWidthMm = pageWidthMm - marginLeft - marginRight;
  const contentHeightMm = pageHeightMm - marginTop - marginBottom;

  try {
    // html2canvas-pro suporta oklch/lab nativamente, então não precisa converter cores
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ignoreElements: (el) => {
        if (el instanceof HTMLImageElement) {
          if (!el.complete || el.naturalWidth === 0) {
            return true;
          }
        }
        return false;
      },
    });

    // Cria o PDF
    const pdf = new jsPDF({
      orientation: pageConfig.orientation === "landscape" ? "landscape" : "portrait",
      unit: "mm",
      format: [pageWidthMm, pageHeightMm],
      compress: true,
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgAspectRatio = imgWidth / imgHeight;

    // Calcula dimensões da imagem no PDF (em mm)
    const imgWidthMm = contentWidthMm;
    const imgHeightMm = imgWidthMm / imgAspectRatio;

    // Calcula quantas páginas serão necessárias
    const pagesNeeded = Math.ceil(imgHeightMm / contentHeightMm);

    for (let page = 0; page < pagesNeeded; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // Calcula a posição Y inicial para esta página
      const sourceY = (imgHeight / pagesNeeded) * page;
      const sourceHeight = Math.min(
        imgHeight / pagesNeeded,
        imgHeight - sourceY
      );

      // Cria um canvas temporário para esta página
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidth;
      pageCanvas.height = sourceHeight;
      const ctx = pageCanvas.getContext("2d", { willReadFrequently: true });

      if (ctx) {
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
          sourceHeight
        );

        // Converte para imagem
        const imgData = pageCanvas.toDataURL("image/png", 0.95);

        // Calcula altura da imagem para esta página em mm
        const pageImgHeightMm = (sourceHeight * imgWidthMm) / imgWidth;

        // Adiciona a imagem ao PDF
        pdf.addImage(
          imgData,
          "PNG",
          marginLeft,
          marginTop,
          imgWidthMm,
          pageImgHeightMm,
          undefined,
          "FAST"
        );
      }
    }

    // Restaura estados originais
    element.style.transform = originalTransform;
    element.style.scale = originalScale;
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    element.style.backgroundColor = originalInlineBg;

    // Salva o PDF
    pdf.save(filename);
  } catch (error) {
    // Restaura estados originais em caso de erro
    element.style.transform = originalTransform;
    element.style.scale = originalScale;
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    element.style.backgroundColor = originalInlineBg;

    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

