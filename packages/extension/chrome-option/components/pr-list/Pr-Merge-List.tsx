import { useEffect, useState } from 'react'
import { createRunList } from '@pr-checker/utils/common'
import { getPRs } from '@pr-checker/fetchGit'
import { App } from 'antd'
import { PrList } from './Pr-List'
import type { opFlag } from './Pr-List'
import type { IRepoWithPRs } from '../Repo-List'
interface PrListProps {
  opType: string
  repoInfo: IRepoWithPRs
  token: string
}


export const PrMergeList = (props: PrListProps) => {
  const [repoInfoInner, setRepoInfoInner] = useState(props.repoInfo)
  useEffect(() => {
    if (props.repoInfo.pullRequests.length > 0)
      getPRsByRepo(props.repoInfo.uname)
  }, [props.repoInfo])

  async function getPRsByRepo(uname: string) {
    const res = await getPRs(props.token, uname)
    setRepoInfoInner({ ...props.repoInfo, pullRequests: res })
  }

  const { message } = App.useApp()
  async function mergePrList(token: string, repoName: string, numberArr: number[] | string[]) {
    try {
      await Promise.all(createRunList(numberArr.length, async(i: number) => {
        // TODO add to merge queue
        // TODO await rebasePr(token, repoName, numberArr[i])
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
