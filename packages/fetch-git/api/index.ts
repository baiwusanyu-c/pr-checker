
import request from '../fetch'
const baseUrl = 'https://api.github.com'

export async function getUserInfo(token: string) {
  const res = await request(`${baseUrl}/user`, {
    method: 'GET',
    token,
  })
  return res
}
