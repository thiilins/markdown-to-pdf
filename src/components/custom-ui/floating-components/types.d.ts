interface FloatingToolbarProps {
  icon: any
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  iconClassName?: string
  contentClassName?: string
  storageKey?: string
  draggable?: boolean
}

interface FloatingPanelProps {
  children: React.ReactNode
  className?: {
    container?: string
    content?: string
  }
  width?: string
  height?: string
  // Agora aceita strings simples como o Toolbar
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  storageKey?: string
  draggable?: boolean
}
