import { Octokit } from '@octokit/core'
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
export default class GitApi {
  octokit: Octokit
  owner: string
  forkRepoCache: Record<string, Record<'sha', string>>
  constructor(token: string, owner: string) {
    this.octokit = new Octokit({
      auth: token,
    })
    this.owner = owner
    this.forkRepoCache = {}
  }

  /**
   * 获取账户下所有 pr
   * @param username
   */
  async getPRList(username: string = this.owner) {
    try {
      const { data } = await this.octokit.request('GET /search/issues', {
        q: `is:pr is:open author:${username}`,
        per_page: 1000,
      })
      const res = {} as Record<string, IPRListItem[]>
      data.items.forEach((val: any) => {
        const repo = val.repository_url.split('repos/')[1]
        if (!res[repo]) res[repo] = []
        res[repo].push({
          title: val.title,
          number: val.number,
          repo,
          id: val.id,
        })
      })
      return res
    } catch (error) {
      console.log(error)
      return []
    }
  }

  /**
   * Get pr details according to pr number and repo name
   * @param pull_number pr 号
   * @param repo_name upstream Repo name
   * @param title
   */
  async getPRByRepo(pull_number: number, repo_name: string, title?: string) {
    try {
      const { data } = await this.octokit.request(
        `GET /repos/${repo_name}/pulls/{pull_number}`,
        {
          pull_number,
        },
      )

      const forkRepoName = data.head.repo.full_name
      const forkRepoDefaultBranch = data.head.repo.default_branch
      if (!this.forkRepoCache[forkRepoName]) {
        const { data: forkRepoData } = await this.octokit.request(
          `GET /repos/${forkRepoName}/branches/{default_branch_name}`,
          {
            default_branch_name: forkRepoDefaultBranch,
          },
        )
        this.forkRepoCache[forkRepoName] = {
          sha: forkRepoData.commit.sha,
        }
      }

      return {
        sha: this.forkRepoCache[forkRepoName].sha, // Fork warehouse default branch hash
        org_repo: data.base.repo.full_name,
        org_repo_default_branch: data.base.repo.default_branch,
        pr_sha: data.head.sha,
        pr_repo: forkRepoName,
        pr_repo_default_branch: forkRepoDefaultBranch,
        merged: data.merged,
        mergeable: data.mergeable,
        mergeable_state: data.mergeable_state,
        number: pull_number,
        repo: repo_name,
        title: title || '',
      } as IPRInfo
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return {}
    }
  }

  /**
   * Determine whether pr wants to synchronize the upstream Repo
   * @param repo_name upstream Repo name
   * @param pr_info The getPRByRepo function returns the result
   */
  async needUpdate(repo_name: string, pr_info: IPRInfo) {
    try {
      if (pr_info.mergeable_state === 'dirty')
        return { isNeedUpdate: false, reason: 'code conflict' }

      const { data } = await this.octokit.request(
        `GET /repos/${repo_name}/commits`,
      )

      if (data.length >= 0) {
        // Comparison of the default branch hash of
        // the fork warehouse and the upstream warehouse hash
        const cur_sha = data[0].sha
        if (pr_info.sha !== cur_sha
          && pr_info.mergeable
          && !pr_info.merged)
          return { isNeedUpdate: true }
        else
          return { isNeedUpdate: false, reason: 'not updated' }
      } else {
        return { isNeedUpdate: false, reason: 'unknown error' }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return { isNeedUpdate: false, reason: 'unknown error' }
    }
  }

  /**
   * update pr
   * @param pull_number
   * @param repo_name
   */
  async updatePR(pull_number: number, repo_name: string) {
    try {
      const res = await this.octokit.request(
        `PUT /repos/${repo_name}/pulls/{pull_number}/update-branch`,
        {
          pull_number,
        },
      )
      return res.data.message
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
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
