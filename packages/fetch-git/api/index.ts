
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
