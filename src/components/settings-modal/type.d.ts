interface SettingsDialogProps {
  config: AppConfig
  onConfigChange: (config: Partial<AppConfig>) => void
  onPageSizeChange: (size: PageSize) => void
  onOrientationChange: (orientation: Orientation) => void
  onReset: () => void
  onApplyMarginPreset: (preset: MarginPreset) => void
  onApplyThemePreset: (preset: ThemePreset) => void
}
