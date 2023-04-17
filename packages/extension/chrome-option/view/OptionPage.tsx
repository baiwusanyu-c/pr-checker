import { App, ConfigProvider, Layout, theme } from 'antd'
import { useEffect, useState } from 'react'
import { isEmptyObj } from '@pr-checker/utils/common'
import { getAllStorageSyncData } from '../../hooks/use-storage'
import { RepoList } from '../components/RepoList'
import { HeaderBar } from '../components/HeaderBar'
import { PrRebaseList } from '../components/pr-list/PrRebaseList'
import { PrMergeList } from '../components/pr-list/PrMergeList'
import type { IRepoWithPRs } from '../components/RepoList'
const logoImg = new URL('../../assets/img/logo.png', import.meta.url).href
const { Header, Sider, Content } = Layout

export const OptionPage = () => {
  const [storeData, setStoreData] = useState<Record<string, string | any>>({
    USER_INFO: {
      login: ''
    },
  })

  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    const run = async() => {
      const data = await getAllStorageSyncData()
      // const data = { OP_TYPE: 'rebase', TOKEN: '', USER_INFO: '{"login":"baiwusanyu-c", "avatar_url": "https://avatars.githubusercontent.com/u/32354856?v=4"}' }
      if (!isEmptyObj(data)) {
        data.USER_INFO = JSON.parse(data.USER_INFO)
        setStoreData(data as Record<string, any>)
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    }
    run()
  }, [])

  const [selectRepo, setSelectRepo] = useState<IRepoWithPRs>({
    url: '',
    name: '',
    uname: '',
    pullRequests: [],
  })
  const handleSelect = (data: IRepoWithPRs) => {
    setSelectRepo(data)
  }

  const [dark, setDark] = useState(false)
  const toggleTheme = (value: boolean) => {
    setDark(value)
  }
  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1cd2a9',
            },
            algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
      >
        <App>
      <div id="pr_checker_option">
        <Layout>
          <Sider className="shadow-xl p-2 !bg-white !dark:bg-gray-7 dark:shadow-xl dark:shadow-main" >
            <div className="flex items-center h-10 mb-2">
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
            <RepoList
              onSelect={handleSelect}
              opType={storeData.OP_TYPE}
              userName={storeData.USER_INFO.login}
              token={storeData.TOKEN}
            />
          </Sider>
          <Layout>
            <Header className="shadow shadow-main p-0 bg-white">
              <HeaderBar userInfo={storeData.USER_INFO} repoInfo={selectRepo} isLogin={isLogin} toggleTheme={toggleTheme} />
            </Header>
            <Content style={{ height: 'calc(100vh - 64px)' }}>
              {storeData.OP_TYPE === 'rebase'
                ? <PrRebaseList opType={storeData.OP_TYPE} repoInfo={selectRepo} token={storeData.TOKEN} />
                : <PrMergeList  opType={storeData.OP_TYPE} repoInfo={selectRepo} token={storeData.TOKEN} />}
            </Content>
          </Layout>
        </Layout>
      </div>
        </App>
      </ConfigProvider>
  )
}
