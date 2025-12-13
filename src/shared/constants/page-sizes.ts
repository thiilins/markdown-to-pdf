export const PAGE_SIZES: Record<
  PageSize,
  { width: string; height: string; name: string; size: PageSize }
> = {
  a4: { width: '210mm', height: '297mm', name: 'A4', size: 'a4' },
  a5: { width: '148mm', height: '210mm', name: 'A5', size: 'a5' },
  letter: { width: '215.9mm', height: '279.4mm', name: 'Carta (US Letter)', size: 'letter' },
  legal: { width: '215.9mm', height: '355.6mm', name: 'Legal', size: 'legal' },
  a3: { width: '297mm', height: '420mm', name: 'A3', size: 'a3' },
  custom: { width: '210mm', height: '297mm', name: 'Personalizado', size: 'custom' },
}
