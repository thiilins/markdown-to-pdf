import { THEME_PRESETS, defaultConfig } from '../constants'

/**
 * Normaliza o AppConfig garantindo que sempre tenha um tema válido e headerFooter
 * Usado na inicialização para evitar re-renders desnecessários
 */
export function normalizeConfig(config: AppConfig): AppConfig {
  return {
    ...config,
    theme: config.theme || THEME_PRESETS.modern,
    headerFooter: config.headerFooter || defaultConfig.headerFooter,
  }
}
