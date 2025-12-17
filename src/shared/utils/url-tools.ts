type QueryParams = Record<string, string | number | boolean | null | undefined>

/**
 * Constrói uma URL com query parameters de forma segura.
 */
export const buildUrl = (baseUrl: string, query?: QueryParams): string => {
  if (!query) return baseUrl

  const urlSearchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      urlSearchParams.append(key, String(value))
    }
  })

  const queryString = urlSearchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
