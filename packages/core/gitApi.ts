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
  merged: boolean
  title: string
  number: number
  repo: string
}

export declare interface IPRCheckRes extends IPRInfo{
  isNeedUpdate: boolean
}
export default class GitApi {
  octokit: Octokit
  owner: string

  constructor(token: string, owner: string) {
    this.octokit = new Octokit({
      auth: token,
    })
    this.owner = owner
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
   * 根据  pr number 与 repo name 获取 pr 详情
   * @param pull_number pr 号
   * @param repo_name 源仓库名
   */
  async getPRByRepo(pull_number: number, repo_name: string, title?: string) {
    try {
      const { data } = await this.octokit.request(
        `GET /repos/${repo_name}/pulls/{pull_number}`,
        {
          pull_number,
        },
      )
      return {
        sha: data.base.sha,
        org_repo: data.base.repo.full_name,
        org_repo_default_branch: data.base.repo.default_branch,
        pr_sha: data.head.sha,
        pr_repo: data.head.repo.full_name,
        pr_repo_default_branch: data.head.repo.default_branch,
        merged: data.merged,
        mergeable: data.mergeable,
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
   * 判断 pr 是否要同步源仓库
   * @param repo_name 源仓库名
   * @param pr_info 该 pr 版本中， fork 的仓库提交 hash
   */
  async needUpdate(repo_name: string, pr_info: IPRInfo) {
    try {
      const { data } = await this.octokit.request(
        `GET /repos/${repo_name}/commits`,
      )
      if (data.length >= 0) {
        const cur_sha = data[0].sha
        if (pr_info.sha !== cur_sha
          && pr_info.mergeable
          && !pr_info.merged)
          return { isNeedUpdate: true }
        else
          return { isNeedUpdate: false }
      } else {
        return { isNeedUpdate: false }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return { isNeedUpdate: false }
    }
  }

  /**
   * 更新pr
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
