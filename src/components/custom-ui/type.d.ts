interface SelectWithFilterComponentPropsClassName {
  trigger?: string
  content?: string
  item?: string
  buttonTrigger?: string
}
interface SelectWithFilterComponentProps {
  id?: string
  value: string
  onChange?: (value: string) => void
  data: { value: string; label: string }[]
  placeholder?: string
  emptyMessage?: string
  className?: SelectWithFilterComponentPropsClassName
  disabled?: boolean
  nullValueLabel?: string
}

/**
 * Dropdown Component
 */
type DropContentItemType = 'item' | 'solo'
interface DropContentItem {
  type: DropContentItemType
  key: string
  component: React.ReactNode
}
interface DropNoContentItem {
  type: 'separator'
  key: string
}

type DropdownContentProps = DropContentItem | DropNoContentItem
interface DropdownComponentProps {
  trigger: React.ReactNode
  content: DropdownContentProps[]
}
