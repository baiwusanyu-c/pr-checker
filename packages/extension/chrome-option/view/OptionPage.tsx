import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { getAllStorageSyncData } from '../../hooks/use-storage'
import { RepoList } from '../components/Repo-List'
import type React from 'react'
const { Header, Sider, Content } = Layout
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#ffffff',
  height: '64px',
  paddingInline: '50px',
  lineHeight: '64px',
}

const contentStyle: React.CSSProperties = {

  height: 'calc(100vh - 64px)',
  color: '#ffffff',
}

// TODO: token is empty ?
export const OptionPage = () => {
  const [storeData, setStoreData] = useState<Record<string, string | any>>({
    USER_INFO: {
      login: '',
    },
  })
  useEffect(() => {
    // const data = await getAllStorageSyncData()
    const data = { OP_TYPE: 'rebase', TOKEN: '', USER_INFO: '{"login":"baiwusanyu-c"}' }
    data.USER_INFO = JSON.parse(data.USER_INFO)
    setStoreData(data)
  }, [])
  return (
      <div id="pr_checker_option">
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff' }} className="shadow-xl p-2 bg-white" >
            <h1 className="text-gray-600 m-0 h-8">
              pr-checker
            </h1>
            <RepoList opType={storeData.OP_TYPE} userName={storeData.USER_INFO.login} token={storeData.TOKEN} />
          </Sider>
          <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>Content</Content>
          </Layout>
        </Layout>
      </div>
  )
}
