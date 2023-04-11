
import request from '../fetch'
const baseUrl = 'https://api.github.com'

export async function getUserInfo(token: string) {
  const res = await request(`${baseUrl}/user`, {
    method: 'GET',
    token,
  })
  return res
}

export async function getRebaseRepo(token: string, username: string) {
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
