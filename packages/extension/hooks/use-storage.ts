
export enum CACHE_KEYS {
  TOKEN = 'TOKEN',
  OP_TYPE = 'OP_TYPE',
  USER_INFO = 'user_info',
}

const cache = {} as Record<string, unknown>

export function useStorage() {
  syncCache()
  async function syncCache() {
    try {
      const items = await getAllStorageSyncData()
      cache.value = Object.assign({}, cache.value, items)
    } catch (error) {
      console.error(error)
    }
  }

  function setItem(key: CACHE_KEYS, value: unknown): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        syncCache().then(() => {
          resolve()
        })
      })
    })
  }

  function getItem(key: CACHE_KEYS): Promise<unknown> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result: any) => {
        resolve(result[key])
      })
    })
  }

  function removeItem(key: CACHE_KEYS | CACHE_KEYS[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(key, () => {
        syncCache().then(() => {
          resolve()
        })
      })
    })
  }

  return {
    CACHE_KEYS: JSON.parse(JSON.stringify(CACHE_KEYS)),
    cache: JSON.parse(JSON.stringify(cache)),
    setItem,
    getItem,
    removeItem,
  }
}

export async function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, (items: any) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError)
        return reject(chrome.runtime.lastError)

      // Pass the data retrieved from storage down the promise chain.
      resolve(items)
    })
  })
}
