/**
 * Sistema de histórico de URLs extraídas usando IndexedDB
 * Armazena até 100 URLs mais recentes com metadados
 */

export interface HistoryEntry {
  id: string // URL como ID único
  url: string
  title: string
  excerpt?: string
  timestamp: number
  success: boolean
}

const DB_NAME = 'web-extractor-db'
const STORE_NAME = 'history'
const DB_VERSION = 1
const MAX_HISTORY_ITEMS = 100

/**
 * Abre conexão com IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Cria object store se não existir
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
        objectStore.createIndex('url', 'url', { unique: false })
      }
    }
  })
}

/**
 * Salva uma entrada no histórico
 */
export async function saveToHistory(entry: Omit<HistoryEntry, 'id'>): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // Usa URL como ID único (normalizada)
    const id = normalizeUrl(entry.url)
    const fullEntry: HistoryEntry = { ...entry, id }

    // Salva ou atualiza
    store.put(fullEntry)

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })

    // Limpa histórico antigo se exceder o limite
    await cleanOldHistory()

    db.close()
  } catch (error) {
    console.error('Erro ao salvar no histórico:', error)
  }
}

/**
 * Busca todo o histórico ordenado por timestamp (mais recente primeiro)
 */
export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('timestamp')

    return new Promise((resolve, reject) => {
      const request = index.openCursor(null, 'prev') // Ordem decrescente
      const results: HistoryEntry[] = []

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          results.push(cursor.value)
          cursor.continue()
        } else {
          resolve(results)
          db.close()
        }
      }

      request.onerror = () => {
        reject(request.error)
        db.close()
      }
    })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }
}

/**
 * Busca entradas do histórico por query (URL ou título)
 */
export async function searchHistory(query: string): Promise<HistoryEntry[]> {
  const history = await getHistory()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return history

  return history.filter(
    (entry) =>
      entry.url.toLowerCase().includes(lowerQuery) ||
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.excerpt?.toLowerCase().includes(lowerQuery),
  )
}

/**
 * Remove uma entrada do histórico
 */
export async function removeFromHistory(id: string): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    store.delete(id)

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })

    db.close()
  } catch (error) {
    console.error('Erro ao remover do histórico:', error)
  }
}

/**
 * Limpa todo o histórico
 */
export async function clearHistory(): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    store.clear()

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })

    db.close()
  } catch (error) {
    console.error('Erro ao limpar histórico:', error)
  }
}

/**
 * Remove entradas antigas se exceder o limite
 */
async function cleanOldHistory(): Promise<void> {
  try {
    const history = await getHistory()

    if (history.length > MAX_HISTORY_ITEMS) {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      // Remove as mais antigas (últimas do array já ordenado)
      const toRemove = history.slice(MAX_HISTORY_ITEMS)
      toRemove.forEach((entry) => store.delete(entry.id))

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })

      db.close()
    }
  } catch (error) {
    console.error('Erro ao limpar histórico antigo:', error)
  }
}

/**
 * Normaliza URL para usar como ID
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // Remove trailing slash e hash
    return parsed.origin + parsed.pathname.replace(/\/$/, '') + parsed.search
  } catch {
    return url
  }
}
