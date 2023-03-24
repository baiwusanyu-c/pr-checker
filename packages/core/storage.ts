import { existsSync, promises as fs, mkdirSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'

export interface Storage {
  lastRunCommand?: string
  token: string
  username?: string
}

let storage: Storage | undefined

const storageDir = (() => {
  const home = homedir()
  const oldPath = resolve(home, 'pr-checker-storage')

  if (existsSync(oldPath)) return oldPath

  const dotPath = resolve(home, '.config/pr-checker-storage')
  if (!existsSync(dotPath)) {
    mkdirSync(dotPath, {
      recursive: true,
    })
  }
  return dotPath
})()

const storagePath = resolve(storageDir, '_pr_checker_storage.json')

export async function loadStorage(
  fn?: (storage: Storage) => Promise<boolean> | boolean,
) {
  if (!storage) {
    storage = existsSync(storagePath)
      ? JSON.parse((await fs.readFile(storagePath, 'utf-8')) || '{}') || {}
      : {}
  }

  if (fn) if (await fn(storage!)) await saveStorage()

  return storage!
}

export async function saveStorage() {
  if (storage) {
    if (!existsSync(storageDir)) await fs.mkdir(storageDir, { recursive: true })
    await fs.writeFile(storagePath, JSON.stringify(storage), 'utf-8')
  }
}

export async function clearStorage() {
  if (storage) {
    if (!existsSync(storageDir)) await fs.mkdir(storageDir, { recursive: true })
    await fs.writeFile(storagePath, '{}', 'utf-8')
  }
}
