export const extractNumber = (value: string): number => {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''))
  return isNaN(num) ? 0 : num
}
