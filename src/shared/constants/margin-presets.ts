export const MARGIN_PRESETS: Record<
  MarginPreset,
  { name: string; margin: { top: string; right: string; bottom: string; left: string } }
> = {
  minimal: {
    name: 'Mínima',
    margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
  },
  narrow: {
    name: 'Estreita',
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  },
  normal: {
    name: 'Normal',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
  },
  wide: {
    name: 'Larga',
    margin: { top: '30mm', right: '30mm', bottom: '30mm', left: '30mm' },
  },
  custom: {
    name: 'Personalizada',
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  },
}
