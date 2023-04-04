import * as process from 'process'
import { log } from '@pr-checker/utils'
import { cac } from 'cac'
import { version } from '../../../package.json'
import { clearStorage, loadStorage, saveStorage } from './storage'
import { runtimeStart } from './runtime'
import { getUserName } from './git-api'
import type { Storage } from './storage'
const cli = cac('pr-checker')
export const run = async() => {
  // load storage
  const storage = await loadStorage()
  // set github token
  cli.option('-t <token>,--token <token>', 'set github token')
  // set github username
  cli.option('-u <username>, --username <username>', 'set github username')
  // clear token and username
  cli.option('-c, --clear', 'clear token and username')
  // get git config
  cli.option('-g, --get', 'get git config')

  cli.command('run', 'check your pr').action(async() => {
    if (!storage.token) {
      log('error', 'use `pr-checker -t <TOKEN>` to set your token')
      process.exit(1)
    }

    if (!storage.username) {
      log('info', 'You have not set a username, '
        + 'it has been automatically set for you according to the token')
      const { login } = await getUserName(storage.token)
      await setUserName(login)
    }
    await runtimeStart(storage as Storage)
  })
  cli.help()
  cli.version(version)
  const parseRes = cli.parse()
  const {
    u, username,
    t, token,
    c, clear,
    h, help,
    v, version: versions,
    g, get,
  } = parseRes.options
  if (h || help || v || versions)
    return

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
    await setUserName()
    log('success', 'username set successfully')
  }

  async function setUserName(name?: string) {
    storage.username = name || u || username
    await saveStorage()
  }
}
