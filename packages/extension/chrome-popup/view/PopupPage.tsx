import '../../assets/styles/login.css'
import { Avatar, Button, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { getUserInfo } from '@pr-checker/fetchGit'
import { UserOutlined } from '@ant-design/icons'
import { useStorage } from '../../hooks/use-storage'
import { LoginContent } from '../../components/LoginContent'
import { LoginForm } from '../../components/LoginForm'
export const PopupPage = () => {
  const { setItem, CACHE_KEYS, getItem } = useStorage()
  const [loading, setLoading] = useState(false)
  const [showInput, setShowInput] = useState(true)
  const [userInfo, setUserInfo] = useState({
    html_url: '',
    avatar_url: '',
    login: '',
    name: '',
  })

  const getToken = useCallback(async() => {
    const token = await getItem(CACHE_KEYS.TOKEN)
    if (token)
      setShowInput(false)
    else
      setShowInput(true)

    return token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setUserData = async(res) => {
    setUserInfo({
      html_url: res.html_url,
      avatar_url: res.avatar_url,
      login: res.login,
      name: res.name,
    })

    if (res.plan)
      res.isPro = res.plan.name === 'pro'

    await setItem(CACHE_KEYS.USER_INFO, JSON.stringify(res))
  }

  const getUserData = useCallback(async(token: string) => {
    setLoading(true)
    const res = await getUserInfo(token)
    await setUserData(res)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = async() => {
      const token = await getToken()
      if (typeof token === 'string')
        await getUserData(token)
    }
    fetchData()
  }, [getToken, getUserData])

  const goOption = useCallback(async(opType: string) => {
    // 存储操作类型
    await setItem(CACHE_KEYS.OP_TYPE, opType)
    chrome.runtime.openOptionsPage()
  }, [CACHE_KEYS.OP_TYPE, setItem])

  const onLogin = async(data) => {
    await setUserData(data)
    setShowInput(false)
  }
  return (
    <LoginContent cls="h-240px w-380px p-4 login" showGH>
      {showInput
        ? <LoginForm onLogin={onLogin} isExt />
        : <Spin spinning={loading} tip="Loading...">
          <div className="flex justify-center items-center w-full flex-col">
            <a href={userInfo.html_url} target="_blank" rel="noreferrer" title={userInfo.html_url}>
              <Avatar size={90} src={userInfo.avatar_url} icon={<UserOutlined />} />
            </a>
            <h2 className="text-gray-600 text-lg my-2">
              {userInfo.name}
              <span className="mx-2">{userInfo.login}</span>
            </h2>
            <div className=" flex justify-center items-center w-full" >
              <Button className="mx-4" type="primary"
                      htmlType="submit"
                      onClick={() => goOption('merge')}
              >Merge PR
              </Button>
              <Button className="mx-4" type="primary"
                      htmlType="submit"
                      onClick={() => goOption('rebase')}
              >Rebase PR
              </Button>
            </div>
          </div>
          </Spin>
      }
    </LoginContent>
  )
}
