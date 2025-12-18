'use client'

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react'

interface ZoomContextType {
  zoom: number
  onResetZoom: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomChange: (zoom: number) => void
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined)

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [zoom, setZoom] = useState(1)

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3))
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
  }, [])

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
  }, [])

  const values = {
    zoom,
    onResetZoom: handleResetZoom,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onZoomChange: onZoomChange,
  }
  return <ZoomContext.Provider value={values}>{children}</ZoomContext.Provider>
}

export function useZoom() {
  const context = useContext(ZoomContext)
  if (context === undefined) {
    throw new Error('<useZoom> deve ser usado dentro de um ZoomProvider')
  }
  return context
}
