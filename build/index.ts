import { defineConfig } from 'tsup'
import { entry } from './contant'

const baseConfig = {
  entry: {},
  external: ['ora', 'chalk', 'fs-extra'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: false,
  dts: false,
  outDir: '../dist',

}
const configOptions = []

for (const entryKey in entry) {
  const config = JSON.parse(JSON.stringify(baseConfig))
  config.entry = [entry[entryKey as keyof typeof entry]]
  config.outDir = entryKey === 'index' ? './dist' : `./dist/${entryKey}`
  config.dts = true
  configOptions.push(config)
}

export default defineConfig(configOptions)
