import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileDigit,
  Hash,
  Images,
} from 'lucide-react'

export const HEADER_FOOTER_VARIABLES = {
  page: '{page}',
  totalPages: '{totalPages}',
  date: '{date}',
  time: '{time}',
  datetime: '{datetime}',
  logo: '{logo}',
}
export const DEFAULT_HEADER_FOOTER_SLOT_ITEM_PADDING: HeaderFooterSlotItemConfig['padding'] = {
  top: '5mm',
  right: '5mm',
  bottom: '5mm',
  left: '5mm',
}
export const DEFAULT_HEADER_FOOTER_SLOT_ITEM: HeaderFooterSlotItemConfig = {
  enabled: false,
  title: '',
  author: '',
  left: '',
  center: '',
  right: '',
  height: '18mm',
  border: false,
  padding: DEFAULT_HEADER_FOOTER_SLOT_ITEM_PADDING,
  fontSize: 11,
}

export const DEFAULT_HEADER_FOOTER: HeaderFooterConfig = {
  header: DEFAULT_HEADER_FOOTER_SLOT_ITEM,
  footer: DEFAULT_HEADER_FOOTER_SLOT_ITEM,
}
export const HEADER_FOOTER_VARIABLES_LIST_OPTIONS = [
  { key: 'page', label: 'Página', value: HEADER_FOOTER_VARIABLES.page, icon: FileDigit },
  {
    key: 'totalPages',
    label: 'Total',
    value: HEADER_FOOTER_VARIABLES.totalPages,
    icon: Hash,
  },
  { key: 'logo', label: 'Logo', value: HEADER_FOOTER_VARIABLES.logo, icon: Images },
  { key: 'date', label: 'Data', value: HEADER_FOOTER_VARIABLES.date, icon: CalendarDays },
  { key: 'time', label: 'Hora', value: HEADER_FOOTER_VARIABLES.time, icon: Clock },
  {
    key: 'datetime',
    label: 'Data e Hora',
    value: HEADER_FOOTER_VARIABLES.datetime,
    icon: CalendarClock,
  },
]

export const POSITION_OPTIONS: {
  label: string
  value: Position
  icon: React.ElementType
}[] = [
  { label: 'Esquerda', value: 'left', icon: ChevronLeft },
  { label: 'Direita', value: 'right', icon: ChevronRight },
  { label: 'Topo', value: 'top', icon: ChevronUp },
  { label: 'Inferior', value: 'bottom', icon: ChevronDown },
]
export const SIMPLE_FIELDS: {
  label: string
  value: PositionDirection
  icon: React.ElementType
  placeholder: string
}[] = [
  {
    label: 'Lado Esquerdo',
    value: 'left',
    icon: AlignLeft,
    placeholder: 'Digite aqui...',
  },
  {
    label: 'Centralizado',
    value: 'center',
    icon: AlignCenter,
    placeholder: 'Digite aqui...',
  },
  {
    label: 'Lado Direito',
    value: 'right',
    icon: AlignRight,
    placeholder: 'Digite aqui...',
  },
]
