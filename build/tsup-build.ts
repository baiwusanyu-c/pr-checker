import { defineConfig } from 'tsup'
import { CLI_ENTRY, EXT_ENTRY } from './contant'
import type { Options } from 'tsup'

const baseConfig = {
  entry: {},
  external: ['ora', 'chalk', 'fs-extra'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  outDir: '',

}
const configOptions = [] as Options[]

function setConfig(entry: Record<string, string>) {
  for (const entryKey in entry) {
    const config = JSON.parse(JSON.stringify(baseConfig))
    config.entry = [entry[entryKey as keyof typeof entry]]
    config.outDir = `../dist/${entryKey}`
    configOptions.push(config)
  }
}
setConfig(EXT_ENTRY)
setConfig(CLI_ENTRY)
export default defineConfig(configOptions)
