"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppConfig, MarginPreset, Orientation, PageSize, ThemePreset } from "@/types/config";
import { MARGIN_PRESETS, PAGE_SIZES, THEME_PRESETS } from "@/types/config";
import { RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { FontSelectComponent } from "./font-select";

interface SettingsDialogProps {
  config: AppConfig;
  onConfigChange: (config: Partial<AppConfig>) => void;
  onPageSizeChange: (size: PageSize) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onReset: () => void;
  onApplyMarginPreset: (preset: MarginPreset) => void;
  onApplyThemePreset: (preset: ThemePreset) => void;
}

export function SettingsDialog({
  config,
  onConfigChange,
  onPageSizeChange,
  onOrientationChange,
  onReset,
  onApplyMarginPreset,
  onApplyThemePreset,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false);

  // Detecta qual preset de margem está ativo
  const getCurrentMarginPreset = (): MarginPreset => {
    const current = config.page.margin;
    for (const [key, preset] of Object.entries(MARGIN_PRESETS)) {
      if (key === "custom") continue;
      if (
        preset.margin.top === current.top &&
        preset.margin.right === current.right &&
        preset.margin.bottom === current.bottom &&
        preset.margin.left === current.left
      ) {
        return key as MarginPreset;
      }
    }
    return "custom";
  };

  // Detecta qual preset de tema está ativo
  const getCurrentThemePreset = (): ThemePreset => {
    if (!config.theme) return "classic";
    const current = config.theme;
    for (const [key, preset] of Object.entries(THEME_PRESETS)) {
      if (key === "custom") continue;
      if (
        preset.background === current.background &&
        preset.textColor === current.textColor &&
        preset.headingColor === current.headingColor
      ) {
        return key as ThemePreset;
      }
    }
    return "custom";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações do Documento</DialogTitle>
          <DialogDescription>
            Personalize o tamanho da página, tipografia e outras opções de formatação.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="page" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="page">Página</TabsTrigger>
            <TabsTrigger value="typography">Tipografia</TabsTrigger>
            <TabsTrigger value="theme">Tema</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="page" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Tamanho da Página</Label>
              <Select
                value={config.page.size}
                onValueChange={(value) => onPageSizeChange(value as PageSize)}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label>Orientação</Label>
              <Select
                value={config.page.orientation}
                onValueChange={(value) => onOrientationChange(value as Orientation)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Retrato</SelectItem>
                  <SelectItem value="landscape">Paisagem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Preset de Margens</Label>
              <Select
                value={getCurrentMarginPreset()}
                onValueChange={(value) => onApplyMarginPreset(value as MarginPreset)}
              >
                <SelectTrigger>
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
              <p className="text-xs text-muted-foreground">
                {MARGIN_PRESETS[getCurrentMarginPreset()].name === "Personalizada"
                  ? "Configure as margens manualmente abaixo"
                  : `Aplicará: ${MARGIN_PRESETS[getCurrentMarginPreset()].margin.top} em todos os lados`}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Padding</Label>
              <Input
                type="text"
                value={config.page.padding}
                onChange={(e) =>
                  onConfigChange({
                    page: { ...config.page, padding: e.target.value },
                  })
                }
                placeholder="20mm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Margem Superior</Label>
                <Input
                  type="text"
                  value={config.page.margin.top}
                  onChange={(e) =>
                    onConfigChange({
                      page: {
                        ...config.page,
                        margin: { ...config.page.margin, top: e.target.value },
                      },
                    })
                  }
                  placeholder="0mm"
                />
              </div>
              <div className="space-y-2">
                <Label>Margem Direita</Label>
                <Input
                  type="text"
                  value={config.page.margin.right}
                  onChange={(e) =>
                    onConfigChange({
                      page: {
                        ...config.page,
                        margin: { ...config.page.margin, right: e.target.value },
                      },
                    })
                  }
                  placeholder="0mm"
                />
              </div>
              <div className="space-y-2">
                <Label>Margem Inferior</Label>
                <Input
                  type="text"
                  value={config.page.margin.bottom}
                  onChange={(e) =>
                    onConfigChange({
                      page: {
                        ...config.page,
                        margin: { ...config.page.margin, bottom: e.target.value },
                      },
                    })
                  }
                  placeholder="0mm"
                />
              </div>
              <div className="space-y-2">
                <Label>Margem Esquerda</Label>
                <Input
                  type="text"
                  value={config.page.margin.left}
                  onChange={(e) =>
                    onConfigChange({
                      page: {
                        ...config.page,
                        margin: { ...config.page.margin, left: e.target.value },
                      },
                    })
                  }
                  placeholder="0mm"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">

                <FontSelectComponent
                  value={config.typography.headings}
                  label="Fonte dos Títulos"
                  key="headings"
                  onChange={(value) =>
                    onConfigChange({
                      typography: { ...config.typography, headings: value },
                    })
                  }
                />



                <FontSelectComponent
                  value={config.typography.body}
                  label="Fonte do Corpo"
                  key="body"
                  onChange={(value) => onConfigChange({ typography: { ...config.typography, body: value } })}
                />


                <FontSelectComponent
                  value={config.typography.code}
                  label="Fonte de Código"
                  key="code"
                  onChange={(value) =>
                    onConfigChange({
                      typography: { ...config.typography, code: value },
                    })
                  }
                />

              <FontSelectComponent
                  value={config.typography.quote}
                  label="Fonte de Citações"
                  key="quote"
                  onChange={(value) =>
                    onConfigChange({
                      typography: { ...config.typography, quote: value },
                    })
                  }
               />
               </div>
            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tamanho Base: {config.typography.baseSize}px</Label>
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
                />
              </div>

              <div className="space-y-2">
                <Label>H1: {config.typography.h1Size}px</Label>
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
                />
              </div>

              <div className="space-y-2">
                <Label>H2: {config.typography.h2Size}px</Label>
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
                />
              </div>

              <div className="space-y-2">
                <Label>Altura da Linha: {config.typography.lineHeight.toFixed(1)}</Label>
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
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Preset de Tema</Label>
              <Select
                value={getCurrentThemePreset()}
                onValueChange={(value) => onApplyThemePreset(value as ThemePreset)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name} - {preset.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {THEME_PRESETS[getCurrentThemePreset()].description}
              </p>
            </div>

            {config.theme && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cor de Fundo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.theme.background}
                          onChange={(e) =>
                            onConfigChange({
                              theme: { ...config.theme!, background: e.target.value },
                            })
                          }
                          className="w-16 h-10"
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor do Texto</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.theme.textColor}
                          onChange={(e) =>
                            onConfigChange({
                              theme: { ...config.theme!, textColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor dos Títulos</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.theme.headingColor}
                          onChange={(e) =>
                            onConfigChange({
                              theme: { ...config.theme!, headingColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cor dos Links</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.theme.linkColor}
                          onChange={(e) =>
                            onConfigChange({
                              theme: { ...config.theme!, linkColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Fundo do Código</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.theme.codeBackground}
                          onChange={(e) =>
                            onConfigChange({
                              theme: { ...config.theme!, codeBackground: e.target.value },
                            })
                          }
                          className="w-16 h-10"
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Texto do Código</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.theme.codeTextColor}
                          onChange={(e) =>
                            onConfigChange({
                              theme: { ...config.theme!, codeTextColor: e.target.value },
                            })
                          }
                          className="w-16 h-10"
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="editor" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Tema do Editor</Label>
              <Select
                value={config.editor.theme}
                onValueChange={(value) =>
                  onConfigChange({
                    editor: { ...config.editor, theme: value as "light" | "dark" | "auto" },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tamanho da Fonte: {config.editor.fontSize}px</Label>
              <Slider
                value={[config.editor.fontSize]}
                onValueChange={([value]) =>
                  onConfigChange({
                    editor: { ...config.editor, fontSize: value },
                  })
                }
                min={10}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Quebra de Linha</Label>
              <Select
                value={config.editor.wordWrap}
                onValueChange={(value) =>
                  onConfigChange({
                    editor: { ...config.editor, wordWrap: value as any },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">Ativado</SelectItem>
                  <SelectItem value="off">Desativado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
          <Button onClick={() => setOpen(false)}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

