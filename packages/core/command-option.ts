import chalk from 'chalk'
import type { IPRCheckRes } from './gitApi'
import type * as prompts from 'prompts'
export const typeOption = [{
  type: 'select',
  name: 'typeSelect',
  message: 'Detect all Repo\'s pr?',
  choices: ['All Repo', 'Detect the pr of a certain Repo'].map((item: string) => {
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
    const blue = chalk.blueBright.bold
    const yellow = chalk.yellowBright.bold
    const title = `${blue(`<${item.repo}>`)} ${yellow(`#${item.number}`)} -> ${item.title}`
    return {
      title,
      value: {
        title: item.title,
        number: item.number,
        repo: item.repo,
      },
    }
  }
  return [{
    type: 'multiselect',
    name: 'prSelect',
    message: 'Please select the Pr that needs to be updated',
    choices: list.map(handler),
  }] as prompts.PromptObject[]
}
