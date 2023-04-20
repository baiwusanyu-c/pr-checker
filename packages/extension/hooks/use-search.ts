import { useThrottleFn } from 'ahooks'
import type { ChangeEvent, MutableRefObject } from 'react'
export interface ISearchL {
  title: string
  author: string
}
export function useSearch<T extends ISearchL >(
  tableDataCache: MutableRefObject<T[]>,
  update: (p: T[]) => void) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchParams = e.target.value
    const filterRes = tableDataCache.current.filter((item: {
      title: string
      author: string
    }) => {
      return item.title.toLowerCase().includes(searchParams.toLowerCase())
        || item.author.toLowerCase().includes(searchParams.toLowerCase())
    })
    update(filterRes)
  }

  const { run } = useThrottleFn(
    (e) => {
      handleSearch(e)
    },
    { wait: 300 },
  )
  return {
    search: run,
  }
}
