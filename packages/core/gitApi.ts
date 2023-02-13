import { Octokit } from '@octokit/core'
export declare interface IPRInfo {
  sha: string
  org_repo: string
  org_repo_default_branch: string
  pr_sha: string
  pr_repo: string
  pr_repo_default_branch: string
  mergeable: boolean
  merged: boolean
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
      return data.items
    } catch (error) {
      console.log(error)
      return []
    }
  }

  /**
   * 根据  pr number 与 repo name 获取 pr 详情
   * @param pull_number pr 号 TODO：维护 list 批量
   * @param repo_name 源仓库名 TODO：维护 list 批量
   */
  async getPRByRepo(pull_number: number, repo_name: string) {
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
