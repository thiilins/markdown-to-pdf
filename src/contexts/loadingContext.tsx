'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  RefObject,
  useCallback,
} from 'react'

interface LoadingContextType {
  loading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const loading = useRef<boolean>(false)
  const setLoading = useCallback((value: boolean) => {
    loading.current = value
  }, [])

  return (
    <LoadingContext.Provider value={{ loading: loading.current, setLoading: setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider')
  }
  return context
}
