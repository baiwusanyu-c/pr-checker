import { useCallback, useEffect, useState } from 'react'
import { runTaskQueue } from '@pr-checker/utils/common'
import { batchesMergePr, getPRs } from '@pr-checker/fetchGit'
import { App } from 'antd'
import { PrList } from './PrList'
import type { ITask } from '@pr-checker/utils/common'
import type { DataType, opFlag } from './PrList'
import type { IRepoWithPRs } from '../RepoList'
interface PrListProps {
  opType: string
  repoInfo: IRepoWithPRs
  token: string
}

export const PrMergeList = (props: PrListProps) => {
  const [repoInfoInner, setRepoInfoInner] = useState(props.repoInfo)

  const getPRsByRepo = useCallback(async(repoInfo: IRepoWithPRs) => {
    const res = await getPRs(props.token, repoInfo.uname)
    setRepoInfoInner({ ...repoInfo, pullRequests: res })
  }, [props.token])

  useEffect(() => {
    if (props.repoInfo?.pullRequests?.length > 0)
      getPRsByRepo(props.repoInfo)
  }, [props.repoInfo, getPRsByRepo])

  const { message } = App.useApp()
  async function mergePrList(token: string, repoName: string, itemArr: DataType[]) {
    try {
      const taskList: Array<ITask> = []
      for (let i = 0; i < itemArr.length; i++) {
        const params = {
          commit_message: `【pr-checker】Merging pull requests: #${itemArr[i].number}`,
          merge_method: 'squash',
        }
        taskList.push({
          fn: batchesMergePr,
          params: [token, repoName, itemArr[i].number, params],
          retry: 0,
          id: Number(itemArr[i].number),
        })
      }
      // TODO 收集失败和成功信息
      await runTaskQueue(taskList, {
        onFinished: () => {
          message.open({
            type: 'success',
            content: `${props.opType} success`,
          })
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const disablePolicy = (flag: opFlag) => {
    return !(flag === 2 || flag === 0)
  }
  return (
    <PrList
      updatePr={mergePrList}
      disablePolicy={disablePolicy}
      opType={props.opType}
      repoInfo={repoInfoInner}
      token={props.token}
    />
  )
}
