import ora from 'ora'
import {
  GitApi,
  createRunList,
  isEmptyObj,
  log,
  logType,
  runTaskQueue,
} from '@pr-checker/utils'
import { Table } from 'console-table-printer'
import {
  createPrOption, createRepoOption,
  promptsRun,
  typeOption,
} from './select-configure'
import type {
  IPR,
  IPRList,
  IPRListMap,
  IPRSelectList,
  IPRSelectRes,
  PRStateText,
  Storage,
  modeType,
} from '@pr-checker/utils/types'

export async function handleSelect(store: Storage, mode: modeType) {
  // select type ( all Repo ?)
  const isAllRepo = await promptsRun(typeOption)

  let updateRes = []
  const spinner = ora({ text: 'Loading Repo......', color: 'blue' }).start()
  const githubApi = new GitApi(store.token, store.username!)
  const prList = (mode === 'rebase' ? (await githubApi.getIssuesPRCLI())
    : (await githubApi.getAllRepoPRListCLI())) as IPRListMap
  spinner.stop()
  const repoList = Object.keys(prList)
  // select a repo to check
  if (isAllRepo.typeSelect === 'select') {
    // select repo
    const selectRepo = await promptsRun(createRepoOption(repoList))
    let prl = prList[selectRepo.RepoSelect as keyof typeof prList] as IPRList
    if (mode === 'merge') {
      const res = await githubApi.getPRsCLI(prl[0].uname)
      prl = res
    }
    // check pr
    log('info', `Checking PR by ${selectRepo.RepoSelect}......`)
    const prListByRepo = await checkPR(prl, githubApi, mode)
    // select pr
    const prSelectRes = await promptsRun(createPrOption(prListByRepo, mode))
    // update pr
    log('info', `Update PR by ${selectRepo.RepoSelect}......`)
    updateRes = (await updatePR(prl, prSelectRes as IPRSelectRes, githubApi, mode))!
  } else {
    let prl = [] as IPRList
    for (const val of repoList) {
      if (mode === 'merge') {
        log('info', val)
        const res = await githubApi.getPRsCLI(val)
        prl = prl.concat(res)
      } else {
        (prList[val as keyof typeof prList]).forEach((item: IPR) => {
          prl.push(item)
        })
      }
    }
    // check pr
    log('info', 'Checking PR......')
    const prListByRepo = await checkPR(prl, githubApi, mode)
    // select pr
    const prSelectRes = await promptsRun(createPrOption(prListByRepo, mode))
    // update pr
    log('info', 'Update PR......')
    updateRes = (await updatePR(prl, prSelectRes as IPRSelectRes, githubApi, mode))!
  }

  spinner.succeed()
  log('success', '✔ All PR updates completed')

  await printUpdateRes(updateRes)
}

const compareBranchToUpdate = async(
  number: number,
  repo: string,
  res: IPR,
  githubApi: GitApi,
  mode: modeType,
) => {
  const prInfo = await githubApi.getPRDetailCLI(repo, number)
  res.author = prInfo.user.login
  if (prInfo.mergeable_state === 'dirty') {
    res.state = 'code conflict'
    res.opFlag = 1
  } else if (prInfo.mergeable_state === 'unstable') {
    res.state = 'unstable'
    res.opFlag = 3
  } else {
    const basehead = `${prInfo.base.ref}...${prInfo.head.label}`
    const onwer = repo.split('/')[0]
    const repoName = repo.split('/')[1]
    // need update pr ?
    const compareRes = await githubApi.compareBranchCLI(basehead, repoName, onwer)
    if (prInfo.mergeable_state === 'clean' && (compareRes.behind_by > 0)) {
      res.state = `can ${mode}` as PRStateText
      res.opFlag = 2
    }
  }
  return res
}

async function checkPR(
  prl: IPRList,
  githubApi: GitApi,
  mode: modeType) {
  if (prl.length === 0) {
    log('error', 'Please select a pr to check')
    process.exit()
  }

  const prListByRepo = await Promise.all(createRunList(prl.length, async(i: number) => {
    try {
      let res = {
        number: prl[i].number,
        title: prl[i].title,
        repoName: prl[i].repo || prl[i].head.repo.full_name,
        state: 'no update',
        html_url: prl[i].html_url,
        opFlag: 0,
        id: prl[i].id,
        base: prl[i].base ? prl[i].base.ref : '',
        head: prl[i].head ? prl[i].head.ref : '',
      } as unknown as IPR
      res = await compareBranchToUpdate(prl[i].number, res.repoName, res, githubApi, mode)
      log('success', `✔ Check PR #${prl[i].number} completed`)
      return res
    } catch (error) {
      console.error(error)
    }
  }))
  return prListByRepo
}

async function updatePR(
  prl: IPRList,
  prSelectRes: IPRSelectRes,
  githubApi: GitApi,
  mode: modeType) {
  if (mode === 'rebase') {
    const updateRes = await Promise.all(createRunList(prl.length, async(i: number) => {
      if (prSelectRes.prSelect[i] && prSelectRes.prSelect[i].canOp) {
        if (mode === 'rebase')
          await githubApi.rebasePrCLI(prSelectRes.prSelect[i].number, prSelectRes.prSelect[i].repo)

        log('success', `✔ Update PR #${prl[i].number} completed`)
      }
      return {
        ...prSelectRes.prSelect[i],
      }
    }))

    return updateRes
  }
  if (mode === 'merge') {
    try {
      const taskList = []
      for (let i = 0; i < prl.length; i++) {
        taskList.push({
          fn: githubApi.mergePrCLI.bind(githubApi),
          params: [prSelectRes.prSelect[i].number, prSelectRes.prSelect[i].repo],
          retry: 0,
          id: prSelectRes.prSelect[i].number,
        })
      }
      await runTaskQueue(taskList, {
        onTaskFailed(i) {
          prSelectRes.prSelect[i].canOp = false
          if (prSelectRes.prSelect[i].reason !== 'code conflict')
            prSelectRes.prSelect[i].reason = 'unknown error'
        },
      }, 5, false)
      return prSelectRes.prSelect
    } catch (e) {
      console.log(e)
    }
  }
}

async function printUpdateRes(res: IPRSelectList) {
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
  res.sort((a, b) => Number(a.canOp) - Number(b.canOp))
  res.forEach((item) => {
    if (!isEmptyObj(item)) {
      p.addRow({
        'number': logType.success('', `#${item.number}`),
        'can merge': item.canOp ? logType.success('true') : logType.error('false'),
        'success': item.canOp ? logType.success('true') : logType.error('false'),
        'reason': item.canOp
          ? logType.info('-')
          : item.reason === 'not updated' ? logType.info(item.reason) : logType.warning(item.reason),
        'repo': logType.info(`<${item.repo}>`),
        'title': item.title,
      })
    }
  })
  p.printTable()
}
