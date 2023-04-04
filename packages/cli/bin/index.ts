#!/usr/bin/env node
import { run } from '../core'
const start = async() => {
  try {
    await run()
  } catch (error) {
    process.exit(1)
  }
}

start()
