"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AppConfig, MarginPreset, Orientation, PageSize, ThemePreset } from "@/types/config";
import { Download, Printer, ZoomIn, ZoomOut } from "lucide-react";
import { FaExpand } from "react-icons/fa6";
import { IoLogoMarkdown } from "react-icons/io5";
import { SettingsDialog } from "./settings-dialog";

interface AppHeaderProps {
  onPrint: () => void;
  onDownloadPDF: () => void;
  config: AppConfig;
  onConfigChange: (config: Partial<AppConfig>) => void;
  onPageSizeChange: (size: PageSize) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onReset: () => void;
  onApplyMarginPreset: (preset: MarginPreset) => void;
  onApplyThemePreset: (preset: ThemePreset) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function AppHeader({
  onPrint,
  onDownloadPDF,
  config,
  onConfigChange,
  onPageSizeChange,
  onOrientationChange,
  onReset,
  onApplyMarginPreset,
  onApplyThemePreset,
  zoom,
  onZoomChange,
}: AppHeaderProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.3));
  };


  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm z-20 relative">
      <div className="flex items-center gap-2">
        <IoLogoMarkdown className="h-5 w-5 text-primary" />
        <span className="font-bold text-foreground">Markdown PDF Pro</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border rounded-md bg-blue-500/20 p-1">
        <div className="flex items-center gap-1 bg-white rounded-md">
          <Button
            variant="ghost"
            onClick={handleZoomOut}
            disabled={zoom <= 0.3}
            className="h-8 w-8 p-0 cursor-pointer bg-background rounded-md flex items-center justify-center"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className={cn("px-2 text-sm text-muted-foreground text-center", "min-w-12!")}>
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            onClick={handleZoomIn}
            disabled={zoom >= 1.5}
            className="h-8 w-8 p-0 cursor-pointer bg-background rounded-md flex items-center justify-center"
          >
            <ZoomIn className="h-4 w-4" />
          </Button></div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(1)}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <FaExpand className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <SettingsDialog
          config={config}
          onConfigChange={onConfigChange}
          onPageSizeChange={onPageSizeChange}
          onOrientationChange={onOrientationChange}
          onReset={onReset}
          onApplyMarginPreset={onApplyMarginPreset}
          onApplyThemePreset={onApplyThemePreset}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

