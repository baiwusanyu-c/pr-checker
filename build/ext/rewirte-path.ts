import * as process from 'process'
import * as path from 'path'
import { dest, parallel, src } from 'gulp'

const formatList = [
  { runPath: path.resolve(process.cwd(), '../../dist/**/*.html'), format: '.html' },
]
const outputDir = '../../dist'

export const parallelTask = () => {
  const parallelTaskList: any[] = []
  formatList.forEach((formatVal) => {
    parallelTaskList.push(parallel(() => {
      return src(formatVal.runPath)
        .on('data', (fileData) => {
          // 当前读取的文件内容
          let content = fileData.contents.toString()
          content = content.replaceAll('href="/favicon.ico"', 'href="../favicon.ico"')
          content = content.replaceAll('="/assets/', '="../assets/')
          fileData.contents = Buffer.from(content)
        })
        .pipe(dest(outputDir))
    }))
  })

  return parallelTaskList
}
