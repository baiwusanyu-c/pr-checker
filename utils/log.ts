import chalk from 'chalk'
import type { TLog } from './types'

export const logType = {
  info: (prefix, msg: string) => chalk.blueBright.bold(`${prefix}${msg}`),
  error: (prefix, msg: string) => chalk.redBright.bold(`${prefix}${msg}`),
  warning: (prefix, msg: string) => chalk.yellowBright.bold(`${prefix}${msg}`),
  success: (prefix, msg: string) => chalk.greenBright.bold(`${prefix}${msg}`),
}
export const log = (type: TLog, msg: string, prefix = '[pr-checker]:') => {
  console.log(logType[type](prefix, msg))
}
