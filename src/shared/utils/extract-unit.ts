export const extractUnit = (value: string): Unit => {
  if (value.includes('px')) return 'px'
  if (value.includes('cm')) return 'cm'
  return 'mm' // padrão
}
