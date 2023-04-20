export interface IRepoListProps {
  opType: string
  token: string
  userName: string
  onSelect: (data: IRepoWithPRs) => void
}

export interface IRepo {
  name: string
  uname: string
  url: string
}

export interface IRepoWithPRs extends IRepo {
  pullRequests: Record<any, any>[]
}

export declare type TLog = 'error' | 'warning' | 'info' | 'success'

export declare type opFlag = 0 | 1 | 2 | 3

export declare type PRStateText = 'code conflict' | 'unstable' | 'can merge' | 'can rebase' | 'no update' | 'unknown error'

export interface IPR extends IRepoWithPRs {
  repo: string
  repository_url: string
  fork: boolean
  number: number
  title: string
  html_url: string
  id: number
  head: {
    repo: {
      full_name: string
    }
    ref: string
  }
  base: {
    ref: string
  }
  author: string
  opFlag: opFlag
  state: PRStateText
  repoName: string
}
export declare type IPRList = Array<IPR>
export declare type IPRListMap = Record<string, IPRList>

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

export interface ParsedArgv {
  args: ReadonlyArray<string>
  options: Record<string, any>
}

export interface Storage {
  lastRunCommand?: string
  token: string
  username?: string
}

export interface IPRSelect {
  title: string
  number: number
  repo: string
  canOp: boolean
  reason: string
  infoTitle: string
}
export declare type IPRSelectList = Array<IPRSelect>
export interface IPRSelectRes {
  prSelect: IPRSelectList
}

export declare type modeType = 'merge' | 'rebase'

export interface ISearchL {
  title: string
  author: string
}

export interface IUserInfo {
  html_url: string
  avatar_url: string
  login: string
  name: string
}
