import prompts from 'prompts'
import ora from 'ora'
import { log } from '@pr-checker/utils'
import { createPrOption, createRepoOption, typeOption } from './command-option'
import GitApi from './gitApi'
import type { IPRCheckRes, IPRInfo, IPRListItem } from './gitApi'
import type { Storage } from './storage'

export const promptsRun = async(option: prompts.PromptObject[]) => {
  const res = await prompts(option)
  return { ...res }
}

export async function runtimeStart(store: Storage) {
  // select type ( all Repo ?)
  const isAllRepo = await promptsRun(typeOption)

  let spinner = ora({ text: 'Loading Repo......', color: 'blue' }).start()
  const githubApi = new GitApi(store.token, store.username!)
  const prList = await githubApi.getPRList()
  spinner.stop()
  const repoList = Object.keys(prList)

  // select a repo to check
  if (isAllRepo.typeSelect === 'select') {
    const selectRepo = await promptsRun(createRepoOption(repoList))

    const prListByRepo = []
    const prl = prList[selectRepo.RepoSelect as keyof typeof prList] as IPRListItem[]
    spinner = ora({ text: `Checking PR by ${selectRepo.RepoSelect}......`, color: 'blue' }).start()
    for (let i = 0; i < prl.length; i++) {
      // 循环，根据 pr number 和 仓库名获取 pr 详情
      const prInfo = await githubApi.getPRByRepo(prl[i].number, prl[i].repo, prl[i].title)
      // 根据 pr 详情，检测是否可以更新
      const res = await githubApi.needUpdate(prl[i].repo, prInfo as IPRInfo)
      log('success', `✔ NO.${i + 1}:Check PR #${prl[i].number} completed`)
      prListByRepo.push({
        ...prInfo,
        isNeedUpdate: res.isNeedUpdate,
      })
    }
    spinner.stop()

    // 选择仓库下的 pr ，全部，多选
    const prSelectRes = await promptsRun(createPrOption(prListByRepo as IPRCheckRes[]))
    spinner = ora({ text: `Update PR by ${selectRepo.RepoSelect}......`, color: 'blue' }).start()
    for (let i = 0; i < prSelectRes.prSelect.length; i++) {
      if (prSelectRes.prSelect[i].isNeedUpdate) {
        await githubApi.updatePR(prSelectRes.prSelect[i].number, prSelectRes.prSelect[i].repo)
        log('success', `✔ NO.${i + 1}:Update PR #${prl[i].number} completed`)
      } else {
        // TODO console.log(prSelectRes.prSelect[i].infoTitle)
      }
    }
    spinner.stop()
    log('success', '✔ All PR updates completed')
  } else {
    // TODO
    const prl = [] as IPRListItem[]
    const prListByRepo = []
    repoList.forEach((val: string) => {
      (prList[val as keyof typeof prList] as IPRListItem[]).forEach((item: IPRListItem) => {
        prl.push(item)
      })
    })

    spinner = ora({ text: 'Checking PR......', color: 'blue' }).start()
    for (let i = 0; i < prl.length; i++) {
      // 循环，根据 pr number 和 仓库名获取 pr 详情
      const prInfo = await githubApi.getPRByRepo(prl[i].number, prl[i].repo, prl[i].title)
      // 根据 pr 详情，检测是否可以更新
      const res = await githubApi.needUpdate(prl[i].repo, prInfo as IPRInfo)
      log('success', `✔ NO.${i + 1}:Check PR #${prl[i].number} completed`)
      prListByRepo.push({
        ...prInfo,
        isNeedUpdate: res.isNeedUpdate,
      })
    }
    spinner.stop()

    const prSelectRes = await promptsRun(createPrOption(prListByRepo as IPRCheckRes[]))
    spinner = ora({ text: 'Update PR......', color: 'blue' }).start()
    for (let i = 0; i < prSelectRes.prSelect.length; i++) {
      if (prSelectRes.prSelect[i].isNeedUpdate) {
        // await githubApi.updatePR(prSelectRes.prSelect[i].number, prSelectRes.prSelect[i].repo)
        log('success', `✔ NO.${i + 1}:update PR #${prl[i].number} completed`)
      } else {
        // TODO console.log(prSelectRes.prSelect[i].infoTitle)
      }
    }
    spinner.succeed()
    log('success', '✔ All PR updates completed')
  }

  // TODO： 選擇的select中那些成功了 哪些沒有
}
