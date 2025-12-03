"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { AppConfig } from "@/types/config";
import { Code, Eye, EyeOff, Maximize2, Monitor, Moon, Sun, Type } from "lucide-react";

export const EditorConfigComponent = (
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
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="h-3.5 w-3.5" />;
      case "dark":
        return <Moon className="h-3.5 w-3.5" />;
      case "auto":
        return <Monitor className="h-3.5 w-3.5" />;
      default:
        return <Monitor className="h-3.5 w-3.5" />;
    }
  };

  const getThemeLabel = (theme: string) => {
    switch (theme) {
      case "light":
        return "Claro";
      case "dark":
        return "Escuro";
      case "auto":
        return "Automático";
      default:
        return "Automático";
    }
  };

  return (
    <TabsContent value={value} className="space-y-4 mt-4">
      {/* Tema do Editor */}
      <div className="rounded-xl border-2 border-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 bg-linear-to-br p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-linear-to-br from-slate-500 to-gray-600 text-white">
            <Code className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Tema do Editor</h3>
            <p className="text-xs text-muted-foreground">Aparência do editor de código</p>
          </div>
        </div>
        <Select
          value={config.editor.theme}
          onValueChange={(value) =>
            onConfigChange({
              editor: { ...config.editor, theme: value as "light" | "dark" | "auto" },
            })
          }
        >
          <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Claro
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Escuro
              </div>
            </SelectItem>
            <SelectItem value="auto">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Automático
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800">
          {getThemeIcon(config.editor.theme)}
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Tema atual: <span className="font-semibold">{getThemeLabel(config.editor.theme)}</span>
          </p>
        </div>
      </div>

      {/* Configurações de Visualização */}
      <div className="rounded-xl border-2 border-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 bg-linear-to-br p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-blue-600 text-white">
            <Maximize2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Visualização</h3>
            <p className="text-xs text-muted-foreground">Ajuste a aparência do editor</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tamanho da Fonte */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" />
                Tamanho da Fonte
              </Label>
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800 border text-xs px-2 py-0.5 font-semibold">
                {config.editor.fontSize}px
              </Badge>
            </div>
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
              className="w-full"
            />
          </div>

          {/* Quebra de Linha */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" />
              Quebra de Linha
            </Label>
            <Select
              value={config.editor.wordWrap}
              onValueChange={(value) =>
                onConfigChange({
                  editor: { ...config.editor, wordWrap: value as any },
                })
              }
            >
              <SelectTrigger className="h-9 bg-background/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on">Ativado</SelectItem>
                <SelectItem value="off">Desativado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Opções Avançadas */}
      <div className="rounded-xl border-2 border-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 bg-linear-to-br p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-white">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Opções Avançadas</h3>
            <p className="text-xs text-muted-foreground">Recursos adicionais do editor</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Minimap */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2">
              {config.editor.minimap ? (
                <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <Label className="text-sm font-medium cursor-pointer">Minimap</Label>
                <p className="text-xs text-muted-foreground">Visualização em miniatura do código</p>
              </div>
            </div>
            <Switch
              checked={config.editor.minimap}
              onCheckedChange={(checked) =>
                onConfigChange({
                  editor: { ...config.editor, minimap: checked },
                })
              }
            />
          </div>

          {/* Números de Linha */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">Números de Linha</Label>
                <p className="text-xs text-muted-foreground">Exibir numeração das linhas</p>
              </div>
            </div>
            <Select
              value={config.editor.lineNumbers}
              onValueChange={(value) =>
                onConfigChange({
                  editor: { ...config.editor, lineNumbers: value as any },
                })
              }
            >
              <SelectTrigger className="h-8 w-24 bg-background/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on">Ativado</SelectItem>
                <SelectItem value="off">Desativado</SelectItem>
                <SelectItem value="relative">Relativo</SelectItem>
                <SelectItem value="interval">Intervalo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
