"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TabsContent } from "@/components/ui/tabs";
import { AppConfig } from "@/types/config";
import { Code, Heading1, Heading2, Maximize2, Minus, Quote, Type } from "lucide-react";
import { FontSelectComponent } from "../font-select";

export const TypographyConfigComponent = (
  {
    value,
    config,
    onConfigChange,
  }: {
    value: string;
    config: AppConfig;
    onConfigChange: (config: Partial<AppConfig>) => void;
  }
) => {
  const fontColors = {
    headings: "bg-violet-500/10 text-violet-600 border-violet-200 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-800",
    body: "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
    code: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
    quote: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  };

  return (
    <TabsContent value={value} className="space-y-4 mt-4">
      {/* Fontes - Layout em Grid */}
      <div className="rounded-xl border-2 border-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 bg-linear-to-br p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 text-white">
            <Type className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Fontes</h3>
            <p className="text-xs text-muted-foreground">Selecione as fontes para cada elemento</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Heading1 className="h-3.5 w-3.5" />
                Títulos
              </Label>
              <Badge className={`${fontColors.headings} border text-xs px-2 py-0.5 font-medium`}>
                {config.typography.headings.split(" ")[0]}
              </Badge>
            </div>
            <FontSelectComponent
              value={config.typography.headings}
              label=""
              key="headings"
              onChange={(value) =>
                onConfigChange({
                  typography: { ...config.typography, headings: value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" />
                Corpo
              </Label>
              <Badge className={`${fontColors.body} border text-xs px-2 py-0.5 font-medium`}>
                {config.typography.body.split(" ")[0]}
              </Badge>
            </div>
            <FontSelectComponent
              value={config.typography.body}
              label=""
              key="body"
              onChange={(value) => onConfigChange({ typography: { ...config.typography, body: value } })}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5" />
                Código
              </Label>
              <Badge className={`${fontColors.code} border text-xs px-2 py-0.5 font-medium`}>
                {config.typography.code.split(" ")[0]}
              </Badge>
            </div>
            <FontSelectComponent
              value={config.typography.code}
              label=""
              key="code"
              onChange={(value) =>
                onConfigChange({
                  typography: { ...config.typography, code: value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Quote className="h-3.5 w-3.5" />
                Citações
              </Label>
              <Badge className={`${fontColors.quote} border text-xs px-2 py-0.5 font-medium`}>
                {config.typography.quote.split(" ")[0]}
              </Badge>
            </div>
            <FontSelectComponent
              value={config.typography.quote}
              label=""
              key="quote"
              onChange={(value) =>
                onConfigChange({
                  typography: { ...config.typography, quote: value },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Tamanhos - Sliders Modernos */}
      <div className="rounded-xl border-2 border-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 bg-linear-to-br p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-rose-500 to-pink-600 text-white">
            <Maximize2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Tamanhos</h3>
            <p className="text-xs text-muted-foreground">Ajuste os tamanhos de fonte</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tamanho Base */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Minus className="h-3.5 w-3.5" />
                Base
              </Label>
              <Badge className="bg-rose-500/10 text-rose-600 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-800 border text-xs px-2 py-0.5 font-semibold">
                {config.typography.baseSize}px
              </Badge>
            </div>
            <Slider
              value={[config.typography.baseSize]}
              onValueChange={([value]) =>
                onConfigChange({
                  typography: { ...config.typography, baseSize: value },
                })
              }
              min={10}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* H1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Heading1 className="h-3.5 w-3.5" />
                H1
              </Label>
              <Badge className="bg-violet-500/10 text-violet-600 border-violet-200 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-800 border text-xs px-2 py-0.5 font-semibold">
                {config.typography.h1Size}px
              </Badge>
            </div>
            <Slider
              value={[config.typography.h1Size]}
              onValueChange={([value]) =>
                onConfigChange({
                  typography: { ...config.typography, h1Size: value },
                })
              }
              min={20}
              max={40}
              step={1}
              className="w-full"
            />
          </div>

          {/* H2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Heading2 className="h-3.5 w-3.5" />
                H2
              </Label>
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800 border text-xs px-2 py-0.5 font-semibold">
                {config.typography.h2Size}px
              </Badge>
            </div>
            <Slider
              value={[config.typography.h2Size]}
              onValueChange={([value]) =>
                onConfigChange({
                  typography: { ...config.typography, h2Size: value },
                })
              }
              min={16}
              max={32}
              step={1}
              className="w-full"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Minus className="h-3.5 w-3.5 rotate-90" />
                Altura da Linha
              </Label>
              <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-800 border text-xs px-2 py-0.5 font-semibold">
                {config.typography.lineHeight.toFixed(1)}
              </Badge>
            </div>
            <Slider
              value={[config.typography.lineHeight]}
              onValueChange={([value]) =>
                onConfigChange({
                  typography: { ...config.typography, lineHeight: value },
                })
              }
              min={1.2}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
