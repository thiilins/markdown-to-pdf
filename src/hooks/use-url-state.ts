'use client'

import { createShareableUrl, getUrlState, stateToQueryParams } from '@/lib/routing'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook para gerenciar estado na URL
 * Lê estado da URL e permite atualizar
 *
 * NOTA: useSearchParams() deve ser usado dentro de um Suspense boundary
 * Este hook lê os searchParams diretamente do window.location para evitar o erro
 */
export function useUrlState<T extends Record<string, any>>(
  currentState: T,
  onStateFromUrl: (state: Partial<T>) => void,
  options: {
    syncToUrl?: boolean // Se deve sincronizar mudanças do estado para URL
    debounceMs?: number // Delay para atualizar URL (evita muitas atualizações)
  } = {},
) {
  const router = useRouter()
  const pathname = usePathname()
  const { syncToUrl = true, debounceMs = 500 } = options

  // Lê searchParams diretamente do window para evitar necessidade de Suspense
  const getSearchParams = useCallback(() => {
    if (typeof window === 'undefined') return new URLSearchParams()
    return new URLSearchParams(window.location.search)
  }, [])

  // Lê estado inicial da URL (apenas uma vez na montagem)
  const hasReadInitialState = useRef(false)

  useEffect(() => {
    if (hasReadInitialState.current) return

    const searchParams = getSearchParams()
    const urlState = getUrlState(searchParams)
    if (Object.keys(urlState).length > 0) {
      onStateFromUrl(urlState as Partial<T>)
    }
    hasReadInitialState.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Apenas na montagem

  // Atualiza URL quando estado muda (com debounce)
  // Mas só se já lemos o estado inicial (evita atualizar durante o carregamento inicial)
  useEffect(() => {
    if (!syncToUrl || !hasReadInitialState.current) return

    const timeoutId = setTimeout(() => {
      const params = stateToQueryParams(currentState)
      const queryString = new URLSearchParams(params).toString()

      // Usa replace para não adicionar ao histórico
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [currentState, syncToUrl, debounceMs, router, pathname])

  // Função para gerar URL compartilhável
  const getShareableUrl = useCallback(
    (useSerialized: boolean = false) => {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin + pathname : ''
      return createShareableUrl(currentState, baseUrl, useSerialized)
    },
    [currentState, pathname],
  )

  // Função para copiar URL para clipboard
  const copyShareableUrl = useCallback(
    async (useSerialized: boolean = false) => {
      const url = getShareableUrl(useSerialized)
      try {
        await navigator.clipboard.writeText(url)
        return { success: true, url }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }
      }
    },
    [getShareableUrl],
  )

  return {
    getShareableUrl,
    copyShareableUrl,
  }
}
