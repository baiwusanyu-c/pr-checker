import { useStorage } from '../../hooks/use-storage'

export const OptionPage = () => {
  const { getItem, CACHE_KEYS, setItem } = useStorage()
  const handleClick = async() => {
    const res = await getItem(CACHE_KEYS.TOKEN)
    console.log(res)
    await setItem(CACHE_KEYS.TOKEN, '')
  }
  return (
      <div onClick={() => handleClick()}>OptionPage</div>
  )
}
