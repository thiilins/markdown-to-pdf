import { MARGIN_PRESETS, PAGE_SIZES, THEME_PRESETS } from '.'

export const defaultConfig: AppConfig = {
  page: {
    ...PAGE_SIZES.a4,
    orientation: 'portrait',
    padding: '20mm',
    margin: { ...MARGIN_PRESETS.narrow.margin },
  },
  typography: {
    headings: 'Montserrat',
    body: 'Open Sans',
    code: 'Fira Code',
    quote: 'Merriweather',
    baseSize: 14,
    h1Size: 28,
    h2Size: 22,
    h3Size: 18,
    lineHeight: 1.6,
  },
  editor: {
    theme: 'auto',
    fontSize: 14,
    wordWrap: 'on',
    minimap: false,
    lineNumbers: 'on',
  },
  theme: THEME_PRESETS.modern,
  preview: {
    showTOC: false,
    tocPosition: 'left',
  },
}
