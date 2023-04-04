import * as process from 'process'
import { log } from '@pr-checker/utils'
import { cac } from 'cac'
import { getUserName } from '@pr-checker/utils/git-api'
import { version } from '../../../package.json'
import { loadStorage, saveStorage } from './store/storage'
import { handleSelect } from './select/handle-select'
import { handleOption } from './option/handle-option'
import type { Storage } from './store/storage'

export const run = async() => {
  const cliInst = await initCli()
  await handleOption(cliInst.parse())
}

async function initCli() {
  const cli = cac('pr-checker')
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
      storage.username = login
      await saveStorage()
    }
    await handleSelect(storage as Storage)
  })
  cli.help()
  cli.version(version)
  return cli
}
