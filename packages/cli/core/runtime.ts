import prompts from 'prompts'
import ora from 'ora'
import { isEmptyObj, log } from '@pr-checker/utils'
import { Table } from 'console-table-printer'
import chalk from 'chalk'
import { createPrOption, createRepoOption, typeOption } from './command-option'
import GitApi from './git-api'
import type { IPRCheckRes, IPRInfo, IPRListItem } from './git-api'
import type { Storage } from './storage'
declare type IPRSelect = Record<string, IPRCheckRes[]>

export const promptsRun = async(option: prompts.PromptObject[]) => {
  const res = await prompts(option, {
    onCancel: () => {
      log('info', 'Operation cancel')
      process.exit()
    },
  })
  return { ...res }
}

export async function runtimeStart(store: Storage) {
  // select type ( all Repo ?)
  const isAllRepo = await promptsRun(typeOption)

  let updateRes = []
  const spinner = ora({ text: 'Loading Repo......', color: 'blue' }).start()
  const githubApi = new GitApi(store.token, store.username!)
  const prList = await githubApi.getPRList()
  spinner.stop()
  const repoList = Object.keys(prList)

  // select a repo to check
  if (isAllRepo.typeSelect === 'select') {
    // select repo
    const selectRepo = await promptsRun(createRepoOption(repoList))
    const prl = prList[selectRepo.RepoSelect as keyof typeof prList] as IPRListItem[]
    // check pr
    log('info', `Checking PR by ${selectRepo.RepoSelect}......`)
    const prListByRepo = await checkPR(prl, githubApi)
    // select pr
    const prSelectRes = await promptsRun(createPrOption(prListByRepo as IPRCheckRes[]))
    // update pr
    log('info', `Update PR by ${selectRepo.RepoSelect}......`)
    updateRes = await updatePR(prl, prSelectRes as IPRSelect, githubApi)
  } else {
    const prl = [] as IPRListItem[]
    repoList.forEach((val: string) => {
      (prList[val as keyof typeof prList] as IPRListItem[]).forEach((item: IPRListItem) => {
        prl.push(item)
      })
    })
    // check pr
    log('info', 'Checking PR......')
    const prListByRepo = await checkPR(prl, githubApi)
    // select pr
    const prSelectRes = await promptsRun(createPrOption(prListByRepo as IPRCheckRes[]))
    // update pr
    log('info', 'Update PR......')
    updateRes = await updatePR(prl, prSelectRes as IPRSelect, githubApi)
  }

  spinner.succeed()
  log('success', '✔ All PR updates completed')
  await printUpdateRes(updateRes as IPRCheckRes[])
}

async function checkPR(prl: IPRListItem[], githubApi: GitApi) {
  if (prl.length === 0) {
    log('error', 'Please select a pr to check')
    process.exit()
  }
  const prListByRepo = await Promise.all(createRunList(prl.length, async(i: number) => {
    // get pr detail data
    const prInfo = await githubApi.getPRByRepo(prl[i].number, prl[i].repo, prl[i].title)
    // need update pr ?
    const res = await githubApi.needUpdate(prl[i].repo, prInfo as IPRInfo)
    log('success', `✔ Check PR #${prl[i].number} completed`)
    return {
      ...prInfo,
      ...res,
    }
  }))
  return prListByRepo
}

async function updatePR(prl: IPRListItem[],
  prSelectRes: IPRSelect,
  githubApi: GitApi) {
  const updateRes = await Promise.all(createRunList(prl.length, async(i: number) => {
    if (prSelectRes.prSelect[i] && prSelectRes.prSelect[i].isNeedUpdate) {
      await githubApi.updatePR(prSelectRes.prSelect[i].number, prSelectRes.prSelect[i].repo)
      log('success', `✔ Update PR #${prl[i].number} completed`)
    }
    return {
      ...prSelectRes.prSelect[i],
    }
  }))
  return updateRes
}

async function printUpdateRes(res: IPRCheckRes[]) {
  const p = new Table({
    columns: [
      { name: 'number', alignment: 'left' },
      { name: 'can merge', alignment: 'left' },
      { name: 'success', alignment: 'left' },
      { name: 'reason', alignment: 'left' },
      { name: 'repo', alignment: 'left' },
      { name: 'title', alignment: 'left' },
    ],
  })
  res.sort((a, b) => Number(a.isNeedUpdate) - Number(b.isNeedUpdate))
  res.forEach((item) => {
    if (!isEmptyObj(item)) {
      p.addRow({
        'number': chalk.greenBright.bold(`#${item.number}`),
        'can merge': item.isNeedUpdate ? chalk.greenBright.bold('true') : chalk.redBright.bold('false'),
        'success': item.isNeedUpdate ? chalk.greenBright.bold('true') : chalk.redBright.bold('false'),
        'reason': item.isNeedUpdate
          ? chalk.blueBright.bold('-')
          : item.reason === 'not updated' ? chalk.blueBright.bold(item.reason) : chalk.yellowBright.bold(item.reason),
        'repo': chalk.blueBright.bold(`<${item.repo}>`),
        'title': item.title,
      })
    }
  })
  p.printTable()
}

function createRunList(
  taskNum: number,
  taskFunc: (index: number) => Promise<Record<any, any>>) {
  const taskList = [] as Array<Promise<any>>
  for (let i = 0; i < taskNum; i++) {
    taskList.push(new Promise((resolve) => {
      resolve(taskFunc(i))
    }))
  }
  return taskList
}
