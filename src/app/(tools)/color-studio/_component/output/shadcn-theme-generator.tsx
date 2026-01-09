'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import chroma from 'chroma-js'
import { Check, Copy, Download, Palette, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ShadcnTheme {
  // Colors
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
  // Typography
  fontSans: string
  fontSerif: string
  fontMono: string
  // Spacing
  radius: string
  spacing: string
  // Shadows
  shadowX: string
  shadowY: string
  shadowBlur: string
  shadowSpread: string
  shadowOpacity: string
  shadowColor: string
}

interface ShadcnThemeGeneratorProps {
  colors: ColorInfo[]
}

export function ShadcnThemeGenerator({ colors }: ShadcnThemeGeneratorProps) {
  const [lightTheme, setLightTheme] = useState<ShadcnTheme | null>(null)
  const [darkTheme, setDarkTheme] = useState<ShadcnTheme | null>(null)
  const [originalLightTheme, setOriginalLightTheme] = useState<ShadcnTheme | null>(null)
  const [originalDarkTheme, setOriginalDarkTheme] = useState<ShadcnTheme | null>(null)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Gera tema automaticamente baseado nas cores da paleta
  useEffect(() => {
    if (colors.length === 0) return

    const generateTheme = (isDark: boolean): ShadcnTheme => {
      // Usa as cores da paleta como base
      const primary = colors[0]?.hex || '#3B82F6'
      const secondary = colors[1]?.hex || '#8B5CF6'
      const accent = colors[2]?.hex || '#EC4899'
      const destructive = '#EF4444'

      const bg = isDark ? chroma('#09090b') : chroma('#ffffff')
      const fg = isDark ? chroma('#fafafa') : chroma('#09090b')

      return {
        // Colors
        background: toOKLCH(bg),
        foreground: toOKLCH(fg),
        card: toOKLCH(isDark ? bg.brighten(0.2) : bg),
        cardForeground: toOKLCH(fg),
        popover: toOKLCH(isDark ? bg.brighten(0.2) : bg),
        popoverForeground: toOKLCH(fg),
        primary: toOKLCH(chroma(primary)),
        primaryForeground: toOKLCH(
          chroma(primary).luminance() > 0.5 ? chroma('#000') : chroma('#fff'),
        ),
        secondary: toOKLCH(isDark ? bg.brighten(0.3) : chroma(secondary).brighten(2)),
        secondaryForeground: toOKLCH(isDark ? fg : chroma(secondary).darken(2)),
        muted: toOKLCH(isDark ? bg.brighten(0.25) : chroma('#f4f4f5')),
        mutedForeground: toOKLCH(isDark ? fg.darken(0.5) : chroma('#71717a')),
        accent: toOKLCH(isDark ? chroma(accent).darken(1) : chroma(accent).brighten(2)),
        accentForeground: toOKLCH(isDark ? fg : chroma(accent).darken(2)),
        destructive: toOKLCH(chroma(destructive)),
        destructiveForeground: toOKLCH(chroma('#fff')),
        border: toOKLCH(isDark ? bg.brighten(0.4) : chroma('#e4e4e7')),
        input: toOKLCH(isDark ? bg.brighten(0.4) : chroma('#e4e4e7')),
        ring: toOKLCH(chroma(primary)),
        chart1: toOKLCH(chroma(primary)),
        chart2: toOKLCH(chroma(secondary)),
        chart3: toOKLCH(chroma(accent)),
        chart4: toOKLCH(colors[3] ? chroma(colors[3].hex) : chroma(primary).darken(1)),
        chart5: toOKLCH(colors[4] ? chroma(colors[4].hex) : chroma(primary).darken(2)),
        sidebar: toOKLCH(isDark ? bg.brighten(0.1) : chroma('#f4f4f5')),
        sidebarForeground: toOKLCH(fg),
        sidebarPrimary: toOKLCH(chroma(primary)),
        sidebarPrimaryForeground: toOKLCH(
          chroma(primary).luminance() > 0.5 ? chroma('#000') : chroma('#fff'),
        ),
        sidebarAccent: toOKLCH(isDark ? chroma(accent).darken(1) : chroma(accent).brighten(2)),
        sidebarAccentForeground: toOKLCH(isDark ? fg : chroma(accent).darken(2)),
        sidebarBorder: toOKLCH(isDark ? bg.brighten(0.4) : chroma('#e4e4e7')),
        sidebarRing: toOKLCH(chroma(primary)),
        // Typography
        fontSans: 'Inter, system-ui, sans-serif',
        fontSerif: 'Georgia, serif',
        fontMono: 'JetBrains Mono, monospace',
        // Spacing
        radius: '0.5rem',
        spacing: '0.25rem',
        // Shadows
        shadowX: '0px',
        shadowY: '2px',
        shadowBlur: '8px',
        shadowSpread: '0px',
        shadowOpacity: '0.1',
        shadowColor: toHSL(chroma(primary)),
      }
    }

    const light = generateTheme(false)
    const dark = generateTheme(true)

    setLightTheme(light)
    setDarkTheme(dark)
    setOriginalLightTheme(light)
    setOriginalDarkTheme(dark)
  }, [colors])

  const handleReset = useCallback(() => {
    setLightTheme(originalLightTheme)
    setDarkTheme(originalDarkTheme)
    setIsEditing(false)
    toast.success('Tema resetado!')
  }, [originalLightTheme, originalDarkTheme])

  const handleColorChange = useCallback(
    (mode: 'light' | 'dark', key: keyof ShadcnTheme, value: string) => {
      setIsEditing(true)
      if (mode === 'light') {
        setLightTheme((prev) => (prev ? { ...prev, [key]: value } : null))
      } else {
        setDarkTheme((prev) => (prev ? { ...prev, [key]: value } : null))
      }
    },
    [],
  )

  const toOKLCH = (color: chroma.Color): string => {
    const oklch = color.oklch()
    const l = (oklch[0] * 100).toFixed(4)
    const c = oklch[1].toFixed(4)
    const h = oklch[2] ? oklch[2].toFixed(4) : '0'
    return `oklch(${l}% ${c} ${h})`
  }

  const toHSL = (color: chroma.Color): string => {
    const [h, s, l] = color.hsl()
    return `hsl(${h.toFixed(0)} ${(s * 100).toFixed(0)}% ${(l * 100).toFixed(0)}%)`
  }

  const generateCSS = useCallback(() => {
    if (!lightTheme || !darkTheme) return ''

    const generateVars = (theme: ShadcnTheme, isDark: boolean) => {
      return `${isDark ? '.dark' : ':root'} {
  --background: ${theme.background.replace('oklch(', '').replace(')', '')};
  --foreground: ${theme.foreground.replace('oklch(', '').replace(')', '')};
  --card: ${theme.card.replace('oklch(', '').replace(')', '')};
  --card-foreground: ${theme.cardForeground.replace('oklch(', '').replace(')', '')};
  --popover: ${theme.popover.replace('oklch(', '').replace(')', '')};
  --popover-foreground: ${theme.popoverForeground.replace('oklch(', '').replace(')', '')};
  --primary: ${theme.primary.replace('oklch(', '').replace(')', '')};
  --primary-foreground: ${theme.primaryForeground.replace('oklch(', '').replace(')', '')};
  --secondary: ${theme.secondary.replace('oklch(', '').replace(')', '')};
  --secondary-foreground: ${theme.secondaryForeground.replace('oklch(', '').replace(')', '')};
  --muted: ${theme.muted.replace('oklch(', '').replace(')', '')};
  --muted-foreground: ${theme.mutedForeground.replace('oklch(', '').replace(')', '')};
  --accent: ${theme.accent.replace('oklch(', '').replace(')', '')};
  --accent-foreground: ${theme.accentForeground.replace('oklch(', '').replace(')', '')};
  --destructive: ${theme.destructive.replace('oklch(', '').replace(')', '')};
  --destructive-foreground: ${theme.destructiveForeground.replace('oklch(', '').replace(')', '')};
  --border: ${theme.border.replace('oklch(', '').replace(')', '')};
  --input: ${theme.input.replace('oklch(', '').replace(')', '')};
  --ring: ${theme.ring.replace('oklch(', '').replace(')', '')};
  --chart-1: ${theme.chart1.replace('oklch(', '').replace(')', '')};
  --chart-2: ${theme.chart2.replace('oklch(', '').replace(')', '')};
  --chart-3: ${theme.chart3.replace('oklch(', '').replace(')', '')};
  --chart-4: ${theme.chart4.replace('oklch(', '').replace(')', '')};
  --chart-5: ${theme.chart5.replace('oklch(', '').replace(')', '')};
  --sidebar: ${theme.sidebar.replace('oklch(', '').replace(')', '')};
  --sidebar-foreground: ${theme.sidebarForeground.replace('oklch(', '').replace(')', '')};
  --sidebar-primary: ${theme.sidebarPrimary.replace('oklch(', '').replace(')', '')};
  --sidebar-primary-foreground: ${theme.sidebarPrimaryForeground.replace('oklch(', '').replace(')', '')};
  --sidebar-accent: ${theme.sidebarAccent.replace('oklch(', '').replace(')', '')};
  --sidebar-accent-foreground: ${theme.sidebarAccentForeground.replace('oklch(', '').replace(')', '')};
  --sidebar-border: ${theme.sidebarBorder.replace('oklch(', '').replace(')', '')};
  --sidebar-ring: ${theme.sidebarRing.replace('oklch(', '').replace(')', '')};
  --font-sans: ${theme.fontSans};
  --font-serif: ${theme.fontSerif};
  --font-mono: ${theme.fontMono};
  --radius: ${theme.radius};
  --spacing: ${theme.spacing};
  --shadow-x: ${theme.shadowX};
  --shadow-y: ${theme.shadowY};
  --shadow-blur: ${theme.shadowBlur};
  --shadow-spread: ${theme.shadowSpread};
  --shadow-opacity: ${theme.shadowOpacity};
  --shadow-color: ${theme.shadowColor};
}`
    }

    return `@layer base {
  ${generateVars(lightTheme, false)}

  ${generateVars(darkTheme, true)}

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-destructive-foreground: var(--destructive-foreground);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);

    --font-sans: var(--font-sans);
    --font-mono: var(--font-mono);
    --font-serif: var(--font-serif);

    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
  }
}`
  }, [lightTheme, darkTheme])

  const cssCode = generateCSS()

  const handleCopy = useCallback(async () => {
    if (!cssCode) return
    try {
      await navigator.clipboard.writeText(cssCode)
      setCopied(true)
      toast.success('Tema copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [cssCode])

  const handleDownload = useCallback(() => {
    if (!cssCode) return
    const blob = new Blob([cssCode], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shadcn-theme.css'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Tema baixado!')
  }, [cssCode])

  if (colors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Palette className='h-5 w-5' />
            Gerador de Tema Shadcn UI
          </CardTitle>
          <CardDescription>Gere uma paleta primeiro para criar um tema completo</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Palette className='h-5 w-5' />
          Gerador de Tema Shadcn UI
        </CardTitle>
        <CardDescription>
          Tema completo com todas as variáveis CSS em OKLCH para Shadcn UI
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Preview do Tema */}
        <div className='flex items-center justify-between'>
          <Label>Preview e Edição</Label>
          {isEditing && (
            <Button size='sm' variant='outline' onClick={handleReset} className='gap-2'>
              <RotateCcw className='h-3 w-3' />
              Resetar Tema
            </Button>
          )}
        </div>

        <Tabs defaultValue='light' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='light'>Light Mode</TabsTrigger>
            <TabsTrigger value='dark'>Dark Mode</TabsTrigger>
          </TabsList>

          <TabsContent value='light' className='space-y-6'>
            {lightTheme && (
              <>
                {/* Cores Principais */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Cores Principais</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Background'
                      color={lightTheme.background}
                      onColorChange={(c) => handleColorChange('light', 'background', c)}
                    />
                    <ThemeColorCard
                      label='Foreground'
                      color={lightTheme.foreground}
                      onColorChange={(c) => handleColorChange('light', 'foreground', c)}
                    />
                    <ThemeColorCard
                      label='Card'
                      color={lightTheme.card}
                      onColorChange={(c) => handleColorChange('light', 'card', c)}
                    />
                    <ThemeColorCard
                      label='Card Foreground'
                      color={lightTheme.cardForeground}
                      onColorChange={(c) => handleColorChange('light', 'cardForeground', c)}
                    />
                    <ThemeColorCard
                      label='Popover'
                      color={lightTheme.popover}
                      onColorChange={(c) => handleColorChange('light', 'popover', c)}
                    />
                    <ThemeColorCard
                      label='Popover Foreground'
                      color={lightTheme.popoverForeground}
                      onColorChange={(c) => handleColorChange('light', 'popoverForeground', c)}
                    />
                  </div>
                </div>

                {/* Cores de Ação */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Cores de Ação</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Primary'
                      color={lightTheme.primary}
                      onColorChange={(c) => handleColorChange('light', 'primary', c)}
                    />
                    <ThemeColorCard
                      label='Primary Foreground'
                      color={lightTheme.primaryForeground}
                      onColorChange={(c) => handleColorChange('light', 'primaryForeground', c)}
                    />
                    <ThemeColorCard
                      label='Secondary'
                      color={lightTheme.secondary}
                      onColorChange={(c) => handleColorChange('light', 'secondary', c)}
                    />
                    <ThemeColorCard
                      label='Secondary Foreground'
                      color={lightTheme.secondaryForeground}
                      onColorChange={(c) => handleColorChange('light', 'secondaryForeground', c)}
                    />
                    <ThemeColorCard
                      label='Accent'
                      color={lightTheme.accent}
                      onColorChange={(c) => handleColorChange('light', 'accent', c)}
                    />
                    <ThemeColorCard
                      label='Accent Foreground'
                      color={lightTheme.accentForeground}
                      onColorChange={(c) => handleColorChange('light', 'accentForeground', c)}
                    />
                    <ThemeColorCard
                      label='Destructive'
                      color={lightTheme.destructive}
                      onColorChange={(c) => handleColorChange('light', 'destructive', c)}
                    />
                    <ThemeColorCard
                      label='Destructive Foreground'
                      color={lightTheme.destructiveForeground}
                      onColorChange={(c) => handleColorChange('light', 'destructiveForeground', c)}
                    />
                  </div>
                </div>

                {/* Cores de UI */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Elementos UI</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Muted'
                      color={lightTheme.muted}
                      onColorChange={(c) => handleColorChange('light', 'muted', c)}
                    />
                    <ThemeColorCard
                      label='Muted Foreground'
                      color={lightTheme.mutedForeground}
                      onColorChange={(c) => handleColorChange('light', 'mutedForeground', c)}
                    />
                    <ThemeColorCard
                      label='Border'
                      color={lightTheme.border}
                      onColorChange={(c) => handleColorChange('light', 'border', c)}
                    />
                    <ThemeColorCard
                      label='Input'
                      color={lightTheme.input}
                      onColorChange={(c) => handleColorChange('light', 'input', c)}
                    />
                    <ThemeColorCard
                      label='Ring'
                      color={lightTheme.ring}
                      onColorChange={(c) => handleColorChange('light', 'ring', c)}
                    />
                  </div>
                </div>

                {/* Cores de Charts */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Charts</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
                    <ThemeColorCard
                      label='Chart 1'
                      color={lightTheme.chart1}
                      onColorChange={(c) => handleColorChange('light', 'chart1', c)}
                    />
                    <ThemeColorCard
                      label='Chart 2'
                      color={lightTheme.chart2}
                      onColorChange={(c) => handleColorChange('light', 'chart2', c)}
                    />
                    <ThemeColorCard
                      label='Chart 3'
                      color={lightTheme.chart3}
                      onColorChange={(c) => handleColorChange('light', 'chart3', c)}
                    />
                    <ThemeColorCard
                      label='Chart 4'
                      color={lightTheme.chart4}
                      onColorChange={(c) => handleColorChange('light', 'chart4', c)}
                    />
                    <ThemeColorCard
                      label='Chart 5'
                      color={lightTheme.chart5}
                      onColorChange={(c) => handleColorChange('light', 'chart5', c)}
                    />
                  </div>
                </div>

                {/* Cores de Sidebar */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Sidebar</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Sidebar'
                      color={lightTheme.sidebar}
                      onColorChange={(c) => handleColorChange('light', 'sidebar', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Foreground'
                      color={lightTheme.sidebarForeground}
                      onColorChange={(c) => handleColorChange('light', 'sidebarForeground', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Primary'
                      color={lightTheme.sidebarPrimary}
                      onColorChange={(c) => handleColorChange('light', 'sidebarPrimary', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Primary FG'
                      color={lightTheme.sidebarPrimaryForeground}
                      onColorChange={(c) =>
                        handleColorChange('light', 'sidebarPrimaryForeground', c)
                      }
                    />
                    <ThemeColorCard
                      label='Sidebar Accent'
                      color={lightTheme.sidebarAccent}
                      onColorChange={(c) => handleColorChange('light', 'sidebarAccent', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Accent FG'
                      color={lightTheme.sidebarAccentForeground}
                      onColorChange={(c) =>
                        handleColorChange('light', 'sidebarAccentForeground', c)
                      }
                    />
                    <ThemeColorCard
                      label='Sidebar Border'
                      color={lightTheme.sidebarBorder}
                      onColorChange={(c) => handleColorChange('light', 'sidebarBorder', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Ring'
                      color={lightTheme.sidebarRing}
                      onColorChange={(c) => handleColorChange('light', 'sidebarRing', c)}
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value='dark' className='space-y-6'>
            {darkTheme && (
              <>
                {/* Cores Principais */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Cores Principais</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Background'
                      color={darkTheme.background}
                      onColorChange={(c) => handleColorChange('dark', 'background', c)}
                    />
                    <ThemeColorCard
                      label='Foreground'
                      color={darkTheme.foreground}
                      onColorChange={(c) => handleColorChange('dark', 'foreground', c)}
                    />
                    <ThemeColorCard
                      label='Card'
                      color={darkTheme.card}
                      onColorChange={(c) => handleColorChange('dark', 'card', c)}
                    />
                    <ThemeColorCard
                      label='Card Foreground'
                      color={darkTheme.cardForeground}
                      onColorChange={(c) => handleColorChange('dark', 'cardForeground', c)}
                    />
                    <ThemeColorCard
                      label='Popover'
                      color={darkTheme.popover}
                      onColorChange={(c) => handleColorChange('dark', 'popover', c)}
                    />
                    <ThemeColorCard
                      label='Popover Foreground'
                      color={darkTheme.popoverForeground}
                      onColorChange={(c) => handleColorChange('dark', 'popoverForeground', c)}
                    />
                  </div>
                </div>

                {/* Cores de Ação */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Cores de Ação</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Primary'
                      color={darkTheme.primary}
                      onColorChange={(c) => handleColorChange('dark', 'primary', c)}
                    />
                    <ThemeColorCard
                      label='Primary Foreground'
                      color={darkTheme.primaryForeground}
                      onColorChange={(c) => handleColorChange('dark', 'primaryForeground', c)}
                    />
                    <ThemeColorCard
                      label='Secondary'
                      color={darkTheme.secondary}
                      onColorChange={(c) => handleColorChange('dark', 'secondary', c)}
                    />
                    <ThemeColorCard
                      label='Secondary Foreground'
                      color={darkTheme.secondaryForeground}
                      onColorChange={(c) => handleColorChange('dark', 'secondaryForeground', c)}
                    />
                    <ThemeColorCard
                      label='Accent'
                      color={darkTheme.accent}
                      onColorChange={(c) => handleColorChange('dark', 'accent', c)}
                    />
                    <ThemeColorCard
                      label='Accent Foreground'
                      color={darkTheme.accentForeground}
                      onColorChange={(c) => handleColorChange('dark', 'accentForeground', c)}
                    />
                    <ThemeColorCard
                      label='Destructive'
                      color={darkTheme.destructive}
                      onColorChange={(c) => handleColorChange('dark', 'destructive', c)}
                    />
                    <ThemeColorCard
                      label='Destructive Foreground'
                      color={darkTheme.destructiveForeground}
                      onColorChange={(c) => handleColorChange('dark', 'destructiveForeground', c)}
                    />
                  </div>
                </div>

                {/* Cores de UI */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Elementos UI</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Muted'
                      color={darkTheme.muted}
                      onColorChange={(c) => handleColorChange('dark', 'muted', c)}
                    />
                    <ThemeColorCard
                      label='Muted Foreground'
                      color={darkTheme.mutedForeground}
                      onColorChange={(c) => handleColorChange('dark', 'mutedForeground', c)}
                    />
                    <ThemeColorCard
                      label='Border'
                      color={darkTheme.border}
                      onColorChange={(c) => handleColorChange('dark', 'border', c)}
                    />
                    <ThemeColorCard
                      label='Input'
                      color={darkTheme.input}
                      onColorChange={(c) => handleColorChange('dark', 'input', c)}
                    />
                    <ThemeColorCard
                      label='Ring'
                      color={darkTheme.ring}
                      onColorChange={(c) => handleColorChange('dark', 'ring', c)}
                    />
                  </div>
                </div>

                {/* Cores de Charts */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Charts</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
                    <ThemeColorCard
                      label='Chart 1'
                      color={darkTheme.chart1}
                      onColorChange={(c) => handleColorChange('dark', 'chart1', c)}
                    />
                    <ThemeColorCard
                      label='Chart 2'
                      color={darkTheme.chart2}
                      onColorChange={(c) => handleColorChange('dark', 'chart2', c)}
                    />
                    <ThemeColorCard
                      label='Chart 3'
                      color={darkTheme.chart3}
                      onColorChange={(c) => handleColorChange('dark', 'chart3', c)}
                    />
                    <ThemeColorCard
                      label='Chart 4'
                      color={darkTheme.chart4}
                      onColorChange={(c) => handleColorChange('dark', 'chart4', c)}
                    />
                    <ThemeColorCard
                      label='Chart 5'
                      color={darkTheme.chart5}
                      onColorChange={(c) => handleColorChange('dark', 'chart5', c)}
                    />
                  </div>
                </div>

                {/* Cores de Sidebar */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-semibold'>Sidebar</h3>
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                    <ThemeColorCard
                      label='Sidebar'
                      color={darkTheme.sidebar}
                      onColorChange={(c) => handleColorChange('dark', 'sidebar', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Foreground'
                      color={darkTheme.sidebarForeground}
                      onColorChange={(c) => handleColorChange('dark', 'sidebarForeground', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Primary'
                      color={darkTheme.sidebarPrimary}
                      onColorChange={(c) => handleColorChange('dark', 'sidebarPrimary', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Primary FG'
                      color={darkTheme.sidebarPrimaryForeground}
                      onColorChange={(c) =>
                        handleColorChange('dark', 'sidebarPrimaryForeground', c)
                      }
                    />
                    <ThemeColorCard
                      label='Sidebar Accent'
                      color={darkTheme.sidebarAccent}
                      onColorChange={(c) => handleColorChange('dark', 'sidebarAccent', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Accent FG'
                      color={darkTheme.sidebarAccentForeground}
                      onColorChange={(c) => handleColorChange('dark', 'sidebarAccentForeground', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Border'
                      color={darkTheme.sidebarBorder}
                      onColorChange={(c) => handleColorChange('dark', 'sidebarBorder', c)}
                    />
                    <ThemeColorCard
                      label='Sidebar Ring'
                      color={darkTheme.sidebarRing}
                      onColorChange={(c) => handleColorChange('dark', 'sidebarRing', c)}
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* CSS Code */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label>Código CSS Completo</Label>
            <div className='flex gap-2'>
              <Button size='sm' variant='outline' onClick={handleCopy} className='gap-2'>
                {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
                Copiar
              </Button>
              <Button size='sm' onClick={handleDownload} className='gap-2'>
                <Download className='h-3 w-3' />
                Baixar CSS
              </Button>
            </div>
          </div>

          <div className='bg-muted max-h-96 overflow-auto rounded-lg border p-4'>
            <pre className='font-mono text-xs'>
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>

        {/* Instruções */}
        <div className='rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'>
          <strong>Como usar:</strong>
          <ol className='mt-2 ml-4 list-decimal space-y-1'>
            <li>Copie o código CSS gerado</li>
            <li>
              Cole no seu arquivo{' '}
              <code className='rounded bg-blue-100 px-1 dark:bg-blue-900'>globals.css</code> ou{' '}
              <code className='rounded bg-blue-100 px-1 dark:bg-blue-900'>app.css</code>
            </li>
            <li>O tema será aplicado automaticamente em todos os componentes Shadcn UI</li>
            <li>
              Suporta dark mode via classe{' '}
              <code className='rounded bg-blue-100 px-1 dark:bg-blue-900'>.dark</code>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

function ThemeColorCard({
  label,
  color,
  onColorChange,
}: {
  label: string
  color: string
  onColorChange?: (newColor: string) => void
}) {
  const hex = chroma(
    color.replace(/oklch\((.*?)\)/, (_, values) => {
      const [l, c, h] = values.split(' ')
      return `oklch(${l} ${c} ${h})`
    }),
  ).hex()

  const handleColorChange = (newHex: string) => {
    try {
      const newColor = chroma(newHex)
      const oklch = newColor.oklch()
      const l = (oklch[0] * 100).toFixed(4)
      const c = oklch[1].toFixed(4)
      const h = oklch[2] ? oklch[2].toFixed(4) : '0'
      onColorChange?.(`oklch(${l}% ${c} ${h})`)
    } catch {
      // Cor inválida, ignora
    }
  }

  return (
    <div className='group hover:border-primary/50 flex items-center gap-2 rounded-lg border p-2 transition-colors'>
      <div className='relative'>
        <div className='h-10 w-10 rounded border' style={{ backgroundColor: hex }} />
        {onColorChange && (
          <input
            type='color'
            value={hex}
            onChange={(e) => handleColorChange(e.target.value)}
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            title={`Editar ${label}`}
          />
        )}
      </div>
      <div className='flex-1'>
        <p className='text-xs font-medium'>{label}</p>
        <p className='text-muted-foreground font-mono text-[10px]'>{hex}</p>
      </div>
    </div>
  )
}
