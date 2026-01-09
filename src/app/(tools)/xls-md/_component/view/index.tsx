'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EXAMPLE_CSV, EXAMPLE_JSON } from '../constants'
import {
  csvToMarkdown,
  getAllColumnStats,
  jsonToMarkdown,
  sortByColumn,
  transposeTable,
  validateCSV,
  validateJSON,
} from '../excel-utils'
import { ExcelMdDesktop } from './desktop'
import { ExcelMdMobile } from './mobile'

export function ExcelMdViewComponent() {
  const [input, setInput] = useState<string>(EXAMPLE_CSV)
  const [mode, setMode] = useState<'csv' | 'json' | 'upload'>('csv')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [options, setOptions] = useState<ConversionOptions>({
    alignments: [],
    removeEmptyColumns: false,
    escapeSpecialChars: false,
    format: 'markdown',
    compact: false,
  })
  const [columnStats, setColumnStats] = useState<ColumnStats[]>([])

  const handleConvert = useCallback(
    async (customOptions?: ConversionOptions) => {
      if (!input.trim()) {
        setResult(null)
        setColumnStats([])
        return
      }

      setIsProcessing(true)

      try {
        let conversionResult: ConversionResult
        const currentOptions = customOptions || options

        if (mode === 'csv') {
          const validation = validateCSV(input)
          if (!validation.isValid) {
            toast.error(validation.errors[0] || 'CSV inválido')
            setResult(null)
            setColumnStats([])
            setIsProcessing(false)
            return
          }

          if (validation.warnings.length > 0) {
            validation.warnings.forEach((warning) => toast.warning(warning))
          }

          conversionResult = csvToMarkdown(input, currentOptions)
        } else {
          const validation = validateJSON(input)
          if (!validation.isValid) {
            toast.error(validation.errors[0] || 'JSON inválido')
            setResult(null)
            setColumnStats([])
            setIsProcessing(false)
            return
          }

          if (validation.warnings.length > 0) {
            validation.warnings.forEach((warning) => toast.warning(warning))
          }

          conversionResult = jsonToMarkdown(input, currentOptions)
        }

        setResult(conversionResult)

        // Calcula estatísticas
        if (conversionResult.data.length > 0) {
          const stats = getAllColumnStats(conversionResult.headers, conversionResult.data)
          setColumnStats(stats)
        }

        toast.success('Tabela convertida com sucesso!')
      } catch (error: any) {
        console.error('Erro ao converter:', error)
        toast.error(error.message || 'Erro ao converter dados')
        setResult(null)
        setColumnStats([])
      } finally {
        setIsProcessing(false)
      }
    },
    [input, mode, options],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        handleConvert()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [input, mode, handleConvert])

  const handleOptionsChange = useCallback(
    (newOptions: ConversionOptions) => {
      setOptions(newOptions)
      // Reconverte com as novas opções
      if (result) {
        handleConvert(newOptions)
      }
    },
    [result, handleConvert],
  )

  const handleTranspose = useCallback(() => {
    if (!result) {
      toast.error('Nenhuma tabela para transpor')
      return
    }

    const transposed = transposeTable(result.headers, result.data)

    // Reconverte com dados transpostos
    const newInput = [
      transposed.headers.join(','),
      ...transposed.rows.map((row) => row.join(',')),
    ].join('\n')

    setInput(newInput)
    setMode('csv')
    toast.success('Tabela transposta!')
  }, [result])

  const handleSort = useCallback(
    (columnIndex: number, direction: 'asc' | 'desc') => {
      if (!result) {
        toast.error('Nenhuma tabela para ordenar')
        return
      }

      const sorted = sortByColumn(result.headers, result.data, columnIndex, direction)

      // Reconverte com dados ordenados
      const newInput = [result.headers.join(','), ...sorted.map((row) => row.join(','))].join('\n')

      setInput(newInput)
      setMode('csv')
      toast.success(
        `Ordenado por "${result.headers[columnIndex]}" (${direction === 'asc' ? 'crescente' : 'decrescente'})`,
      )
    },
    [result],
  )

  const handleCopy = useCallback(async () => {
    if (!result) {
      toast.error('Nenhuma tabela para copiar')
      return
    }
    await navigator.clipboard.writeText(result.markdown)
    toast.success('Markdown copiado!')
  }, [result])

  const handleClear = useCallback(() => {
    setInput('')
    setResult(null)
    setColumnStats([])
  }, [])

  const handleReset = useCallback(() => {
    setInput(mode === 'csv' ? EXAMPLE_CSV : EXAMPLE_JSON)
    setOptions({
      alignments: [],
      removeEmptyColumns: false,
      escapeSpecialChars: false,
      format: 'markdown',
      compact: false,
    })
  }, [mode])

  const handleDownloadMarkdown = useCallback(() => {
    if (!result) {
      toast.error('Nenhuma tabela para baixar')
      return
    }
    const extension =
      options.format === 'html'
        ? 'html'
        : options.format === 'latex'
          ? 'tex'
          : options.format === 'ascii'
            ? 'txt'
            : 'md'
    const mimeType = options.format === 'html' ? 'text/html' : 'text/plain'

    const blob = new Blob([result.markdown], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tabela.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Arquivo baixado! (${extension.toUpperCase()})`)
  }, [result, options.format])

  const handleFileUpload = useCallback((uploadResult: ConversionResult) => {
    setResult(uploadResult)
    setInput('')
  }, [])

  const handleModeChange = useCallback((newMode: 'csv' | 'json' | 'upload') => {
    setMode(newMode)
    if (newMode === 'csv') {
      setInput(EXAMPLE_CSV)
    } else if (newMode === 'json') {
      setInput(EXAMPLE_JSON)
    }
  }, [])

  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    setMounted(true)
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  if (!mounted) return null
  return isDesktop ? (
    <ExcelMdDesktop
      input={input}
      setInput={setInput}
      mode={mode}
      handleModeChange={handleModeChange}
      handleFileUpload={handleFileUpload}
      result={result}
      columnStats={columnStats}
      isProcessing={isProcessing}
      handleDownloadMarkdown={handleDownloadMarkdown}
      handleCopy={handleCopy}
      options={options}
      handleOptionsChange={handleOptionsChange}
      handleTranspose={handleTranspose}
      handleSort={handleSort}
      handleClear={handleClear}
      handleReset={handleReset}
    />
  ) : (
    <ExcelMdMobile
      input={input}
      setInput={setInput}
      mode={mode}
      handleModeChange={handleModeChange}
      handleFileUpload={handleFileUpload}
      result={result}
      columnStats={columnStats}
      isProcessing={isProcessing}
      handleDownloadMarkdown={handleDownloadMarkdown}
      handleCopy={handleCopy}
      options={options}
      handleOptionsChange={handleOptionsChange}
      handleTranspose={handleTranspose}
      handleSort={handleSort}
    />
  )
}
