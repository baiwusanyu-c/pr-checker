
import request from '../fetch'
const baseUrl = 'https://api.github.com'

export async function getUserInfo(token: string) {
  const res = await request(`${baseUrl}/user`, {
    method: 'GET',
    token,
  })
  return res
}

export async function getIssuesPR(token: string, username: string) {
  const res = await request(`${baseUrl}/search/issues`, {
    method: 'GET',
    token,
    params: {
      q: `is:pr is:open author:${username}`,
      per_page: 1000,
    },
  })
  return res
}

export async function getAllRepo(token: string) {
  const res = await request(`${baseUrl}/user/repos`, {
    method: 'GET',
    token,
    params: {
      type: 'owner',
      per_page: 1000,
    },
  })
  return res
}

export async function getPRDetail(token: string, repo_name: string, pull_number: string | number) {
  const res = await request(`${baseUrl}/repos/${repo_name}/pulls/${pull_number}`, {
    method: 'GET',
    token,
  })
  return res
}

export async function compareBranch(token: string, url: string) {
  const res = await request(`${url}`, {
    method: 'GET',
    token,
  })
  return res
}

export async function rebasePr(token: string, repo_name: string, pull_number: string | number) {
  const res = await request(`${baseUrl}/repos/${repo_name}/pulls/${pull_number}/update-branch`, {
    method: 'PUT',
    token,
  })
  return res
}

export async function getPRs(token: string, repo_name: string) {
  const res = await request(`${baseUrl}/repos/${repo_name}/pulls`, {
    method: 'GET',
    token,
  })
  return res
}

export async function batchesMergePr(
  token: string,
  repo_name: string,
  pull_number: string | number,
  params: Record<any, any>) {
  const res = await request(`${baseUrl}/repos/${repo_name}/pulls/${pull_number}/merge`, {
    method: 'PUT',
    token,
    params,
  })
  return res
}
