import path from 'path'
import { series } from 'gulp'
import fs from 'fs-extra'
import pkg from '../../package.json'
import { parallelTask } from './rewirte-path'

const distRoot = path.resolve(process.cwd(), '../../dist')
const readmeDir = path.resolve('../../README.md')
const readmeOutputDir = `${distRoot}/README.md`
const readmeCHDir = path.resolve('../../README.ZH-CN.md')
const readmeCHOutputDir = `${distRoot}/README.ZH-CN.md`

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
  await fs.copy(readmeDir, readmeOutputDir)
  await fs.copy(readmeCHDir, readmeCHOutputDir)
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
