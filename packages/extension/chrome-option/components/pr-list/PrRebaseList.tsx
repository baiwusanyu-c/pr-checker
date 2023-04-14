import { createRunList } from '@pr-checker/utils/common'
import { rebasePr } from '@pr-checker/fetchGit'
import { App } from 'antd'
import { PrList } from './PrList'
import type { IRepoWithPRs } from '../RepoList'
import type { opFlag } from './PrList'
interface PrListProps {
  opType: string
  repoInfo: IRepoWithPRs
  token: string
}

export const PrRebaseList = (props: PrListProps) => {
  const disablePolicy = (flag: opFlag) => {
    return flag !== 2
  }

  const { message } = App.useApp()
  async function rebasePrList(
    token: string,
    repoName: string,
    numberArr: number[] | string[]) {
    try {
      await Promise.all(createRunList(numberArr.length, async(i: number) => {
        await rebasePr(token, repoName, numberArr[i])
      }))
      message.open({
        type: 'success',
        content: `${props.opType} success`,
      })
    } catch (e) {
      console.error(e)
    }
  }
  return (
      <PrList
        updatePr={rebasePrList}
        disablePolicy={disablePolicy}
        opType={props.opType}
        repoInfo={props.repoInfo}
        token={props.token}
      />
  )
}
