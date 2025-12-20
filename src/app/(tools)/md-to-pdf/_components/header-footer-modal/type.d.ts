interface SlotConfigFormProps {
  slot: HeaderFooterSlotItemConfig
  slotType: 'header' | 'footer'
  onUpdate: (updates: any) => void
  logoValue?: string
  onLogoChange: (base64: string | null) => Promise<void>
  onResetSlot: () => void
}

interface SlotSimpleConfigProps {
  slot: HeaderFooterSlotItemConfig
  onUpdate: (updates: any) => void
}

interface SlotAdvancedConfigProps {
  slot: HeaderFooterSlotItemConfig
  onUpdate: (updates: any) => void
  slotType: 'header' | 'footer'
  hasFullImage: boolean
  contentType: 'editor' | 'fullImage'
  setContentType: (contentType: 'editor' | 'fullImage') => void
}
