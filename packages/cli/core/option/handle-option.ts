import { log } from 'baiwusanyu-utils'
import { clearStorage, loadStorage, saveStorage } from '../store/storage'
import type { ParsedArgv } from '@pr-checker/utils/types'
export async function handleOption(parseRes: ParsedArgv) {
  // load storage
  const storage = await loadStorage()

  const {
    u, username,
    t, token,
    c, clear,
    g, get,
  } = parseRes.options

  // clear token and username
  if (c || clear) {
    if (storage) {
      await clearStorage()
      log('success', 'clear token and username successfully')
      return
    }
  }

  // get git config
  if (g || get) {
    if (storage) {
      log('info', `username: ${storage.username || 'null'}`)
      log('info', `token: ${storage.token || 'null'}`)
      return
    }
  }

  // set git token
  if ((t && typeof t === 'string') || (token && typeof token === 'string')) {
    storage.token = t || token
    await saveStorage()
    log('success', 'token set successfully')
    return
  }

  // set username
  if ((u && typeof u === 'string') || (username && typeof username === 'string')) {
    storage.username = u || username
    await saveStorage()
    log('success', 'username set successfully')
  }
}
