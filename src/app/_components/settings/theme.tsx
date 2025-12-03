"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import type { AppConfig, ThemePreset } from "@/types/config";
import { THEME_PRESETS } from "@/types/config";
import { Code, Link2, Paintbrush, Palette, Sparkles, Type } from "lucide-react";

export const ThemeConfigComponent = (
  {
    getCurrentThemePreset,
    value,
    config,
    onConfigChange,
    onApplyThemePreset,
  }: {
    getCurrentThemePreset: () => ThemePreset;
    value: string;
    onApplyThemePreset: (preset: ThemePreset) => void;
    config: AppConfig;
    onConfigChange: (config: Partial<AppConfig>) => void;
  }
) => {
  const currentPreset = getCurrentThemePreset();
  const isCustom = currentPreset === "custom";

  return (
    <TabsContent value={value} className="space-y-4 mt-4">
      {/* Preset de Tema */}
      <div className="rounded-xl border-2 border-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/30 dark:to-purple-950/30 bg-linear-to-br p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-linear-to-br from-fuchsia-500 to-purple-600 text-white">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Preset de Tema</h3>
            <p className="text-xs text-muted-foreground">Escolha um tema pré-configurado</p>
          </div>
        </div>
        <Select
          value={currentPreset}
          onValueChange={(value) => onApplyThemePreset(value as ThemePreset)}
        >
          <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(THEME_PRESETS)
              .filter(([key]) => key !== "custom")
              .map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.name}
                </SelectItem>
              ))}
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
        {!isCustom && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-100/50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
            <p className="text-xs text-fuchsia-700 dark:text-fuchsia-300">
              {THEME_PRESETS[currentPreset].description}
            </p>
          </div>
        )}
      </div>

      {/* Cores Personalizadas */}
      {config.theme && (
        <div className="rounded-xl border-2 border-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 bg-linear-to-br p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 text-white">
              <Paintbrush className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Cores Personalizadas</h3>
              <p className="text-xs text-muted-foreground">Ajuste as cores do documento</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Cores Principais */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Paintbrush className="h-3.5 w-3.5" />
                Cores Principais
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Fundo */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.theme.background}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, background: e.target.value },
                        })
                      }
                      className="w-12 h-9 rounded-md cursor-pointer border border-input"
                    />
                    <Input
                      type="text"
                      value={config.theme.background}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, background: e.target.value },
                        })
                      }
                      placeholder="#ffffff"
                      className="flex-1 h-9 bg-background/80 backdrop-blur-sm text-xs"
                    />
                  </div>
                </div>

                {/* Texto */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.theme.textColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, textColor: e.target.value },
                        })
                      }
                      className="w-12 h-9 rounded-md cursor-pointer border border-input"
                    />
                    <Input
                      type="text"
                      value={config.theme.textColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, textColor: e.target.value },
                        })
                      }
                      placeholder="#000000"
                      className="flex-1 h-9 bg-background/80 backdrop-blur-sm text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cores de Tipografia */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" />
                Tipografia
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Títulos */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Títulos</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.theme.headingColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, headingColor: e.target.value },
                        })
                      }
                      className="w-12 h-9 rounded-md cursor-pointer border border-input"
                    />
                    <Input
                      type="text"
                      value={config.theme.headingColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, headingColor: e.target.value },
                        })
                      }
                      placeholder="#1a1a1a"
                      className="flex-1 h-9 bg-background/80 backdrop-blur-sm text-xs"
                    />
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Link2 className="h-3 w-3" />
                    Links
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.theme.linkColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, linkColor: e.target.value },
                        })
                      }
                      className="w-12 h-9 rounded-md cursor-pointer border border-input"
                    />
                    <Input
                      type="text"
                      value={config.theme.linkColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, linkColor: e.target.value },
                        })
                      }
                      placeholder="#0066cc"
                      className="flex-1 h-9 bg-background/80 backdrop-blur-sm text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cores de Código */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5" />
                Blocos de Código
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Fundo do Código */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.theme.codeBackground}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, codeBackground: e.target.value },
                        })
                      }
                      className="w-12 h-9 rounded-md cursor-pointer border border-input"
                    />
                    <Input
                      type="text"
                      value={config.theme.codeBackground}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, codeBackground: e.target.value },
                        })
                      }
                      placeholder="#f5f5f5"
                      className="flex-1 h-9 bg-background/80 backdrop-blur-sm text-xs"
                    />
                  </div>
                </div>

                {/* Texto do Código */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.theme.codeTextColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, codeTextColor: e.target.value },
                        })
                      }
                      className="w-12 h-9 rounded-md cursor-pointer border border-input"
                    />
                    <Input
                      type="text"
                      value={config.theme.codeTextColor}
                      onChange={(e) =>
                        onConfigChange({
                          theme: { ...config.theme!, codeTextColor: e.target.value },
                        })
                      }
                      placeholder="#333333"
                      className="flex-1 h-9 bg-background/80 backdrop-blur-sm text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview das Cores */}
            <div className="pt-2 border-t border-border">
              <Label className="text-xs font-medium text-muted-foreground mb-2 block">Preview</Label>
              <div className="grid grid-cols-3 gap-2">
                <div
                  className="h-8 rounded-md border border-input flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: config.theme.background,
                    color: config.theme.textColor,
                  }}
                >
                  Fundo
                </div>
                <div
                  className="h-8 rounded-md border border-input flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: config.theme.headingColor,
                    color: config.theme.background,
                  }}
                >
                  Títulos
                </div>
                <div
                  className="h-8 rounded-md border border-input flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: config.theme.codeBackground,
                    color: config.theme.codeTextColor,
                  }}
                >
                  Código
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </TabsContent>
  );
};
