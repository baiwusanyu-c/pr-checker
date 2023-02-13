import * as process from 'process'
import { log } from '@pr-checker/utils'

export const runtime = () => {
  log('info', `test running....${process.env.RUNTIME_ENV}`)
}

export const runtimeBrowser = () => {
  log('info', 'test running....')
}
