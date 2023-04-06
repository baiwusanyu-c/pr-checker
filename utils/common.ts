export function createRunList(
  taskNum: number,
  taskFunc: (index: number) => Promise<Record<any, any> | void>) {
  const taskList = [] as Array<Promise<any>>
  for (let i = 0; i < taskNum; i++) {
    taskList.push(new Promise((resolve) => {
      resolve(taskFunc(i))
    }))
  }
  return taskList
}

export const isEmptyObj = (item: unknown): boolean => JSON.stringify(item) === '{}'

/**
 * limitLen 默认24位半角字符长度，可修改
 **/
export function formatEllipsis(str = '', limitLen = 24) {
  let len = 0
  // eslint-disable-next-line no-control-regex
  const reg = /[\x00-\xFF]/ // 半角字符的正则匹配
  const strContent = str.split('')
  const inx = strContent.findIndex((s) => {
    len += reg.test(s) ? 1 : 2
    if (len > limitLen)
      return true
    else
      return false
  })
  return inx === -1 ? str : `${str.substr(0, inx)}...`
}
