import chalk from 'chalk'
import type { TLog } from './types'

export const logType = {
  info: (msg: string, prefix = '') => chalk.blueBright.bold(`${prefix}${msg}`),
  error: (msg: string, prefix = '') => chalk.redBright.bold(`${prefix}${msg}`),
  warning: (msg: string, prefix = '') => chalk.yellowBright.bold(`${prefix}${msg}`),
  success: (msg: string, prefix = '') => chalk.greenBright.bold(`${prefix}${msg}`),
}
export const log = (type: TLog, msg: string, prefix = '[pr-checker]:') => {
  console.log(logType[type](prefix, msg))
}
