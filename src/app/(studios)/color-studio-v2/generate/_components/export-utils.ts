import chroma from 'chroma-js'

export interface ExportColor {
  id: string
  hex: string
  name: string
  rgb?: string
  hsl?: string
  oklch?: string
}

/**
 * Gera nome slug a partir do nome da cor
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Gera escala de cores do Tailwind (50-950)
 */
function generateTailwindScale(hex: string): Record<string, string> {
  const scale: Record<string, string> = {}

  // Gera escala de 50 a 950
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  stops.forEach((stop) => {
    // 500 é a cor original
    if (stop === 500) {
      scale[stop] = hex
    } else if (stop < 500) {
      // Cores mais claras (50-400)
      const lightness = 0.95 - (500 - stop) * 0.1
      scale[stop] = chroma(hex).set('hsl.l', lightness).hex()
    } else {
      // Cores mais escuras (600-950)
      const lightness = 0.5 - (stop - 500) * 0.05
      scale[stop] = chroma(hex).set('hsl.l', Math.max(0.05, lightness)).hex()
    }
  })

  return scale
}

/**
 * Export Code - CSV
 */
export function exportCSV(colors: ExportColor[]): string {
  return colors.map((c) => c.hex.replace('#', '')).join(',')
}

/**
 * Export Code - With #
 */
export function exportWithHash(colors: ExportColor[]): string {
  return colors.map((c) => c.hex).join(', ')
}

/**
 * Export Code - Array
 */
export function exportArray(colors: ExportColor[]): string {
  const hexes = colors.map((c) => c.hex.replace('#', ''))
  return JSON.stringify(hexes)
}

/**
 * Export Code - Object
 */
export function exportObject(colors: ExportColor[]): string {
  const obj: Record<string, string> = {}
  colors.forEach((c) => {
    obj[c.name] = c.hex.replace('#', '')
  })
  return JSON.stringify(obj, null, 2)
}

/**
 * Export Code - Extended Array
 */
export function exportExtendedArray(colors: ExportColor[]): string {
  const extended = colors.map((c) => {
    const color = chroma(c.hex)
    const rgb = color.rgb()
    const hsl = color.hsl()
    const cmyk = color.cmyk()
    const hsb = color.hsv() // HSV é similar a HSB

    return {
      name: c.name,
      hex: c.hex.replace('#', ''),
      rgb: [Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])],
      cmyk: [
        Math.round(cmyk[0] * 100),
        Math.round(cmyk[1] * 100),
        Math.round(cmyk[2] * 100),
        Math.round(cmyk[3] * 100),
      ],
      hsb: [Math.round(hsb[0]), Math.round(hsb[1] * 100), Math.round(hsb[2] * 100)],
      hsl: [Math.round(hsl[0]), Math.round(hsl[1] * 100), Math.round(hsl[2] * 100)],
      lab: color.lab().map((v) => Math.round(v * 100) / 100),
    }
  })

  return JSON.stringify(extended, null, 2)
}

/**
 * Export Code - XML
 */
export function exportXML(colors: ExportColor[]): string {
  let xml = '<palette>\n'
  colors.forEach((c) => {
    const color = chroma(c.hex)
    const rgb = color.rgb()
    xml += `  <color name="${c.name}" hex="${c.hex.replace('#', '')}" r="${Math.round(rgb[0])}" g="${Math.round(rgb[1])}" b="${Math.round(rgb[2])}" />\n`
  })
  xml += '</palette>'
  return xml
}

/**
 * Export Code - Embed
 */
export function exportEmbed(colors: ExportColor[]): string {
  const hexes = colors.map((c) => c.hex.replace('#', ''))
  const paletteId = Date.now().toString()
  return `<!-- Color Studio Palette Widget -->\n<script src="https://color-studio.palette-widget/widget.js"></script>\n<script data-id="${paletteId}">new ColorStudioPaletteWidget("${paletteId}", ${JSON.stringify(hexes)}); </script>`
}

/**
 * Export CSS - HEX
 */
export function exportCSSHex(colors: ExportColor[]): string {
  let css = '/* CSS HEX */\n'
  colors.forEach((c) => {
    const slug = slugify(c.name)
    css += `--${slug}: ${c.hex}ff;\n`
  })
  return css
}

/**
 * Export CSS - HSL
 */
export function exportCSSHSL(colors: ExportColor[]): string {
  let css = '/* CSS HSL */\n'
  colors.forEach((c) => {
    const color = chroma(c.hex)
    const hsl = color.hsl()
    const slug = slugify(c.name)
    css += `--${slug}: hsla(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, 1);\n`
  })
  return css
}

/**
 * Export SCSS - HEX
 */
export function exportSCSSHex(colors: ExportColor[]): string {
  let scss = '/* SCSS HEX */\n'
  colors.forEach((c) => {
    const slug = slugify(c.name)
    scss += `$${slug}: ${c.hex}ff;\n`
  })
  return scss
}

/**
 * Export SCSS - HSL
 */
export function exportSCSSHSL(colors: ExportColor[]): string {
  let scss = '/* SCSS HSL */\n'
  colors.forEach((c) => {
    const color = chroma(c.hex)
    const hsl = color.hsl()
    const slug = slugify(c.name)
    scss += `$${slug}: hsla(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, 1);\n`
  })
  return scss
}

