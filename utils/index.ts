export * from './log'
export * from './git-api'

export function createRunList(
  taskNum: number,
  taskFunc: (index: number) => Promise<Record<any, any>>) {
  const taskList = [] as Array<Promise<any>>
  for (let i = 0; i < taskNum; i++) {
    taskList.push(new Promise((resolve) => {
      resolve(taskFunc(i))
    }))
  }
  return taskList
}

export const isEmptyObj = (item: unknown): boolean => JSON.stringify(item) === '{}'
