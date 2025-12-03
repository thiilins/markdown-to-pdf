"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PageConfig, ThemeConfig, TypographyConfig } from "@/types/config";
import { THEME_PRESETS } from "@/types/config";
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

  const getPageStyle = () => {
    const { width, height, padding, orientation } = pageConfig;
    const pageWidth = orientation === "landscape" ? height : width;
    const pageHeight = orientation === "landscape" ? width : height;

    return {
      width: pageWidth,
      minHeight: pageHeight,
      padding,
      boxSizing: "border-box" as const,
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
      "--line-height": String(typographyConfig.lineHeight),
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

  return (
    <ScrollArea className={cn("h-full w-full print:hidden", className)}>
      <div className="flex flex-col items-center p-8 bg-muted/30 print:p-0 print:bg-transparent">
        {/* Página única que cresce conforme o conteúdo */}
        <div
          ref={contentRef}
          data-pdf-content
          className="bg-white shadow-xl transition-all origin-top text-left print:shadow-none print:transform-none print:scale-100 print-content"
          style={{
            ...getPageStyle(),
            backgroundColor: theme.background,
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
        >
          <div
            className="prose prose-slate max-w-none"
            style={{
              ...getTypographyStyles(),
              ...getContentStyle(),
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

        <div className="mt-6 text-xs font-medium text-muted-foreground uppercase tracking-widest print:hidden">
          {pageConfig.size.toUpperCase()} Preview • {pageConfig.width} × {pageConfig.height}
          {pageConfig.orientation === "landscape" && " • Landscape"}
        </div>
      </div>
    </ScrollArea>
  );
}

