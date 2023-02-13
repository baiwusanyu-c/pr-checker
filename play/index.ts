
import { cac } from 'cac'
const cli = cac('pr-checker')

// 设置 token
cli.command('-t <token>', 'set github token').action((files, options) => {
    console.log(files, options)
})

// 设置 username
cli.command('-u <username>', 'set github username').action((files, options) => {
  console.log(files, options)
})

// 设置 clear
cli.command('-c <clear>', 'clear token and username').action((files, options) => {
  console.log(files, options)
})

// Display help message when `-h` or `--help` appears
cli.help()
// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version('0.0.0')

const parsed = cli.parse()

console.log(parsed)
