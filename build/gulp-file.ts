import path from 'path'
import { series } from 'gulp'
import fs from 'fs-extra'
import pkg from '../package.json'
import { run } from './utils'
import { parallelTask } from './rewirte-path'
import { entry } from './contant'

const distRoot = path.resolve(process.cwd(), '../dist')

const moveDistToRoot = async() => {
  const distPathInBuild = path.resolve(process.cwd(), 'dist')
  await fs.copySync(distPathInBuild, distRoot)
}

const movePkgToRootDist = async() => {
  const content = JSON.parse(JSON.stringify(pkg))
  Reflect.deleteProperty(content, 'scripts')
  Reflect.deleteProperty(content, 'lint-staged')
  Reflect.deleteProperty(content, 'devDependencies')
  Reflect.deleteProperty(content, 'eslintConfig')
  content.type = 'module'
  content.files = []
  // 寫入 files
  for (const key in entry) {
    if (key !== 'index')
      content.files.push(key)
  }
  await fs.writeJson(`${distRoot}/package.json`, content, { spaces: 2 })
}

const moveReadMeToRootDist = async() => {
  await fs.copy(`${path.resolve('../README.md')}`, `${distRoot}/README.md`)
  await fs.copy(`${path.resolve('../README.ZH-CN.md')}`, `${distRoot}/README-CN.md`)
}

export default series(
  ...parallelTask(),
  // 移动dist
  async() => { await moveDistToRoot() },
  // 移动 package.json 到 dist
  async() => {
    const res = await movePkgToRootDist()
    return res
  },
  // 移动 readme 到 dist
  async() => {
    const res = await moveReadMeToRootDist()
    return res
  },
  // 删build目录下dist
  async() => { await run('pnpm run --filter @pr-checker/build clean') },
)
