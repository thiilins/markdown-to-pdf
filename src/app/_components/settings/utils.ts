
export type Unit = "mm" | "cm" | "px";

// Função para extrair o número de um valor com unidade
export const extractNumber = (value: string): number => {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

// Função para extrair a unidade de um valor
export const extractUnit = (value: string): Unit => {
  if (value.includes("px")) return "px";
  if (value.includes("cm")) return "cm";
  return "mm"; // padrão
};

// Função para converter entre unidades
export const convertUnit = (value: number, from: Unit, to: Unit): number => {
  if (from === to) return value;

  // Converter tudo para mm primeiro
  let valueInMm = value;
  if (from === "cm") valueInMm = value * 10;
  if (from === "px") valueInMm = (value * 25.4) / 96; // 96 DPI

  // Converter de mm para a unidade destino
  if (to === "cm") return valueInMm / 10;
  if (to === "px") return (valueInMm * 96) / 25.4;
  return valueInMm;
  };