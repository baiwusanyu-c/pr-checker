import '../../assets/styles/login.css'
import { Avatar, Button, Form, Input, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { getUserInfo } from '@pr-checker/fetchGit'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import { useStorage } from '../../hooks/use-storage'
// TODO: logo
const loginBg = new URL('../../assets/img/login-bg.png', import.meta.url).href
export const PopupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [opType, setOpType] = useState('')
  const { setItem, CACHE_KEYS, getItem } = useStorage()

  const onFinish = async(values) => {
    // 存储操作类型
    await setItem(CACHE_KEYS.OP_TYPE, opType)
    // 存储TOKEN
    await setItem(CACHE_KEYS.TOKEN, values.token)
    chrome.runtime.openOptionsPage()
  }

  const [loading, setLoading] = useState(false)
  const [showInput, setShowInput] = useState(true)
  const [userInfo, setUserInfo] = useState({
    html_url: '',
    avatar_url: '',
    login: '',
    name: '',
  })
  const isShow = async() => {
    // 有 TOKEN, 则显示头像
    const token = await getItem(CACHE_KEYS.TOKEN)
    if (token)
      setShowInput(false)
    else
      setShowInput(true)

    setLoading(true)
    const res = await getUserInfo(token as string)
    setUserInfo({
      html_url: res.html_url,
      avatar_url: res.avatar_url,
      login: res.login,
      name: res.name,
    })
    setLoading(false)
  }

  useEffect(() => {
    isShow()
  }, [])

  const goOption = async(opType: string) => {
    // 存储操作类型
    await setItem(CACHE_KEYS.OP_TYPE, opType)
    chrome.runtime.openOptionsPage()
  }
  return (
        <div className="h-240px w-380px p-4 login" style={{ backgroundImage: `url(${loginBg})` }}>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-600 leading-1 m-0">
              pr-checker
            </h1>
            <a
              href="https://github.com/baiwusanyu-c/pr-checker"
              target="_blank" rel="noreferrer"
              title="https://github.com/baiwusanyu-c/pr-checker"
            >
              <GithubOutlined style={{ fontSize: '24px', color: '#888888' }} />
            </a>
          </div>
          {showInput ? <Form
           layout="vertical "
           onFinish={onFinish}
                       >
            <Form.Item label="Github Token" name="token" rules={[{ required: true }]}>
              <Input.Password
                placeholder="input github token"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
            <Form.Item label=" ">
              <div className="flex justify-center items-center w-full">
                <Button className="mx-4" type="primary"
                        htmlType="submit"
                        onClick={() => setOpType('merge')}
                >Merge PR
                </Button>
                <Button className="mx-4" type="primary"
                        htmlType="submit"
                        onClick={() => setOpType('rebase')}
                >Rebase PR
                </Button>
              </div>
            </Form.Item>
                       </Form>
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
        </div>
  )
}
