interface SettingsDialogProps {
  config: AppConfig
  onConfigChange: (config: Partial<AppConfig>) => void
  onPageSizeChange: (size: PageSize) => void
  onOrientationChange: (orientation: Orientation) => void
  onReset: () => void
  onApplyMarginPreset: (preset: MarginPreset) => void
  onApplyThemePreset: (preset: ThemePreset) => void
}

type SettingsModalTabsOptions =
  | 'page'
  | 'typography'
  | 'theme'
  | 'editor'
  | 'spacing'
  | 'view'
  | 'advanced'

interface SettingCardModalProps {
  value: SettingsModalTabsOptions
  label: string
  icon: React.ElementType
  content: React.ReactNode
}
interface ColorCardProps {
  icon: {
    from: string
    to: string
  }
  text: string
}
interface HeaderCardProps {
  color: ColorCardProps
  description: string
  title: string
  icon: React.ElementType
}
