export const convertUnit = (value: number, from: Unit, to: Unit): number => {
  if (from === to) return value

  // Converter tudo para mm primeiro
  let valueInMm = value
  if (from === 'cm') valueInMm = value * 10
  if (from === 'px') valueInMm = (value * 25.4) / 96 // 96 DPI

  // Converter de mm para a unidade destino
  if (to === 'cm') return valueInMm / 10
  if (to === 'px') return (valueInMm * 96) / 25.4
  return valueInMm
}
