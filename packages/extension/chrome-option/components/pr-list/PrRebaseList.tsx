import { createRunList } from '@pr-checker/utils/common'
import { rebasePr } from '@pr-checker/fetchGit'
import { App } from 'antd'
import { PrList } from './PrList'
import type { IRepoWithPRs } from '../RepoList'
import type { DataType, opFlag } from './PrList'
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
    itemArr: DataType[]) {
    try {
      await Promise.all(createRunList(itemArr.length, async(i: number) => {
        await rebasePr(token, repoName, itemArr[i].number)
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
