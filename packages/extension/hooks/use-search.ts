import { useThrottleFn } from 'ahooks'

export function useSearch(tableDataCache, update) {
  const handleSearch = (e) => {
    const searchParams = e.target.value
    const filterRes = tableDataCache.current.filter((item) => {
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
