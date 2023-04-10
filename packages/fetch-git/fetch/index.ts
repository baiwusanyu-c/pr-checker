import Qs from 'qs'

export enum ContentType {
  json = 'application/json;charset=UTF-8',
  form = 'application/x-www-form-urlencoded; charset=UTF-8',
}

export enum HttpMethod {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH',
  delete = 'DELETE',
}

export interface IReqConfig {
  params?: any
  method?: string
  headers?: IHeader
  token?: string
  'Content-Type'?: string
}

export interface IHeader {
  'Content-Type'?: string
  'X-Requested-With'?: string
  token?: string

  [propName: string]: any
}

const request = async(
  url: string,
  config: IReqConfig = {
    'params': {},
    'method': 'GET',
    'headers': {
      'Content-Type': ContentType.json,
      'Authorization': '',
    },
    'token': '',
    'Content-Type': ContentType.json,
  },
) => {
  const { reqUrl, headers } = interceptorsRequest(url, config)
  const promise: Response = await sendRequest(reqUrl, headers, config)
  return handleRes(promise)
}

/**
 * 请求拦截,这里你可以坐一些操作
 */
function interceptorsRequest(url: string, config: IReqConfig) {
  const contentType: string = setContentType(config)!
  const reqUrl = setRequestUrl(url)
  const headers: Headers = setHeader(contentType, config)
  return {
    contentType,
    reqUrl,
    headers,
  }
}

/**
 * 设置contentType
 * @param config
 */
function setContentType(config?: IReqConfig) {
  if (config && config['Content-Type'] !== undefined) {
    return config['Content-Type']
  } else if (config && config.method === HttpMethod.post) {
    // return ContentType.form
    return ContentType.json
  } else {
    return ContentType.json
  }
}
/**
 * 设置请求 url
 * @param url
 */
function setRequestUrl(url: string): string {
  return url.replace('//', '/')
}
/**
 * 设置请求头
 * @param contentType
 * @param config
 */
function setHeader(contentType: string, config?: IReqConfig): Headers {
  const token = !config || config.token === undefined ? 'sessionStorage.token' : config.token
  return new Headers({
    'Authorization': `Bearer ${token}`,
    'Content-Type': contentType,
  } as IHeader)
}

/**
 * 发送请求
 */
async function sendRequest(url: string, headers: Headers, config: IReqConfig) {
  if (!config.method || config.method === HttpMethod.get) {
    const reqUrl = config.params ? `${url}?${Qs.stringify(config.params)}` : url
    const res = await fetch(reqUrl, {
      headers,
    })
    return res
  } else if (config.method === HttpMethod.post) {
    const res = await fetch(url, {
      body: JSON.stringify(config.params),
      headers,
      method: HttpMethod.post,
    })
    return res
  } else {
    const res = await fetch(url, {
      body: JSON.stringify(config.params),
      headers,
      method: config.method,
    })
    return res
  }
}

async function handleRes(res: Response) {
  const parsedRes = await parseRes(res)
  // 如果res.ok，则请求成功
  if (res.ok)
    return parsedRes

  // 请求失败，返回解析之后的失败的数据
  throw parsedRes
}

async function parseRes(res: Response) {
  const contentType = res.headers.get('Content-Type')
  let resVal
  // 判定返回的内容类型，做不同的处理
  if (contentType) {
    if (contentType.includes('json'))
      resVal = await res.json()

    if (contentType.includes('text'))
      resVal = await res.text()

    if (contentType.includes('form'))
      resVal = await res.formData()

    if (contentType.includes('video'))
      resVal = await res.blob()
  } else {
    resVal = await res.text()
  }
  return resVal
}

export default request
