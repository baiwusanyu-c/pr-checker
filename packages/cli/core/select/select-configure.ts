import chalk from 'chalk'
import { formatEllipsis, log } from '@pr-checker/utils'
import prompts from 'prompts'
import type { IPRCheckRes } from '@pr-checker/utils'
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

export const createPrOption = (list: IPRCheckRes[]) => {
  const handler = (item: IPRCheckRes) => {
    const repo = chalk.blueBright.bold(`[${formatEllipsis(item.repo)}]`)
    const number = chalk.yellowBright.bold(`[#${item.number}]`)
    const title = formatEllipsis(`${item.title}`, 36)
    const canMerge = item.isNeedUpdate
      ? chalk.yellowBright.bold('<can merge>') : chalk.redBright.bold(`<can\`t merge:${item.reason}>`)
    const infoTitle = `${canMerge}: ${repo}-${number} -> ${title}`
    return {
      title: infoTitle,
      value: {
        title: item.title,
        number: item.number,
        repo: item.repo,
        isNeedUpdate: item.isNeedUpdate,
        reason: item.reason,
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
