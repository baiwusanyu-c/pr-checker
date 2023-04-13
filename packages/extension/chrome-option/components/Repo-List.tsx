import { Button, Input, Spin, Tooltip } from 'antd'
import { getAllRepo, getIssuesPR } from '@pr-checker/fetchGit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useThrottleFn } from 'ahooks'
// TODO all select handle
interface IRepoListProps {
  opType: string
  token: string
  userName: string
  onSelect: (data: IRepoWithPRs) => void
}

interface IRepo {
  name: string
  uname: string
  url: string
}

export interface IRepoWithPRs extends IRepo {
  pullRequests: Record<any, any>[]
}

export const RepoList = (props: IRepoListProps) => {
  const [repoList, setRepoList] = useState<IRepoWithPRs[]>([])
  const repoListCache = useRef<IRepoWithPRs[]>([])
  const [loading, setLoading] = useState(false)
  const { token, userName, opType, onSelect } = props
  useEffect(() => {
    setLoading(true)
    if (opType === 'rebase') {
      getIssuesPR(token, userName)
        .then((res) => {
          // 使用 map 避免重复遍历
          const repos = new Map<string, IRepoWithPRs>()
          res.items.forEach((val) => {
            const repoName = val.repository_url.split('/').pop()!
            const repoUName = val.repository_url.split('repos/').pop()!
            const repoURL = val.repository_url
            if (!repos.has(repoURL)) {
              // 如果 repoURL 不存在，就新建一个 IRepoWithPRs 对象
              repos.set(repoURL, { name: repoName, url: repoURL, uname: repoUName, pullRequests: [val] })
            } else {
              // 如果 repoURL 存在，就把当前 PR 加入到该 Repo 的 pullRequests 数组里
              const repo = repos.get(repoURL)!
              repo.pullRequests.push(val)
            }
          })
          // 将 map 转成数组，并设置到 state 里
          const resRepo = [...repos.values()]
          setRepoList(resRepo)
          repoListCache.current = resRepo
          onSelect(resRepo[0])
        })
        .finally(() => {
          setLoading(false)
        })
    }
    // merge 模式 我们只获取仓库信息
    if (opType === 'merge') {
      getAllRepo(token).then((res) => {
        const hasIssuesRepo = res.filter(val => val.open_issues_count > 0 && !val.fork)
        const repos = new Map<string, IRepoWithPRs>()
        hasIssuesRepo.forEach((val) => {
          const repoName = val.url.split('/').pop()!
          const repoUName = val.url.split('repos/').pop()!
          const repoURL = val.url
          repos.set(repoURL, { name: repoName, url: repoURL, uname: repoUName, pullRequests: [val] })
        })
        // 将 map 转成数组，并设置到 state 里
        const resRepo = [...repos.values()]
        setRepoList(resRepo)
        repoListCache.current = resRepo
        onSelect(resRepo[0])
      }).finally(() => {
        setLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userName, opType])

  const [activeIndex, setActiveIndex] = useState(0)
  const handleClick = useCallback((index: number) => {
    setActiveIndex(index)
    onSelect(repoList[index])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoList])

  const repoListEl = useMemo(() => {
    return repoList.map((repo, index) => (
        <Tooltip title={repo.uname} key={repo.url} placement="right">
          <li
              style={activeIndex === index ? { backgroundColor: '#cafcec', color: '#1cd2a9' } : {}}
              className="cursor-pointer flex items-center rounded-md list-none h-8 p2 hover:bg-mLight hover:text-main dark:text-white"
              onClick={() => handleClick(index)}
          >
            {/* <Avatar size={20} className="mr-2" shape="square">{value[0]}</Avatar> */}
            <span style={{ fontSize: '14px' }} className="text-bold">
            {repo.name}
            </span>
          </li>
        </Tooltip>
    ))
  }, [repoList, handleClick, activeIndex])

  const handleSearch = (e) => {
    const searchParams = e.target.value
    const filterRes = repoListCache.current.filter((item) => {
      return item.name.toLowerCase().includes(searchParams.toLowerCase())
    })
    setRepoList(filterRes)
    setActiveIndex(-1)
  }

  const { run } = useThrottleFn(
    (e) => {
      handleSearch(e)
    },
    { wait: 300 },
  )
  const { Search } = Input
  return (
    <div id="pr_checker_repo_list">
      <Search placeholder="Input repo name" className="mb-4 !dark:bg-gray-7" onChange={run} allowClear />
      <Button type="primary" className="mb-4 w-full" >
        { `${props.opType} all`}
      </Button>
      <ul className="list-none p-0 min-w-1 border-1"
          style={loading ? { display: 'flex', justifyContent: 'center' } : {}}
      >
        <Spin spinning={loading} tip="Loading..." className="my-4" />
        {repoListEl}
      </ul>
    </div>
  )
}
