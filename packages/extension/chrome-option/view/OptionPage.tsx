import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { getAllStorageSyncData } from '../../hooks/use-storage'
import { RepoList } from '../components/Repo-List'
import { HeaderBar } from '../components/Header-Bar'
import { PrList } from '../components/Pr-List'
import type { IRepoWithPRs } from '../components/Repo-List'
const logoImg = new URL('../../assets/img/logo.png', import.meta.url).href
const { Header, Sider, Content } = Layout

// TODO: token is empty ?
export const OptionPage = () => {
  const [storeData, setStoreData] = useState<Record<string, string | any>>({
    USER_INFO: {
      login: '',
    },
  })
  useEffect(() => {
    const run = async() => {
      // const data = await getAllStorageSyncData()
      const data = { OP_TYPE: 'rebase', TOKEN: '', USER_INFO: '{"login":"baiwusanyu-c", "avatar_url": "https://avatars.githubusercontent.com/u/32354856?v=4"}' }
      data.USER_INFO = JSON.parse(data.USER_INFO)
      setStoreData(data as Record<string, any>)
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
  return (
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
              <HeaderBar userInfo={storeData.USER_INFO} repoInfo={selectRepo} />
            </Header>
            <Content style={{ height: 'calc(100vh - 64px)' }}>
              <PrList opType={storeData.OP_TYPE} repoInfo={selectRepo} token={storeData.TOKEN} />
            </Content>
          </Layout>
        </Layout>
      </div>
  )
}
