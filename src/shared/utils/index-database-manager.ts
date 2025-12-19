'use client'

export async function openDatabase(dbName: string, storeName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)

    request.onupgradeneeded = (_event: any) => {
      const db = request.result
      db.createObjectStore(storeName, { keyPath: 'id' })
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = (event) => {
      reject(event)
    }
  })
}

export function getExpirationTime(): number {
  const now = new Date()
  const expiration = new Date()

  // Set expiration to 9:00 AM
  expiration.setHours(9, 0, 0, 0)

  if (now.getHours() >= 9) {
    // If current time is 9:00 AM or later, set expiration to 9:00 AM of the next day
    expiration.setDate(now.getDate() + 1)
  }

  return expiration.getTime()
}

export async function saveData<T>(
  dbName: string,
  storeName: string,
  key: string,
  value: T,
  persist: boolean = true, // Adicionado parâmetro para decidir se expira ou não
): Promise<void> {
  const db = await openDatabase(dbName, storeName)
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const timestamp = Date.now()

    // Se persist for true, definimos um tempo de expiração infinito (ou nulo)
    const expirationTime = persist ? null : getExpirationTime()

    store.put({ id: key, value, timestamp, expirationTime })

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = (event) => {
      reject(event)
    }
  })
}

export async function getData<T>(
  dbName: string,
  storeName: string,
  key: string,
): Promise<T | null> {
  const db = await openDatabase(dbName, storeName)
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = () => {
      const result = request.result
      if (result) {
        const { value, expirationTime } = result

        // Se não houver expirationTime, o dado é persistente
        if (!expirationTime || Date.now() < expirationTime) {
          resolve(value)
        } else {
          resolve(null) // Data expired
        }
      } else {
        resolve(null) // No data found
      }
    }

    request.onerror = (event) => {
      reject(event)
    }
  })
}

export async function listDatabases(): Promise<string[]> {
  if (indexedDB.databases) {
    const databases = await indexedDB.databases()
    return databases.map((db) => db.name || '')
  } else {
    console.warn('indexedDB.databases() is not supported in this browser.')
    return []
  }
}

export async function clearAllDatabases(): Promise<void> {
  const databases = await listDatabases()

  for (const dbName of databases) {
    if (dbName) {
      await deleteDatabase(dbName)
    }
  }
  window.location.reload()
  console.log('All databases have been cleared.')
}

async function deleteDatabase(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName)

    request.onsuccess = () => {
      console.log(`Database ${dbName} deleted successfully.`)
      resolve()
    }

    request.onerror = (event) => {
      console.error(`Failed to delete database ${dbName}:`, event)
      reject(event)
    }

    request.onblocked = () => {
      console.warn(`The deletion of database ${dbName} is blocked.`)
    }
  })
}

export async function clearDatabase(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = (event) => {
      reject(event)
    }

    request.onblocked = () => {
      console.warn('The database is blocked and could not be deleted.')
    }
  })
}
