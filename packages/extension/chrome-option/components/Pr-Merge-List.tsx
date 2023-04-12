import { useThrottleFn } from 'ahooks'
import { App, Button, Input, Space, Table, Tag, Tooltip } from 'antd'
import { ExclamationCircleFilled, ReloadOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { createRunList } from '@pr-checker/utils/common'
import { compareBranch, getPRDetail } from '@pr-checker/fetchGit'
import type React from 'react'
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
  opFlag: 0 | 1 | 2 | 3
  html_url: string
  author: string
  id: number
}

// TODO refactor
export const PrMergeList = (props: PrListProps) => {
  const [tableData, setTableData] = useState<DataType[] >([])
  const tableDataCache = useRef<DataType[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (props.repoInfo.pullRequests.length > 0)
      setLoading(true)
      // TODO handleTableData(props.repoInfo.pullRequests)
  }, [props.repoInfo])

  // TODO
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
        id: prl[i].id,
      }
      // get pr detail data
      res = await compareBranchToUpdate(prl[i].number, repo, res as DataType)
      return res
    }))
    setTableData(res as DataType[])
    setLoading(false)
    tableDataCache.current = res
  }

  // TODO
  async function compareBranchToUpdate(number: number, repo: string, res: DataType) {
    const prInfo = await getPRDetail(props.token, repo, number)
    res.author = prInfo.user.login
    if (prInfo.mergeable_state === 'dirty') {
      res.state = 'code conflict'
      res.opFlag = 1
    } else if (prInfo.mergeable_state === 'unstable') {
      res.state = 'pending'
      res.opFlag = 3
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
    setTableData(filterRes)
  }

  const { run } = useThrottleFn(
    (e) => {
      handleSearch(e)
    },
    { wait: 300 },
  )

  const { modal, message } = App.useApp()
  const { confirm } = modal
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const handleOp = async(item: DataType) => {
    confirm({
      title: 'Tips',
      icon: <ExclamationCircleFilled />,
      content: (
          <div className="text-lg">
            <p className="m-0">Do you want to merge this PR?</p>
            <span className="text-blue-500">[{item.repoName}]: </span>
            <span className="text-main"> #{item.number}</span>
          </div>),
      onOk() {
        return new Promise((resolve) => {
          const run = async() => {
            await mergePrList(props.token, item.repoName, [item.number])
            setLoading(true)
            // TODO handleTableData(props.repoInfo.pullRequests)
            setSelectedRowKeys([]) // 清空选中状态
            resolve(true)
          }
          run()
        })
      },
    })
  }

  async function mergePrList(token: string, repoName: string, numberArr: number[] | string[]) {
    try {
      await Promise.all(createRunList(numberArr.length, async(i: number) => {
        // TODO await rebasePr(token, repoName, numberArr[i])
      }))
      message.open({
        type: 'success',
        content: 'merge success',
      })
    } catch (e) {
      console.error(e)
    }
  }
  let selectedNumberData: string[] = []
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], selectedRows: DataType[]) => {
      selectedNumberData = selectedRows.map(v => v.number)
      setSelectedRowKeys(keys)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.opFlag !== 2,
    }),
  }

  const handleOpAll = async() => {
    if (selectedNumberData.length === 0) {
      message.open({
        type: 'warning',
        content: 'Select the row you want to work on',
      })
      return
    }

    confirm({
      title: 'Tips',
      icon: <ExclamationCircleFilled />,
      content: (
          <div className="text-lg">
            <p className="m-0">Do you want to merge these PRs?</p>
          </div>),
      onOk() {
        return new Promise((resolve) => {
          const run = async() => {
            await mergePrList(props.token, props.repoInfo.uname, selectedNumberData)
            setLoading(true)
            // TODO: handleTableData(props.repoInfo.pullRequests)
            setSelectedRowKeys([]) // 清空选中状态
            resolve(true)
          }
          run()
        })
      },
    })
  }

  const reload = () => {
    setLoading(true)
    // TODO: handleTableData(props.repoInfo.pullRequests)
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
          return <Tag color="#87d068">🎉 {state}</Tag>
        else if (opFlag === 1)
          return <Tag color="#f50">🔥 {state}</Tag>
        else if (opFlag === 3)
          return <Tag color="#ffc53d">🎁 {state}</Tag>
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
                  onChange={run}
                  allowClear
          />

          <Button type="primary" className="mx-4 flex-1" onClick={handleOpAll}>
            { `${props.opType} all`}
          </Button>

          <Tooltip title="reload">
            <Button type="primary"
                    shape="circle"
                    onClick={reload}
                    icon={<ReloadOutlined />}
            />
          </Tooltip>
        </div>

        <Table columns={columns}
               rowSelection={{
                 ...rowSelection,
               }}
               loading={loading}
               size="middle"
               rowKey="id"
               dataSource={tableData as RcTableProps<RecordType>['data']}
               scroll={{ y: 'calc(100vh - 200px)' }}
               pagination={false}
        />
      </div>
  )
}
