import { Octokit } from '@octokit/core'
import { log } from './log'
import { createRunList, isEmptyObj } from './common'
export declare interface IPRListItem {
  title: string
  number: number
  repo: string
  id: number
}
export declare interface IPRInfo {
  sha: string
  org_repo: string
  org_repo_default_branch: string
  pr_sha: string
  pr_repo: string
  pr_repo_default_branch: string
  mergeable: boolean
  mergeable_state: string
  merged: boolean
  title: string
  number: number
  repo: string
}

export declare interface IPRCheckRes extends IPRInfo{
  isNeedUpdate: boolean
  reason: string
}
export class GitApi {
  octokit: Octokit
  owner: string
  constructor(token: string, owner: string) {
    this.octokit = new Octokit({
      auth: token,
    })
    this.owner = owner
  }

  /**
   * 获取账户下所有提交 pr
   * @param username
   */
  async getIssuesPRCLI(username: string = this.owner) {
    try {
      const { data } = await this.octokit.request('GET /search/issues', {
        q: `is:pr is:open author:${username}`,
        per_page: 1000,
      })
      if (!data.items || (data.items && data.items.length === 0))
        log('error', 'You don\'t have any pull requests that are open')

      const res = {} as Record<string, IPRListItem[]>
      data.items.forEach((val: any) => {
        const repo = val.repository_url.split('repos/')[1]
        if (!res[repo]) res[repo] = []
        res[repo].push({
          repo,
          ...val,
        })
      })
      return res
    } catch (error: any) {
      if (error.status === 401)
        log('error', 'Your token is invalid or does not match your username')

      log('error', error)
      return {}
    }
  }

  async getAllRepoPRList(username: string = this.owner) {
    try {
      const { data } = await this.octokit.request('GET /user/repos', {
        type: 'owner',
        per_page: 1000,
      })
      const notForkRepoList = data.filter(v => !v.fork)
      const res = {} as Record<string, IPRListItem[]>
      await Promise.all(createRunList(notForkRepoList.length, async(i: number) => {
        const { data: prData } = await this.octokit.request(
          'GET /repos/{owner}/{repo}/pulls',
          {
            owner: username,
            repo: notForkRepoList[i].name,
            per_page: 1000,
          })

        prData.forEach((val: any) => {
          const repo = notForkRepoList[i].full_name
          if (!res[repo]) res[repo] = []
          res[repo].push({
            title: val.title,
            number: val.number,
            repo,
            id: val.id,
          })
        })
      }))

      if (isEmptyObj(res))
        log('error', 'You don\'t have any pull requests')

      return res
    } catch (error: any) {
      if (error.status === 401)
        log('error', 'Your token is invalid or does not match your username')

      log('error', error)
      return {}
    }
  }

  /**
   * Get pr details according to pr number and repo name
   * @param pull_number pr 号
   * @param repo_name upstream Repo name
   */
  async getPRDetailCLI(repo_name: string, pull_number: string | number) {
    try {
      const { data } = await this.octokit.request(
        `GET /repos/${repo_name}/pulls/{pull_number}`,
        {
          pull_number,
        },
      )

      return data
    } catch (error: any) {
      log('error', error)
      return {}
    }
  }

  async compareBranchCLI(basehead: string, repo: string, owner: string) {
    try {
      const { data } = await this.octokit.request(
        'GET /repos/{owner}/{repo}/compare/{basehead}',
        {
          basehead,
          repo,
          owner,
        },
      )

      return data
    } catch (error: any) {
      log('error', error)
      return {}
    }
  }

  /**
   * update pr
   * @param pull_number
   * @param repo_name
   */
  async rebasePrCLI(pull_number: number, repo_name: string) {
    try {
      const res = await this.octokit.request(
        `PUT /repos/${repo_name}/pulls/{pull_number}/update-branch`,
        {
          pull_number,
        },
      )
      return res.data.message
    } catch (error: any) {
      log('error', error)
      return {}
    }
  }

  async mergePR(pull_number: number, repo_name: string) {
    try {
      const res = await this.octokit.request(
          `PUT /repos/${repo_name}/pulls/{pull_number}/merge`,
          {
            pull_number,
          },
      )
      return res.data.message
    } catch (error: any) {
      log('error', error)
      return {}
    }
  }
}

export async function getUserName(token: string) {
  const octokit = new Octokit({
    auth: token,
  })
  const { data } = await octokit.request('GET /user')
  return data
}
