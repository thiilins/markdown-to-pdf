"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AppConfig, MarginPreset, Orientation, PageSize } from "@/types/config";
import { MARGIN_PRESETS, PAGE_SIZES } from "@/types/config";
import { TabsContent } from "@radix-ui/react-tabs";
import { FileText, Layout, Maximize2, Ruler, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { convertUnit, extractNumber, extractUnit, type Unit } from "./utils";

export const PageSizeConfigComponent = (
  {
    value,
    config,
    onPageSizeChange,
    onOrientationChange,
    onApplyMarginPreset,
    getCurrentMarginPreset,
    onConfigChange,
  }: {
    value: string;
    config: AppConfig;
    onPageSizeChange: (size: PageSize) => void;
    onOrientationChange: (orientation: Orientation) => void;
    onApplyMarginPreset: (preset: MarginPreset) => void;
    getCurrentMarginPreset: () => MarginPreset;
    onConfigChange: (config: Partial<AppConfig>) => void;
  }
) => {
  // Detecta a unidade atual baseado nos valores existentes
  const detectCurrentUnit = (): Unit => {
    const marginTop = extractUnit(config.page.margin.top);
    const padding = extractUnit(config.page.padding);
    return marginTop || padding || "mm";
  };

  const [unit, setUnit] = useState<Unit>(detectCurrentUnit());

  // Atualiza a unidade quando o componente monta
  useEffect(() => {
    setUnit(detectCurrentUnit());
  }, [config.page.margin.top, config.page.padding]);

  // Extrai apenas os números dos valores atuais
  const getMarginValue = (marginValue: string): number => {
    const num = extractNumber(marginValue);
    const currentUnit = extractUnit(marginValue);
    return convertUnit(num, currentUnit, unit);
  };

  const getPaddingValue = (): number => {
    const num = extractNumber(config.page.padding);
    const currentUnit = extractUnit(config.page.padding);
    return convertUnit(num, currentUnit, unit);
  };

  // Atualiza margem com a unidade selecionada
  const updateMargin = (side: "top" | "right" | "bottom" | "left", numValue: number) => {
    const valueWithUnit = `${numValue}${unit}`;
    onConfigChange({
      page: {
        ...config.page,
        margin: { ...config.page.margin, [side]: valueWithUnit },
      },
    });
  };

  // Atualiza padding com a unidade selecionada
  const updatePadding = (numValue: number) => {
    const valueWithUnit = `${numValue}${unit}`;
    onConfigChange({
      page: { ...config.page, padding: valueWithUnit },
    });
  };

  // Quando a unidade muda, converte todos os valores
  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);

    // Converte todas as margens
    const currentTopUnit = extractUnit(config.page.margin.top);
    const topNum = extractNumber(config.page.margin.top);
    const topConverted = convertUnit(topNum, currentTopUnit, newUnit);

    const currentRightUnit = extractUnit(config.page.margin.right);
    const rightNum = extractNumber(config.page.margin.right);
    const rightConverted = convertUnit(rightNum, currentRightUnit, newUnit);

    const currentBottomUnit = extractUnit(config.page.margin.bottom);
    const bottomNum = extractNumber(config.page.margin.bottom);
    const bottomConverted = convertUnit(bottomNum, currentBottomUnit, newUnit);

    const currentLeftUnit = extractUnit(config.page.margin.left);
    const leftNum = extractNumber(config.page.margin.left);
    const leftConverted = convertUnit(leftNum, currentLeftUnit, newUnit);

    // Converte padding
    const currentPaddingUnit = extractUnit(config.page.padding);
    const paddingNum = extractNumber(config.page.padding);
    const paddingConverted = convertUnit(paddingNum, currentPaddingUnit, newUnit);

    onConfigChange({
      page: {
        ...config.page,
        margin: {
          top: `${topConverted}${newUnit}`,
          right: `${rightConverted}${newUnit}`,
          bottom: `${bottomConverted}${newUnit}`,
          left: `${leftConverted}${newUnit}`,
        },
        padding: `${paddingConverted}${newUnit}`,
      },
    });
  };
  const unitColors = {
    mm: "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
    cm: "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800",
    px: "bg-pink-500/10 text-pink-600 border-pink-200 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-800",
  };

  const unitIcons = {
    mm: "📏",
    cm: "📐",
    px: "💻",
  };

  return (
    <TabsContent value={value} className="space-y-4 mt-4">
      {/* Tamanho e Orientação - Layout Compacto */}
      <div className="rounded-xl border-2 border-gradient-to-br dark:from-blue-950/30 dark:to-indigo-950/30 bg-linear-to-br from-blue-50/50 to-indigo-50/50 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Tamanho & Orientação</h3>
            <p className="text-xs text-muted-foreground">Dimensões do documento</p>
          </div>
        </div>
        <div className="flex flex-row gap-3 w-full">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Tamanho</Label>
            <Select
              value={config.page.size}
              onValueChange={(value) => onPageSizeChange(value as PageSize)}
            >
              <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAGE_SIZES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name} ({value.width} × {value.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Orientação</Label>
            <Select
              value={config.page.orientation}
              onValueChange={(value) => onOrientationChange(value as Orientation)}
            >
              <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Retrato</SelectItem>
                <SelectItem value="landscape">Paisagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 bg-linear-to-br p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-pink-600 text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Unidade</h3>
              <p className="text-xs text-muted-foreground">Aplicada globalmente</p>
            </div>
          </div>
          <Badge className={`${unitColors[unit]} border font-medium px-3 py-1`}>
            {unitIcons[unit]} {unit.toUpperCase()}
          </Badge>
        </div>
        <Select value={unit} onValueChange={(value) => handleUnitChange(value as Unit)}>
          <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mm">Milímetros (mm)</SelectItem>
            <SelectItem value="cm">Centímetros (cm)</SelectItem>
            <SelectItem value="px">Pixels (px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preset de Margens - Visual Moderno */}
      <div className="rounded-xl border-2 border-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 bg-linear-to-br dark:to-teal-950/20 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-white">
            <Layout className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Preset de Margens</h3>
            <p className="text-xs text-muted-foreground">Aplicação rápida</p>
          </div>
        </div>
        <Select
          value={getCurrentMarginPreset()}
          onValueChange={(value) => onApplyMarginPreset(value as MarginPreset)}
        >
          <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MARGIN_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {MARGIN_PRESETS[getCurrentMarginPreset()].name !== "Personalizada" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Aplicará: <span className="font-semibold">{MARGIN_PRESETS[getCurrentMarginPreset()].margin.top}</span> em todos os lados
            </p>
          </div>
        )}
      </div>

      {/* Margens e Padding - Layout Visual */}
      <div className="rounded-xl border-2 border-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 bg-linear-to-br p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-orange-500 to-amber-600 text-white">
            <Maximize2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Espaçamentos</h3>
            <p className="text-xs text-muted-foreground">Margens e padding</p>
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            Padding
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              min="0"
              value={getPaddingValue()}
              onChange={(e) => {
                const numValue = parseFloat(e.target.value) || 0;
                updatePadding(numValue);
              }}
              placeholder="20"
              className="flex-1 h-9 bg-background/80 backdrop-blur-sm border-orange-200 dark:border-orange-800 focus:border-orange-400 dark:focus:border-orange-600"
            />
            <Badge className={`${unitColors[unit]} border min-w-[60px] justify-center h-9 font-medium`}>
              {unit}
            </Badge>
          </div>
        </div>

        {/* Margens - Grid Visual */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Margens
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { side: "top" as const, label: "Superior", icon: "⬆️" },
              { side: "right" as const, label: "Direita", icon: "➡️" },
              { side: "bottom" as const, label: "Inferior", icon: "⬇️" },
              { side: "left" as const, label: "Esquerda", icon: "⬅️" },
            ].map(({ side, label, icon }) => (
              <div key={side} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>{icon}</span>
                  {label}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={getMarginValue(config.page.margin[side])}
                    onChange={(e) => {
                      const numValue = parseFloat(e.target.value) || 0;
                      updateMargin(side, numValue);
                    }}
                    placeholder="0"
                    className="flex-1 h-9 bg-background/80 backdrop-blur-sm border-orange-200 dark:border-orange-800 focus:border-orange-400 dark:focus:border-orange-600"
                  />
                  <Badge className={`${unitColors[unit]} border min-w-[50px] justify-center h-9 text-xs font-medium`}>
                    {unit}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};