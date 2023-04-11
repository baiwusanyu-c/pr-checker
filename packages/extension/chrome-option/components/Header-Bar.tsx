import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { CarbonSun } from './icon-sun'
import { CarbonMoon } from './icon-moon'
import type { IRepoWithPRs } from './Repo-List'
interface HeaderBarProps {
  userInfo: {
    avatar_url: string
    html_url: string
  }
  repoInfo: IRepoWithPRs
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
  }
  useMount(() => {
    const dark = localStorage.getItem('dark')
    if (!dark || dark === 'false')
      setDark(false)
    else
      setDark(true)
  })

  useEffect(() => {
    const htmlEl = document.querySelector('html') as Element
    htmlEl.className = dark ? 'dark' : ''
  }, [dark])
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
      </div>
    </div>
  )
}
