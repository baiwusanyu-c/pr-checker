import path from 'path'
import { series } from 'gulp'
import fs from 'fs-extra'
import { run } from './utils'
import { parallelTask } from './rewirte-path'

const moveDistToRoot = async() => {
  const distPathInBuild = path.resolve(process.cwd(), 'dist')
  const distPathToRoot = path.resolve(process.cwd(), '../dist')
  await fs.copySync(distPathInBuild, distPathToRoot)
}
export default series(
  ...parallelTask(),
  // 移动dist
  async() => { await moveDistToRoot() },
  // 删build目录下dist
  async() => { await run('pnpm run --filter @pr-checker/build clean') },
)
