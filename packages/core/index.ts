import * as process from 'process'
import { log } from '@pr-checker/utils'
import { clearStorage, loadStorage, saveStorage } from './storage'

export const run = async(args: Array<string>) => {
  // load storage
  const storage = await loadStorage()
  console.log(storage)
  if (args[0] === '-c' && storage) {
    await clearStorage()
    log('success', 'clear token and username successfully')
    return
  }
  // set git token
  if (args[0] === '-t') {
    storage.token = args[1]
    await saveStorage()
    log('success', 'token set successfully')
    return
  }

  // set username
  if (args[0] === '-u') {
    storage.username = args[1]
    await saveStorage()
    log('success', 'username set successfully')
    return
  }

  if (!storage.token) {
    log('error', 'use `pr-checker -t <TOKEN>` to set your token')
    process.exit(1)
  }
}
