import { useThrottleFn } from 'ahooks'
import { Button, Input, Modal, Space, Table, Tag, Tooltip, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { createRunList } from '@pr-checker/utils/common'
import { compareBranch, getPRDetail, rebasePr } from '@pr-checker/fetchGit'
import type { IRepoWithPRs } from './Repo-List'
import type { ColumnsType } from 'antd/es/table'

interface PrListProps {
  opType: string
  repoInfo: IRepoWithPRs
  token: string
}

interface DataType {
  number: string
  title: string
  repoName: string
  state: string
  opFlag: 0 | 1 | 2
  html_url: string
  author: string
}

// TODO merge
// TODO merge all select handle

// TODO rebase all select handle

// TODO refactor
export const PrList = (props: PrListProps) => {
  const [tableData, settableData] = useState<DataType[] >([])
  const tableDataCache = useRef<DataType[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (props.repoInfo.pullRequests.length > 0) {
      setLoading(true)
      handleTableData(props.repoInfo.pullRequests)
    }
  }, [props.repoInfo])

  async function handleTableData(prl: Record<any, any>[]) {
    // rebase
    const res = await Promise.all(createRunList(prl.length, async(i: number) => {
      const repo = prl[i].repository_url.split('repos/').pop()
      let res = {
        number: prl[i].number,
        title: prl[i].title,
        repoName: repo,
        state: 'no update',
        html_url: prl[i].html_url,
        opFlag: 0,
      }
      // get pr detail data
      res = await compareBranchToUpdate(prl[i].number, repo, res as DataType)
      return res
    }))
    settableData(res as DataType[])
    setLoading(false)
    tableDataCache.current = res
  }

  async function compareBranchToUpdate(number: number, repo: string, res: DataType) {
    const prInfo = await getPRDetail(props.token, repo, number)
    res.author = prInfo.user.login
    if (prInfo.mergeable_state === 'dirty' || prInfo.mergeable_state === 'unstable') {
      res.state = 'code conflict'
      res.opFlag = 1
    } else {
      let url = prInfo.base.repo.compare_url
      url = url.replace('{base}', prInfo.base.ref).replace('{head}', prInfo.head.label)
      // need update pr ?
      const compareRes = await compareBranch(props.token, url)
      if (prInfo.mergeable_state === 'clean' && (compareRes.behind_by > 0)) {
        res.state = `can ${props.opType}`
        res.opFlag = 2
      }
    }
    return res
  }

  const handleSearch = (e) => {
    const searchParams = e.target.value
    const filterRes = tableDataCache.current.filter((item) => {
      return item.title.toLowerCase().includes(searchParams.toLowerCase())
        || item.author.toLowerCase().includes(searchParams.toLowerCase())
    })
    settableData(filterRes)
  }

  const { run } = useThrottleFn(
    (e) => {
      handleSearch(e)
    },
    { wait: 300 },
  )

  const { confirm } = Modal
  const [messageApi, contextHolder] = message.useMessage()
  const handleOp = async(item: DataType) => {
    confirm({
      title: 'Tips',
      icon: <ExclamationCircleFilled />,
      content: (
        <div className="text-lg">
        <p className="m-0">Do you want to rebase this pr?</p>
          <span className="text-blue-500">[{item.repoName}]: </span><span className="text-main"> #{item.number}</span>
        </div>),
      onOk() {
        return new Promise((resolve) => {
          const run = async() => {
            if (props.opType === 'rebase') {
              try {
                // TODO refactor with mul
                const res = await rebasePr(props.token, item.repoName, item.number)
                resolve(res)
                messageApi.open({
                  type: 'success',
                  content: 'rebase success',
                })
              } catch (e) {
                console.error(e)
              }
            }
          }
          run()
        })
      },
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'PR Number',
      dataIndex: 'number',
      key: 'number',
      width: 120,
      render: (text: string, record) => (
        <a title={record.html_url}
           href={record.html_url}
           target="_blank"
           rel="noreferrer"
        >
          #{text}
        </a>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (_, { title }) => {
        return (<Tooltip placement="topLeft" title={title}>
          <span>{title}</span>
                </Tooltip>)
      },
    },
    {
      title: 'Repo Name',
      dataIndex: 'repoName',
      key: 'repoName',
      width: 180,
      className: 'text-main',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'State',
      key: 'state',
      width: 120,
      sorter: (a, b) => a.opFlag - b.opFlag,
      dataIndex: 'state',
      render: (_, { state, opFlag }) => {
        if (opFlag === 0)
          return <Tag color="#87d068">🎉{state}</Tag>
        else if (opFlag === 1)
          return <Tag color="#f50">🔥 {state}</Tag>
        else
          return <Tag color="#2db7f5">🎯 {state}</Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" disabled={record.opFlag !== 2}
                  onClick={() => handleOp(record)}
          >
            {props.opType}
          </Button>
          <a title={record.html_url} href={record.html_url} target="_blank" rel="noreferrer">
            <Button type="primary" ghost>detail</Button>
          </a>
        </Space>
      ),
    },
  ]

  const { Search } = Input
  return (
    <div id="pr_list" className="p-4 mt-2px dark:bg-gray-7"
         style={{ height: 'calc(100% - 2px)' }}
    >
      <div className="w-100 flex items-center mb-6">
        <Search placeholder="Title / Author"
                className="flex-4 !dark:bg-gray-7"
                onChange={run} allowClear
        />
        <Button type="primary" className="mx-4 flex-1" >
          { `${props.opType} all`}
        </Button>
      </div>

      <Table columns={columns}
             loading={loading}
             size="middle"
             dataSource={tableData as RcTableProps<RecordType>['data']}
             scroll={{ y: 'calc(100vh - 200px)' }}
             pagination={false}
             rowSelection
      />
      {contextHolder}
    </div>
  )
}
