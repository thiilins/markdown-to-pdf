'use client'
import { getData, saveData } from '@/shared/utils'
import { useEffect, useState } from 'react'

type Response<T> = [T, (newState: T) => Promise<void>, boolean]

function usePersistedStateInDB<T>(key: string, initialState: T, havePrefix = true): Response<T> {
  const prefix = process.env.NEXT_PUBLIC_LOCAL_STORAGE_PREFIX || '@MD_TOOLS_PRO'
  const keyValue = havePrefix ? `${prefix}:${key}` : key
  const dbName = process.env.NEXT_PUBLIC_LOCAL_STORAGE_DATABASE_NAME || 'md_tools_pro_db'
  const storeName = process.env.NEXT_PUBLIC_LOCAL_STORAGE_STORE_NAME || 'mdtp_store'
  const [state, setState] = useState<T>(initialState)
  const [loaded, setLoaded] = useState(false)

  const setPersistedState = async (newState: T) => {
    setState(newState)
    await saveData(dbName, storeName, keyValue, newState)
  }

  useEffect(() => {
    const fetchDataAndSave = async () => {
      try {
        const storedValue = await getData<T>(dbName, storeName, keyValue)
        if (storedValue !== null) {
          setState(storedValue)
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do IndexedDB:', error)
      } finally {
        setLoaded(true)
      }
    }

    fetchDataAndSave()
  }, [dbName, keyValue, storeName])

  return [state, setPersistedState, loaded]
}

export default usePersistedStateInDB
