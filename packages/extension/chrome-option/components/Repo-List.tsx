import { Button, Input, Spin, Tooltip } from 'antd'
import { getRebaseRepo } from '@pr-checker/fetchGit'
import { useEffect, useState } from 'react'

interface IRepoListProps {
  opType: string
  token: string
  userName: string
}
// TODO: merge data
// TODO: logo data
export const RepoList = (props: IRepoListProps) => {
  const [repoListEl, setrepoListEl] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (props.opType === 'rebase') {
      const getReq = async() => {
        const res = await getRebaseRepo(props.token, props.userName)
        setRepoListData(res.items)
        setrepoListEl(setRepoListRender())
        setLoading(false)
      }
      setLoading(true)
      getReq()
    }
  }, [props.opType, props.token, props.userName, setRepoListData, setRepoListRender])

  const repoNameSet: Set<string> = new Set()
  const repoListSet: Set<string> = new Set()
  const repoToPrMap = new Map<string, Array<Record<any, any>>>()
  function setRepoListData(list: Array<Record<any, any>>) {
    list.forEach((val) => {
      const repoName = val.repository_url.split('/').pop()
      const repos = val.repository_url.split('repos/').pop()
      repoListSet.add(repos)
      repoNameSet.add(repoName)
      let prL = []
      if (repoToPrMap.get(repos))
        prL = repoToPrMap.get(repos)

      prL.push(val)
      repoToPrMap.set(repos, prL)
    })
  }

  const handleClick = (index) => {
    setrepoListEl(setRepoListRender(index))
    console.log([...repoListSet][index])
    console.log([...repoNameSet][index])
  }

  function setRepoListRender(activeIndex = -1) {
    const repo = [...repoListSet]
    return [...repoNameSet].map((value, index) => {
      return (
        <Tooltip title={repo[index]} key={value}>
          <li
            style={activeIndex === index ? { backgroundColor: '#cafcec', color: '#1cd2a9' } : {}}
            className="flex items-center rounded-md list-none h-8 p2 hover:bg-mLight hover:text-main cursor-pointer"
            onClick={() => handleClick(index)}
          >
            {/* <Avatar size={20} className="mr-2" shape="square">{value[0]}</Avatar> */}
            <span style={{ fontSize: '14px' }} className="text-bold" title={repo[index]}> {value}</span>
          </li>
        </Tooltip>
      )
    })
  }
  return (
    <div id="pr_checker_repo_list">
      <Input placeholder="Input repo name" className="mb-4" />
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
