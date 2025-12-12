'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  RefObject,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'

interface LoadingContextType {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider')
  }
  return context
}
