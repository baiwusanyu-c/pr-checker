import { Button, Form, Input, Spin } from 'antd'
import { useCallback, useState } from 'react'
import { getUserInfo } from '@pr-checker/fetchGit'
import { useStorage } from '../hooks/use-storage'
declare const chrome: any
interface LoginFormProps {
  onLogin?: (userInfo: any) => void
  onFinished?: () => void
  isExt: boolean
}
export const LoginForm = (props: LoginFormProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [opType, setOpType] = useState('')
  const { setItem, CACHE_KEYS, getItem } = useStorage()
  const [loading, setLoading] = useState(false)
  const { onLogin, onFinished, isExt } = props
  const getUserData = useCallback(async(token: string) => {
    setLoading(true)
    const res = await getUserInfo(token)
    onLogin && onLogin(res)
    await setItem(CACHE_KEYS.USER_INFO, JSON.stringify(res))
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = useCallback(async(values: any) => {
    const userInfo = await getItem(CACHE_KEYS.USER_INFO)
    if (!userInfo)
      await getUserData(values.token)

    // 存储操作类型和 TOKEN
    await Promise.all([
      setItem(CACHE_KEYS.OP_TYPE, opType),
      setItem(CACHE_KEYS.TOKEN, values.token),
    ])
    onFinished && onFinished()
    isExt && chrome.runtime.openOptionsPage()
  }, [
    isExt,
    onFinished,
    CACHE_KEYS.OP_TYPE,
    CACHE_KEYS.TOKEN,
    CACHE_KEYS.USER_INFO,
    opType,
    setItem,
    getItem,
    getUserData])
  return (
    <Spin spinning={loading} tip="Loading...">
    <Form
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item label={<span className="dark:text-white">Github Token</span>}
                 name="token"
                 rules={[{ required: true }]}
      >
        <Input.Password
          placeholder="input github token"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />
      </Form.Item>
      <Form.Item label=" ">
        <div className="flex justify-center items-center w-full">
          <Button className="mx-4" type="primary"
                  htmlType="submit"
                  onClick={() => setOpType('merge')}
          >Merge PR
          </Button>
          <Button className="mx-4" type="primary"
                  htmlType="submit"
                  onClick={() => setOpType('rebase')}
          >Rebase PR
          </Button>
        </div>
      </Form.Item>
    </Form>
    </Spin>
  )
}
