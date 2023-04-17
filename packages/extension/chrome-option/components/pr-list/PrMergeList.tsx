import { useCallback, useEffect, useState } from 'react'
import { createRunList } from '@pr-checker/utils/common'
import { batchesMergePr, getPRs } from '@pr-checker/fetchGit'
import { App } from 'antd'
import { PrList } from './PrList'
import type { opFlag } from './PrList'
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
      await Promise.all(createRunList(itemArr.length, async(i: number) => {
        // TODO: merge queue 没有 api，我们只能轮训了
        // TODO: 查询组织仓库？
        await batchesMergePr(token, repoName, itemArr[i].number, params)
      }))
      message.open({
        type: 'success',
        content: `${props.opType} success`,
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
