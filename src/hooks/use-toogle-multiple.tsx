import { useCallback, useState } from 'react'

export const useToogleMultiple = () => {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }, [])
  return { selected, toggle }
}
