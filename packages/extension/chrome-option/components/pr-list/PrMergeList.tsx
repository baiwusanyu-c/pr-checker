import { useCallback, useEffect, useState } from 'react'
import { runTaskQueue } from '@pr-checker/utils/common'
import { batchesMergePr, getPRs } from '@pr-checker/fetchGit'
import { App } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { PrList } from './PrList'
import type { DataType } from './PrList'
import type { IRepoWithPRs, ITask, opFlag } from '@pr-checker/utils/types'
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

  const { modal, message } = App.useApp()
  const { error } = modal
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

      const failTaskList: DataType[] = []
      await runTaskQueue(taskList, {
        onFinished: () => {
          if (failTaskList.length > 0) {
            error({
              title: 'Tips',
              icon: <ExclamationCircleFilled />,
              content: (
                <div className="text-lg">
                  <p className="m-0">For some unknown reason your operation failed for the following pr</p>
                  {
                    failTaskList.map((value) => {
                      return (
                        <p className="m-0 text-main" key={value.number + value.repoName}>
                          # {value.number}
                        </p>
                      )
                    })
                  }
                </div>
              ),
            })
          } else {
            message.open({
              type: 'success',
              content: `${props.opType} success`,
            })
          }
        },
        onTaskFailed(index) {
          failTaskList.push(itemArr[index])
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