/**
 * Export SCSS - RGB
 */
export function exportSCSSRGB(colors: ExportColor[]): string {
  let scss = '/* SCSS RGB */\n'
  colors.forEach((c) => {
    const color = chroma(c.hex)
    const rgb = color.rgb()
    const slug = slugify(c.name)
    scss += `$${slug}: rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, 1);\n`
  })
  return scss
}

/**
 * Export SCSS - Gradients
 */
export function exportSCSSGradients(colors: ExportColor[]): string {
  const hexes = colors.map((c) => c.hex + 'ff')
  return `/* SCSS Gradient */\n$gradient-top: linear-gradient(0deg, ${hexes.join(', ')});\n$gradient-right: linear-gradient(90deg, ${hexes.join(', ')});\n$gradient-bottom: linear-gradient(180deg, ${hexes.join(', ')});\n$gradient-left: linear-gradient(270deg, ${hexes.join(', ')});\n$gradient-top-right: linear-gradient(45deg, ${hexes.join(', ')});\n$gradient-bottom-right: linear-gradient(135deg, ${hexes.join(', ')});\n$gradient-top-left: linear-gradient(225deg, ${hexes.join(', ')});\n$gradient-bottom-left: linear-gradient(315deg, ${hexes.join(', ')});\n$gradient-radial: radial-gradient(${hexes.join(', ')});`
}

/**
 * Export Tailwind v3 - HEX
 */
export function exportTailwindV3Hex(colors: ExportColor[]): string {
  const obj: Record<string, Record<string, string>> = {}
  colors.forEach((c) => {
    const slug = slugify(c.name)
    obj[slug] = generateTailwindScale(c.hex)
  })
  return JSON.stringify(obj, null, 2)
}

/**
 * Export Tailwind v4 - HEX
 */
export function exportTailwindV4Hex(colors: ExportColor[]): string {
  let css = ''
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    Object.entries(scale).forEach(([stop, hex]) => {
      css += `--color-${slug}-${stop}: ${hex};\n`
    })
  })
  return css
}

/**
 * Export Tailwind v3 - OKLCH
 */
export function exportTailwindV3OKLCH(colors: ExportColor[]): string {
  const obj: Record<string, Record<string, string>> = {}
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    const oklchScale: Record<string, string> = {}
    Object.entries(scale).forEach(([stop, hex]) => {
      const oklch = chroma(hex).oklch()
      oklchScale[stop] =
        `oklch(${(oklch[0] * 100).toFixed(2)}% ${oklch[1].toFixed(3)} ${oklch[2] ? oklch[2].toFixed(2) : 0})`
    })
    obj[slug] = oklchScale
  })
  return JSON.stringify(obj, null, 2)
}

/**
 * Export Tailwind v4 - OKLCH
 */
export function exportTailwindV4OKLCH(colors: ExportColor[]): string {
  let css = ''
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    Object.entries(scale).forEach(([stop, hex]) => {
      const oklch = chroma(hex).oklch()
      css += `--color-${slug}-${stop}: oklch(${(oklch[0] * 100).toFixed(2)}% ${oklch[1].toFixed(3)} ${oklch[2] ? oklch[2].toFixed(2) : 0});\n`
    })
  })
  return css
}

/**
 * Export Tailwind v3 - RGB
 */
export function exportTailwindV3RGB(colors: ExportColor[]): string {
  const obj: Record<string, Record<string, string>> = {}
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    const rgbScale: Record<string, string> = {}
    Object.entries(scale).forEach(([stop, hex]) => {
      const rgb = chroma(hex).rgb()
      rgbScale[stop] = `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])})`
    })
    obj[slug] = rgbScale
  })
  return JSON.stringify(obj, null, 2)
}

/**
 * Export Tailwind v4 - RGB
 */
export function exportTailwindV4RGB(colors: ExportColor[]): string {
  let css = ''
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    Object.entries(scale).forEach(([stop, hex]) => {
      const rgb = chroma(hex).rgb()
      css += `--color-${slug}-${stop}: rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])});\n`
    })
  })
  return css
}

/**
 * Export Tailwind v3 - HSL
 */
export function exportTailwindV3HSL(colors: ExportColor[]): string {
  const obj: Record<string, Record<string, string>> = {}
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    const hslScale: Record<string, string> = {}
    Object.entries(scale).forEach(([stop, hex]) => {
      const hsl = chroma(hex).hsl()
      hslScale[stop] =
        `hsl(${hsl[0].toFixed(1)} ${(hsl[1] * 100).toFixed(1)}% ${(hsl[2] * 100).toFixed(1)}%)`
    })
    obj[slug] = hslScale
  })
  return JSON.stringify(obj, null, 2)
}

/**
 * Export Tailwind v4 - HSL
 */
export function exportTailwindV4HSL(colors: ExportColor[]): string {
  let css = ''
  colors.forEach((c) => {
    const slug = slugify(c.name)
    const scale = generateTailwindScale(c.hex)
    Object.entries(scale).forEach(([stop, hex]) => {
      const hsl = chroma(hex).hsl()
      css += `--color-${slug}-${stop}: hsl(${hsl[0].toFixed(1)} ${(hsl[1] * 100).toFixed(1)}% ${(hsl[2] * 100).toFixed(1)}%);\n`
    })
  })
  return css
}
