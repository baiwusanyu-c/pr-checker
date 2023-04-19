import { Octokit } from '@octokit/core'
import { log } from './log'
import { createRunList } from './common'
import type { IRepoWithPRs } from '@pr-checker/extension/chrome-option/components/RepoList'
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

      const res = {} as Record<string, any[]>
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

  async getAllRepoPRListCLI() {
    try {
      const { data: userReposData } = await this.octokit.request('GET /user/repos', {
        type: 'owner',
        per_page: 1000,
      })

      const { data: userOrgsData } = await this.octokit.request('GET /user/orgs', {
        type: 'owner',
        per_page: 1000,
      })

      let orgsReposData = []
      await Promise.all(createRunList(userOrgsData.length, async(i: number) => {
        const { data } = await this.octokit.request(
          `GET /orgs/${userOrgsData[i].login}/repos`, {
            type: 'owner',
            per_page: 1000,
          })
        orgsReposData = data
      }))

      function handleRepoInfoByMerge(res: Array<any>) {
        const hasIssuesRepo = res.filter(val => !val.fork)
        const repos = new Map<string, IRepoWithPRs>()
        hasIssuesRepo.forEach((val) => {
          const repoName = val.url.split('/').pop()!
          const repoUName = val.url.split('repos/').pop()!
          const repoURL = val.url
          repos.set(repoURL, { name: repoName, url: repoURL, uname: repoUName, pullRequests: [val] })
        })
        // 将 map 转成数组，并设置到 state 里
        return [...repos.values()]
      }
      const res = {} as Record<string, any[]>
      handleRepoInfoByMerge(userReposData.concat(orgsReposData)).forEach((val: any) => {
        const repo = val.url.split('repos/')[1]
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

  async getPRsCLI(repo_name: string) {
    try {
      const { data } = await this.octokit.request(
        `GET /repos/${repo_name}/pulls`,
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

  async mergePrCLI(pull_number: number, repo_name: string) {
    try {
      const res = await this.octokit.request(
        `PUT /repos/${repo_name}/pulls/{pull_number}/merge`,
        {
          pull_number,
          merge_method: 'squash',
        },
      )
      return res.data.message
    } catch (error: any) {
      throw error
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
