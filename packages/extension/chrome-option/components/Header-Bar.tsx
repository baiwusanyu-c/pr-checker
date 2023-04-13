import { GithubOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Popconfirm, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { getUserInfo } from '@pr-checker/fetchGit'
import { useStorage } from '../../hooks/use-storage'
import { CarbonSun } from './Icon-Sun'
import { CarbonMoon } from './Icon-Moon'
import type { IRepoWithPRs } from './Repo-List'
import '../../assets/styles/login.css'
const logoImg = new URL('../../assets/img/logo.png', import.meta.url).href
interface HeaderBarProps {
  userInfo: {
    avatar_url: string
    html_url: string
  }
  repoInfo: IRepoWithPRs
  isLogin?: boolean
  toggleTheme?: (boolean) => void
}
export const HeaderBar = (props: HeaderBarProps = {
  userInfo: {
    avatar_url: '',
    html_url: '',
  },
  repoInfo: {
    url: '',
    name: '',
    uname: '',
    pullRequests: [],
  },
}) => {
  const [dark, setDark] = useState(false)
  const toggleTheme = (value: boolean) => {
    setDark(value)
    localStorage.setItem('dark', value.toString())
    props.toggleTheme && props.toggleTheme(value)
  }
  useMount(() => {
    const dark = localStorage.getItem('dark')
    if (!dark || dark === 'false')
      toggleTheme(false)
    else
      toggleTheme(true)
  })

  useEffect(() => {
    const htmlEl = document.querySelector('html') as Element
    htmlEl.className = dark ? 'dark' : ''
  }, [dark])

  // TODO refactor with popup
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [opType, setOpType] = useState('')
  const { setItem, CACHE_KEYS, getItem, removeItem } = useStorage()

  const [loading, setLoading] = useState(false)
  const getUserData = useCallback(async(token: string) => {
    setLoading(true)
    const res = await getUserInfo(token)
    await setItem(CACHE_KEYS.USER_INFO, JSON.stringify(res))
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = useCallback(async(values) => {
    const userInfo = await getItem(CACHE_KEYS.USER_INFO)
    if (!userInfo)
      await getUserData(values.token)

    // 存储操作类型和 TOKEN
    await Promise.all([
      setItem(CACHE_KEYS.OP_TYPE, opType),
      setItem(CACHE_KEYS.TOKEN, values.token),
    ])
    setIsModalOpen(false)
    setTimeout(() => {
      location.reload()
    }, 500)
  }, [CACHE_KEYS.OP_TYPE, CACHE_KEYS.TOKEN, CACHE_KEYS.USER_INFO, opType, setItem, getItem, getUserData])

  const logout = useCallback(async() => {
    // 存储操作类型和 TOKEN
    await Promise.all([
      removeItem(CACHE_KEYS.OP_TYPE),
      removeItem(CACHE_KEYS.TOKEN),
      removeItem(CACHE_KEYS.USER_INFO),
    ])
    setIsModalOpen(false)
    setTimeout(() => {
      location.reload()
    }, 500)
  }, [CACHE_KEYS.OP_TYPE, CACHE_KEYS.TOKEN, CACHE_KEYS.USER_INFO, removeItem])
  return (
    <div id="header_bar" className="flex justify-between  items-center h-full py-2 px-8 dark:bg-gray-7">
      <div className="flex items-center">
        <a href={props.userInfo.html_url} target="_blank" rel="noreferrer" title={props.userInfo.html_url}>
          <Avatar size={46} src={props.userInfo.avatar_url} icon={<UserOutlined />} />
        </a>
        <h1 className="mx-4 my-0 text-gray-600 text-xl dark:text-white">{props.repoInfo.uname}</h1>
      </div>
      <div className="flex items-center">
        <a
          href="https://github.com/baiwusanyu-c/pr-checker"
          target="_blank" rel="noreferrer"
          className="flex items-center"
          title="https://github.com/baiwusanyu-c/pr-checker"
        >
          <GithubOutlined style={{ fontSize: '30px', color: '#888888' }} />
        </a>
        {
          dark ? <CarbonMoon role="button" style={{ fontSize: '30px', color: '#888888' }} className="mx-4 cursor-pointer" onClick={() => toggleTheme(false)} />
            : <CarbonSun role="button" style={{ fontSize: '30px', color: '#888888' }} className="mx-4 cursor-pointer" onClick={() => toggleTheme(true)} />
        }
        {
          !props.isLogin ? <Button className="mx-4" type="primary"
                                   htmlType="submit"
                                   onClick={() => { setIsModalOpen(true) }}
                           > Login
                           </Button>
            : <Popconfirm
                  title="Logout"
                  description="Are you sure to logout?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={logout}
              >
                <PoweroffOutlined role="button" style={{ fontSize: '30px', color: '#888888' }} />
              </Popconfirm>
        }
      </div>
      {/* login modal */}
      <Modal title={
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <a
                href="https://github.com/baiwusanyu-c/pr-checker"
                target="_blank" rel="noreferrer"
                title="https://github.com/baiwusanyu-c/pr-checker"
            >
              <img src={logoImg} alt="pr-checker" className="w-30px h-30px mr-2" />
            </a>
            <h1 className="text-gray-600 leading-1 m-0 dark:text-white">
              pr-checker
            </h1>
          </div>
        </div>
      }
             wrapClassName="login-modal"
             onCancel={() => setIsModalOpen(false)}
             open={isModalOpen}
             footer={null}
      >
        <Spin spinning={loading} tip="Loading...">
        <Form
            layout="vertical "
            onFinish={onFinish}
        >
          <Form.Item label={<span className="dark:text-white">Github Token</span>} name="token" rules={[{ required: true }]}>
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
        </Spin>
      </Modal>
    </div>
  )
}
