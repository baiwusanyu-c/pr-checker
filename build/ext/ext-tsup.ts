import { defineConfig } from 'tsup'
import { EXT_ENTRY } from '../utils'
import type { Options } from 'tsup'

const outputDir = '../dist'

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
    config.outDir = `${outputDir}/${entryKey}`
    configOptions.push(config)
  }
}
setConfig(EXT_ENTRY)
export default defineConfig(configOptions)
