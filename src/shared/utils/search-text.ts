export const searchText = (text: string, search: string) => {
  return String(text).toLowerCase().trim().includes(String(search).toLowerCase().trim())
}
