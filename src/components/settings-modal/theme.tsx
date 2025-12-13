'use client'

import { ColorSelectorComponent, GroupComponent } from '@/components/custom-ui/custom-inputs'
import { SelectComponent } from '@/components/custom-ui/select-component'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { THEME_PRESETS } from '@/shared/constants'
import { useConfig } from '@/shared/contexts/configContext'
import { Code, Paintbrush, Palette, Type } from 'lucide-react'

export const ThemeConfigComponent = ({ value }: { value: string }) => {
  const { config, updateConfig, applyThemePreset, getCurrentTheme } = useConfig()
  const currentPreset = getCurrentTheme()

  return (
    <TabsContent value={value} className='mt-4 space-y-4'>
      {/* Preset de Tema */}
      <Card>
        <CardHeader className='mb-3 flex items-center gap-2'>
          <div className='rounded-lg bg-linear-to-br from-fuchsia-500 to-purple-600 p-2 text-white'>
            <Palette className='h-4 w-4' />
          </div>
          <div>
            <h3 className='text-foreground text-sm font-semibold'>Configurações de Tema</h3>
            <p className='text-muted-foreground text-xs'>Configurações de tema do documento</p>
          </div>
        </CardHeader>
        <CardContent className='flex w-full flex-col gap-3'>
          <SelectComponent
            label='Preset de Tema'
            value={currentPreset}
            onValueChange={(value) => applyThemePreset(value as ThemePreset)}
            data={[
              ...Object.entries(THEME_PRESETS)
                .filter(([key]) => key !== 'custom')
                .map(([key, preset]) => ({
                  value: key,
                  label: preset.name,
                })),
              { value: 'custom', label: 'Personalizado' },
            ]}
            className={{
              trigger: 'bg-background/80 backdrop-blur-sm',
              content: 'w-full! flex-1',
            }}
          />
          {config.theme && (
            <div className='space-y-4'>
              {/* Cores Principais */}
              <GroupComponent icon={Paintbrush} label='Cores Principais'>
                <ColorSelectorComponent
                  value={config.theme.background}
                  onColorChange={(value) =>
                    updateConfig({ theme: { ...config.theme!, background: value } })
                  }
                  label='Fundo'
                />
                <ColorSelectorComponent
                  value={config.theme.textColor}
                  onColorChange={(value) =>
                    updateConfig({ theme: { ...config.theme!, textColor: value } })
                  }
                  label='Texto'
                />
              </GroupComponent>
              <GroupComponent icon={Type} label='Tipografia'>
                <ColorSelectorComponent
                  value={config.theme.headingColor}
                  onColorChange={(value) =>
                    updateConfig({ theme: { ...config.theme!, headingColor: value } })
                  }
                  label='Títulos'
                />
                <ColorSelectorComponent
                  value={config.theme.linkColor}
                  onColorChange={(value) =>
                    updateConfig({ theme: { ...config.theme!, linkColor: value } })
                  }
                  label='Links'
                />
              </GroupComponent>
              <GroupComponent icon={Code} label='Blocos de Código'>
                <ColorSelectorComponent
                  value={config.theme.codeBackground}
                  onColorChange={(value) =>
                    updateConfig({ theme: { ...config.theme!, codeBackground: value } })
                  }
                  label='Fundo'
                />
                <ColorSelectorComponent
                  value={config.theme.codeTextColor}
                  onColorChange={(value) =>
                    updateConfig({ theme: { ...config.theme!, codeTextColor: value } })
                  }
                  label='Texto'
                />
              </GroupComponent>

              <div className='border-border border-t pt-2'>
                <Label className='text-muted-foreground mb-2 block text-xs font-medium'>
                  Preview
                </Label>
                <div className='grid grid-cols-3 gap-2'>
                  <div
                    className='border-input flex h-8 items-center justify-center rounded-md border text-xs font-medium'
                    style={{
                      backgroundColor: config.theme.background,
                      color: config.theme.textColor,
                    }}>
                    Fundo
                  </div>
                  <div
                    className='border-input flex h-8 items-center justify-center rounded-md border text-xs font-medium'
                    style={{
                      backgroundColor: config.theme.headingColor,
                      color: config.theme.background,
                    }}>
                    Títulos
                  </div>
                  <div
                    className='border-input flex h-8 items-center justify-center rounded-md border text-xs font-medium'
                    style={{
                      backgroundColor: config.theme.codeBackground,
                      color: config.theme.codeTextColor,
                    }}>
                    Código
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
