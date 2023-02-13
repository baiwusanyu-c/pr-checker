
import { cac } from 'cac'
const cli = cac('pr-checker')

// 设置 token
cli.option('-t <token>,--token <token>', 'set github token')

// 设置 username
cli.option('-u <username>, --username <username>', 'set github username')

// 设置 clear
cli.option('-c, --clear', 'clear token and username')

cli.command('run').action(async(root, argv) => {
  console.log(root, argv)
})
cli.help()
cli.version('0.0.0')
const asd = cli.parse()
console.log(asd.options.t)
