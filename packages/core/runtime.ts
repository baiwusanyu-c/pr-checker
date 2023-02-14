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
  const api = new GitApi(store.token, store.username!)
  const prList = await api.getPRList()
  spinner.stop()
  const repoList = Object.keys(prList)

  // select a repo to check
  if (isAllRepo.typeSelect === 'select') {
    const selectRepo = await promptsRun(createRepoOption(repoList))

    const prListByRepo = []
    const prl = prList[selectRepo.RepoSelect as keyof typeof prList] as IPRListItem[]
    spinner = ora({ text: `Checking Pr by ${selectRepo.RepoSelect}......`, color: 'blue' }).start()
    for (let i = 0; i < prl.length; i++) {
      // 循环，根据 pr number 和 仓库名获取 pr 详情
      const prInfo = await api.getPRByRepo(prl[i].number, prl[i].repo, prl[i].title)
      // 根据 pr 详情，检测是否可以更新
      const res = await api.needUpdate(prl[i].repo, prInfo as IPRInfo)
      log('success', `check pr #${prl[i].number} completed`)
      prListByRepo.push({
        ...prInfo,
        isNeedUpdate: res.isNeedUpdate,
      })
    }
    spinner.stop()

    // 选择仓库下的 pr ，全部，多选
    const prSelect = await promptsRun(createPrOption(prListByRepo as IPRCheckRes[]))
    spinner = ora({ text: `update Pr by ${selectRepo.RepoSelect}......`, color: 'blue' }).start()
    for (let i = 0; i < prSelect.length; i++) {
      if (prSelect[i].isNeedUpdate) {
        await api.updatePR(prSelect[i].number, prSelect[i].repo)
        log('success', `update pr #${prl[i].number} completed`)
      }
    }
    log('success', 'All PR updates completed')
    spinner.succeed()
  } else {
    console.log('TODO.....')
  }
}
