import { GithubOutlined, PoweroffOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Modal, Popconfirm } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { useStorage } from '../../hooks/use-storage'
import { CarbonSun } from '../../components/IconSun'
import { CarbonMoon } from '../../components/IconMoon'
import { LoginContent } from '../../components/LoginContent'
import { LoginForm } from '../../components/LoginForm'
import type { IRepoWithPRs } from '@pr-checker/utils/types'
import '../../assets/styles/login.css'
interface HeaderBarProps {
  userInfo: {
    avatar_url: string
    html_url: string
  }
  repoInfo: IRepoWithPRs
  isLogin?: boolean
  toggleTheme?: (toggle: boolean) => void
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { CACHE_KEYS, removeItem } = useStorage()

  const onFinished = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      location.reload()
    }, 500)
  }
  const logout = useCallback(async() => {
    // 存储操作类型和 TOKEN
    await Promise.all([
      removeItem(CACHE_KEYS.OP_TYPE),
      removeItem(CACHE_KEYS.TOKEN),
      removeItem(CACHE_KEYS.USER_INFO),
    ])
    onFinished()
  }, [CACHE_KEYS.OP_TYPE, CACHE_KEYS.TOKEN, CACHE_KEYS.USER_INFO, removeItem])
  return (
    <div id="header_bar" className="flex justify-between  items-center h-full py-2 px-8 dark:bg-gray-7">
      <div className="flex items-center">
        <a href={props.userInfo.html_url} target="_blank" rel="noreferrer" title={props.userInfo.html_url}>
          <Avatar size={46} src={props.userInfo.avatar_url} icon={<UserOutlined />} />
        </a>
        <h1 className="mx-4 my-0 text-gray-600 text-xl dark:text-white">{props.repoInfo.uname || ''}</h1>
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
      <Modal title={<LoginContent cls="flex items-center" showGH={false} />}
             wrapClassName="login-modal"
             onCancel={() => setIsModalOpen(false)}
             open={isModalOpen}
             footer={null}
      >
        <LoginForm isExt={false} onFinished={onFinished} />
      </Modal>
    </div>
  )
}
