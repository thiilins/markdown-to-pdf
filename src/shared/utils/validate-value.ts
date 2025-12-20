export const isBoolean = (value: any): value is boolean => {
  return value === true || value === false
}
export const isBooleanFb = (value: any, fallback: boolean): boolean => {
  return isBoolean(value) ? value : fallback
}
