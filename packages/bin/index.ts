#!/usr/bin/env node
import { log, run } from '../entry'
import { name, version } from '../../package.json'

const start = async() => {
  const args = process.argv.slice(2).filter(Boolean)
  try {
    // console version
    if (args.length === 1 && (args[0] === '--version' || args[0] === '-v')) {
      console.log(`${name} v${version}`)
      return
    }

    // console help
    if (args.length === 1 && ['-h', '--help'].includes(args[0])) {
      log('info', 'pr-checker -u <username> set the author name of PRs')
      log('info', 'pr-checker -t <token> set the token of GitHub')
      log('info', 'pr-checker -c clear token  and username')
      log('info',
        'pr-checker -s <owner/repo> [-u <username>] list the PRs which has conflicts',
      )
      return
    }

    run(args)
  } catch (error) {
    process.exit(1)
  }
}

start()
