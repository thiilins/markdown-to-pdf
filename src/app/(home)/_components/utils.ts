'use client'

import { useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

export function useMousePosition() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const updateMousePosition = (e: globalThis.MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [mouseX, mouseY])

  return { mouseX, mouseY }
}

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
