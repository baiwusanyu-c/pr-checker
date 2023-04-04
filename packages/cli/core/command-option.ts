import chalk from 'chalk'
import type { IPRCheckRes } from './git-api'
import type * as prompts from 'prompts'
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
}] as prompts.PromptObject[]

export const createRepoOption = (list: string[]) => {
  const handler = (item: string) => {
    return { title: item, value: item }
  }
  return [{
    type: 'select',
    name: 'RepoSelect',
    message: 'Please select a Repo',
    choices: list.map(handler),
  }] as prompts.PromptObject[]
}

export const createPrOption = (list: IPRCheckRes[]) => {
  const handler = (item: IPRCheckRes) => {
    const repo = chalk.blueBright.bold(`[${item.repo}]`)
    const number = chalk.yellowBright.bold(`[#${item.number}]`)
    const title = `${item.title}`
    const canMerge = item.isNeedUpdate
      ? chalk.yellowBright.bold('<CanMerge:true>') : chalk.redBright.bold('<CanMerge:false>')
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
