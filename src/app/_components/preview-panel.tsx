"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PageConfig, ThemeConfig, TypographyConfig } from "@/types/config";
import { THEME_PRESETS } from "@/types/config";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { PreviewStyle } from "./preview-style";

interface PreviewPanelProps {
  markdown: string;
  pageConfig: PageConfig;
  typographyConfig: TypographyConfig;
  themeConfig?: ThemeConfig;
  zoom?: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function PreviewPanel({
  markdown,
  pageConfig,
  typographyConfig,
  themeConfig,
  zoom = 1,
  contentRef,
  className,
}: PreviewPanelProps) {
  // Usa tema padrão se não houver tema configurado
  const theme = themeConfig || THEME_PRESETS.classic;
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // Calcula dimensões da página
  const getPageDimensions = () => {
    const { width, height, padding, margin, orientation } = pageConfig;
    const pageWidth = orientation === "landscape" ? height : width;
    const pageHeight = orientation === "landscape" ? width : height;

    // Converte mm para pixels (assumindo 96 DPI)
    const mmToPx = (mm: string) => {
      const mmValue = parseFloat(mm);
      return (mmValue * 96) / 25.4;
    };

    const widthPx = mmToPx(pageWidth);
    const heightPx = mmToPx(pageHeight);
    const paddingPx = mmToPx(padding);
    const marginTopPx = mmToPx(margin.top);
    const marginBottomPx = mmToPx(margin.bottom);

    // Altura útil do conteúdo (altura da página - margens - padding)
    const contentHeightPx = heightPx - marginTopPx - marginBottomPx - (paddingPx * 2);

    return {
      widthPx,
      heightPx,
      contentHeightPx,
      paddingPx,
      marginTopPx,
      marginBottomPx,
    };
  };

  const dimensions = getPageDimensions();

  // Calcula número de páginas baseado no conteúdo
  useEffect(() => {
    if (measureRef.current) {
      const contentHeight = measureRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(contentHeight / dimensions.contentHeightPx));
      setPageCount(pages);
    }
  }, [markdown, dimensions.contentHeightPx]);

  const getPageStyle = () => {
    const { width, height, padding, orientation } = pageConfig;
    const pageWidth = orientation === "landscape" ? height : width;
    const pageHeight = orientation === "landscape" ? width : height;

    return {
      width: pageWidth,
      height: pageHeight,
      padding,
      boxSizing: "border-box" as const,
      transform: `scale(${zoom})`,
      transformOrigin: "top center",
    };
  };

  const getContentStyle = () => {
    const { margin } = pageConfig;
    return {
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    };
  };

  const getTypographyStyles = () => {
    return {
      "--font-headings": typographyConfig.headings,
      "--font-body": typographyConfig.body,
      "--font-code": typographyConfig.code,
      "--font-quote": typographyConfig.quote,
      "--base-size": `${typographyConfig.baseSize}px`,
      "--h1-size": `${typographyConfig.h1Size}px`,
      "--h2-size": `${typographyConfig.h2Size}px`,
      "--h3-size": `${typographyConfig.h3Size}px`,
      "--line-height": typographyConfig.lineHeight,
    } as React.CSSProperties;
  };

  // Componentes customizados para ReactMarkdown
  const markdownComponents: Components = {
    // Renderiza quebras de página
    div: ({ node, className, children, ...props }) => {
      if (className === "page-break") {
        return <div className="page-break" {...props} />;
      }
      return <div className={className} {...props}>{children}</div>;
    },
    // Melhora renderização de código
    pre: ({ node, children, ...props }) => {
      return (
        <pre {...props} style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {children}
        </pre>
      );
    },
    code: ({ node, className, children, ...props }: any) => {
      const isInline = !className || !className.includes("language-");
      if (isInline) {
        return <code className={className} {...props}>{children}</code>;
      }
      return (
        <code className={className} {...props} style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {children}
        </code>
      );
    },
  };

  // Renderiza o conteúdo completo (oculto para medir)
  const renderFullContent = () => (
    <div
      ref={measureRef}
      className="prose prose-slate max-w-none"
      style={{
        ...getTypographyStyles(),
        ...getContentStyle(),
        position: "absolute",
        visibility: "hidden",
        width: `${dimensions.widthPx - (dimensions.paddingPx * 2) - (parseFloat(pageConfig.margin.left) * 96 / 25.4) - (parseFloat(pageConfig.margin.right) * 96 / 25.4)}px`,
        top: "-9999px",
        left: "-9999px",
      }}
    >
      <PreviewStyle theme={theme} />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );

  return (
    <ScrollArea className={cn("h-full w-full print:hidden", className)}>
      <div className="flex flex-col items-center p-8 bg-muted/30 print:p-0 print:bg-transparent relative">
        {/* Container oculto para medir o conteúdo */}
        {renderFullContent()}

        {/* Container principal com múltiplas páginas */}
        <div
          ref={contentRef}
          data-pdf-content
          className="print-content"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "center",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
        >
          {/* Renderiza cada página */}
          {Array.from({ length: pageCount }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="bg-white shadow-2xl transition-all origin-top text-left print:shadow-none print:transform-none print:scale-100"
              style={{
                ...getPageStyle(),
                backgroundColor: theme.background,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="prose prose-slate max-w-none"
                style={{
                  ...getTypographyStyles(),
                  ...getContentStyle(),
                  position: "relative",
                  transform: `translateY(-${pageIndex * dimensions.contentHeightPx}px)`,
                  minHeight: `${dimensions.contentHeightPx}px`,
                }}
              >
                <PreviewStyle theme={theme} />
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs font-medium text-muted-foreground uppercase tracking-widest print:hidden">
          {pageConfig.size.toUpperCase()} Preview • {pageConfig.width} × {pageConfig.height}
          {pageConfig.orientation === "landscape" && " • Landscape"} • {pageCount} {pageCount === 1 ? "página" : "páginas"}
        </div>
      </div>
    </ScrollArea>
  );
}

