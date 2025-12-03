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
