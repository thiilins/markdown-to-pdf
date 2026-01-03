import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

import { safeJsonParse } from '@/lib/security-utils'

type Response<T> = [T, Dispatch<SetStateAction<T>>, boolean]

function usePersistedState<T>(
  key: string,
  initialState: T,
  isString = false,
  prefix = '@MD_TOOLS_PRO',
): Response<T> {
  const [state, setState] = useState<T>(initialState)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadData = () => {
      const storageValue = localStorage.getItem(`${prefix}:${key}`)
      if (storageValue) {
        if (isString) {
          setState(storageValue as unknown as T)
        } else {
          const parseResult = safeJsonParse<T>(storageValue, { maxSize: 1024 * 1024 }) // 1MB max
          if (parseResult.success && parseResult.data !== undefined) {
            setState(parseResult.data)
          } else {
            // Se falhar ao parsear, usar valor inicial
            console.warn(`Erro ao parsear estado persistido para ${key}:`, parseResult.error)
          }
        }
      }
      setLoaded(true)
    }

    loadData()
  }, [key, prefix, isString])

  useEffect(() => {
    if (loaded) {
      try {
        const value = isString ? String(state) : JSON.stringify(state)
        localStorage.setItem(`${prefix}:${key}`, value)
      } catch (error) {
        console.error(`Erro ao salvar estado persistido para ${key}:`, error)
      }
    }
  }, [state, loaded, isString, key, prefix])

  return [state, setState, loaded]
}

export const useGetPersistedState = <T>(key: string, prefix = '@MD_TOOLS_PRO'): T => {
  const value = useMemo(() => {
    const storageValue = localStorage.getItem(`${prefix}:${key}`)
    if (storageValue) {
      const parseResult = safeJsonParse<T>(storageValue, { maxSize: 1024 * 1024 }) // 1MB max
      if (parseResult.success && parseResult.data !== undefined) {
        return parseResult.data
      }
      console.warn(`Erro ao parsear estado persistido para ${key}:`, parseResult.error)
    }
    return null as T
  }, [key, prefix])
  return value
}

export default usePersistedState
