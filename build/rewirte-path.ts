import * as process from 'process'
import * as path from 'path'
import { dest, parallel, src } from 'gulp'
import { relativeDir } from './utils'
import { distDirMap } from './contant'

const formatList = [
  { runPath: path.resolve(process.cwd(), 'dist/**/*.js'), format: '.js' },
  { runPath: path.resolve(process.cwd(), 'dist/**/*.cjs'), format: '.cjs' },
  { runPath: path.resolve(process.cwd(), 'dist/**/*.d.ts'), format: '' },
]

export const parallelTask = () => {
  const parallelTaskList: any[] = []
  formatList.forEach((formatVal) => {
    parallelTaskList.push(parallel(() => {
      return src(formatVal.runPath)
        .on('data', (fileData) => {
          // 当前读取的文件内容
          let content = fileData.contents.toString()
          // 当前读取的文件路径
          const filePath = fileData.path.replaceAll('\\', '/')
          for (const distDirMapKey in distDirMap) {
            // 生产要替换的依赖路径 @xxxx ->  ../xxxx
            let targetPath = path.resolve(
              process.cwd(),
              distDirMap[distDirMapKey as keyof typeof distDirMap])
            // 替换格式后缀 .[format] -> .js / .cjs
            targetPath = targetPath.replace('[format]', formatVal.format)
            targetPath = targetPath.replaceAll('\\', '/')
            // 生产相对路径
            const relativePath = relativeDir(targetPath, filePath)
            // 替换依赖路径内容
            content = content.replaceAll(distDirMapKey, relativePath)
          }
          fileData.contents = Buffer.from(content)
        })
        .pipe(dest('dist'))
    }))
  })

  return parallelTaskList
}
