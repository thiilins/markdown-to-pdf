import { Dispatch, SetStateAction, useEffect, useState } from 'react'

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
    // Função para carregar os dados do localStorage
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

export default usePersistedState
