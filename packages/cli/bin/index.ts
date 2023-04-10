#!/usr/bin/env node
// @ts-expect-error ignore it
import { run } from '@pr-checker/core'
const start = async() => {
  try {
    await run()
  } catch (error) {
    process.exit(1)
  }
}

start()
