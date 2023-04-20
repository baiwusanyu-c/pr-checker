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

export interface ITask {
  fn: (...args: any[]) => any
  params: Array<any>
  retry: number
  id: number
}
export interface ITaskQueueHooks {
  onFinished?: () => void
  onTaskSucceeded?: (index: number, task: ITask) => void
  onTaskFailed?: (index: number, task: ITask) => void
}
export async function runTaskQueue(
  taskQueue: Array<ITask>,
  hook?: ITaskQueueHooks,
  maxRetry = 5,
  log = true) {
  const MAX_RETRY = maxRetry
  const failList: Array<number> = []
  const successList: Array<number> = []
  const idToIndex = { } as Record<number, number>
  async function processTask(task: ITask) {
    try {
      await task.fn(...task.params)
      successList.push(task.id)
      hook && hook.onTaskSucceeded && hook.onTaskSucceeded(idToIndex[task.id], task)
      log && console.log(`Task ${task.id} completed successfully`)
    } catch (error: any) {
      log && console.error(`Error processing task ${task.id}:`, error.message)
      task.retry++ // 增加重试次数
      if (task.retry < MAX_RETRY) {
        taskQueue.push(task) // 重试次数未达到最大值，将任务重新放入队列尾部
        log && console.log(`Task ${task.id} will be retried later`)
      } else {
        failList.push(task.id)
        hook && hook.onTaskFailed && hook.onTaskFailed(idToIndex[task.id], task)
        log && console.log(`Task ${task.id} has reached the maximum number of retries and will not be retried again`)
      }
    }
  }
  async function processTaskQueue() {
    let index = 0
    while (taskQueue.length > 0) {
      const task = taskQueue.shift() // 取出队列头部的任务
      if (task!.retry === 0) {
        idToIndex[task!.id] = index
        index++
      }
      await processTask(task!)
    }
  }
  await processTaskQueue()
  hook && hook.onFinished && hook.onFinished()
  return {
    success: successList,
    fail: failList,
  }
}

export function jsonClone(val: any) {
  return JSON.parse(JSON.stringify(val))
}
