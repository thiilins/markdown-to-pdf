import { THEME_PRESETS } from '../constants'

/**
 * Normaliza o AppConfig garantindo que sempre tenha um tema válido
 * Usado na inicialização para evitar re-renders desnecessários
 */
export function normalizeConfig(config: AppConfig): AppConfig {
  return {
    ...config,
    theme: config.theme || THEME_PRESETS.modern,
  }
}
