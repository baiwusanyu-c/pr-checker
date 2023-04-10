import { Button, Input, Spin, Tooltip } from 'antd'
import { getRebaseRepo } from '@pr-checker/fetchGit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useThrottleFn } from 'ahooks'
// TODO: merge data
// TODO: logo data
interface IRepoListProps {
  opType: string
  token: string
  userName: string
}

interface IRepo {
  name: string
  url: string
}

interface IRepoWithPRs extends IRepo {
  pullRequests: Record<any, any>[]
}

export const RepoList = (props: IRepoListProps) => {
  const [repoList, setRepoList] = useState<IRepoWithPRs[]>([])
  const repoListCache = useRef<IRepoWithPRs[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (props.opType === 'rebase') {
      setLoading(true)
      getRebaseRepo(props.token, props.userName)
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
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [props.opType, props.token, props.userName])

  const [activeIndex, setActiveIndex] = useState(-1)
  const handleClick = useCallback((index: number) => {
    setActiveIndex(index)
    const repo = repoList[index]
    console.log(repo.url)
    console.log(repo.name)
  }, [repoList])

  const repoListEl = useMemo(() => {
    return repoList.map((repo, index) => (
        <Tooltip title={repo.uname} key={repo.url}>
          <li
              style={activeIndex === index ? { backgroundColor: '#cafcec', color: '#1cd2a9' } : {}}
              className="flex items-center rounded-md list-none h-8 p2 hover:bg-mLight hover:text-main cursor-pointer"
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
  }

  const { run } = useThrottleFn(
    (e) => {
      handleSearch(e)
    },
    { wait: 300 },
  )
  return (
    <div id="pr_checker_repo_list">
      <Input placeholder="Input repo name" className="mb-4" onChange={run} />
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
