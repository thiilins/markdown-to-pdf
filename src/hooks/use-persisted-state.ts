import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

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
        const parsedValue = isString ? (storageValue as unknown as T) : JSON.parse(storageValue)
        setState(parsedValue)
      }
      setLoaded(true)
    }

    loadData()
  }, [key, prefix, isString])

  useEffect(() => {
    if (loaded) {
      const value = isString ? String(state) : JSON.stringify(state)
      localStorage.setItem(`${prefix}:${key}`, value)
    }
  }, [state, loaded, isString, key, prefix])

  return [state, setState, loaded]
}

export const useGetPersistedState = <T>(key: string, prefix = '@MD_TOOLS_PRO'): T => {
  const value = useMemo(() => {
    const storageValue = localStorage.getItem(`${prefix}:${key}`)
    if (storageValue) {
      return JSON.parse(storageValue)
    }
    return null
  }, [key, prefix])
  return value
}

export default usePersistedState
