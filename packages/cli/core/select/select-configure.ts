
import { formatEllipsis, log, logType } from '@pr-checker/utils'
import prompts from 'prompts'
import type { IPR, IPRList, modeType, opFlag } from '@pr-checker/utils/types'
import type * as promptsType from 'prompts'

export const typeOption = [{
  type: 'select',
  name: 'typeSelect',
  message: 'Detect all Repo\'s PR?',
  choices: ['All Repo', 'Detect the PR of a certain Repo'].map((item: string) => {
    let value = 'all'
    if (item !== 'All Repo')
      value = 'select'
    return { title: item, value }
  }),
}] as promptsType.PromptObject[]

export const createRepoOption = (list: string[]) => {
  const handler = (item: string) => {
    return { title: item, value: item }
  }
  return [{
    type: 'select',
    name: 'RepoSelect',
    message: 'Please select a Repo',
    choices: list.map(handler),
  }] as promptsType.PromptObject[]
}

export const createPrOption = (list: IPRList, mode: modeType) => {
  const handler = (item: IPR) => {
    const repo = logType.info(`[${formatEllipsis(item.repoName)}]`)
    const number = logType.warning(`[#${item.number}]`)
    const title = formatEllipsis(`${item.title}`, 36)

    const disablePolicy = (flag: opFlag, mode: modeType) => {
      if (mode === 'merge')
        return !(flag === 2 || flag === 0)
      else
        return flag !== 2
    }
    const op = !disablePolicy(item.opFlag, mode)
      ? logType.warning('\'<can merge>\'')
      : logType.error(`<can\`t merge:${item.state}>`)

    const infoTitle = `${op}: ${repo}-${number} -> ${title}`
    return {
      title: infoTitle,
      value: {
        title: item.title,
        number: item.number,
        repo: item.repoName,
        canOp: !disablePolicy(item.opFlag, mode),
        reason: item.state,
        infoTitle,
      },
    }
  }
  return [{
    type: 'multiselect',
    name: 'prSelect',
    message: 'Please select the PR that needs to be updated',
    optionsPerPage: 20,
    choices: list.map(handler),
    onRender() {
      // @ts-expect-error rewrite output see: https://github.com/terkelg/prompts/issues/389
      if (this.firstRender) {
        // @ts-expect-error rewrite output see: https://github.com/terkelg/prompts/issues/389
        this.renderDoneOrInstructions = function() {
          return ''
        }
      }
    },
  }] as unknown as prompts.PromptObject[]
}

export const promptsRun = async(option: prompts.PromptObject[]) => {
  const res = await prompts(option, {
    onCancel: () => {
      log('info', 'Operation cancel')
      process.exit()
    },
  })
  return { ...res }
}
