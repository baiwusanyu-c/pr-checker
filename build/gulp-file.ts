import path from 'path'
import { series } from 'gulp'
import fs from 'fs-extra'
import pkg from '../package.json'
import { parallelTask } from './rewirte-path'

const distRoot = path.resolve(process.cwd(), '../dist')
const movePkgToRootDist = async() => {
  const content = JSON.parse(JSON.stringify(pkg))
  Reflect.deleteProperty(content, 'scripts')
  Reflect.deleteProperty(content, 'lint-staged')
  Reflect.deleteProperty(content, 'devDependencies')
  Reflect.deleteProperty(content, 'eslintConfig')
  content.type = 'module'
  content.scripts = {
    'publish:cli': 'pnpm publish --no-git-checks --access public',
    'publish:ext': 'pnpm publish --no-git-checks --access public',
  }
  await fs.writeJson(`${distRoot}/package.json`, content, { spaces: 2 })
}

const moveReadMeToRootDist = async() => {
  await fs.copy(`${path.resolve('../README.md')}`, `${distRoot}/README.md`)
  await fs.copy(`${path.resolve('../README.ZH-CN.md')}`, `${distRoot}/README-CN.md`)
}

export default series(
  ...parallelTask(),
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
)
