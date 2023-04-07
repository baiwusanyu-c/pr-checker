import '../../assets/styles/login.css'
import { Button, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useStorage } from '../../hooks/use-storage'
// TODO: logo
// TODO: github logo
// TODO: 头像 和 跳转
// TODO: 用户名
const loginBg = new URL('../../assets/img/login-bg.png', import.meta.url).href
export const PopupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [opType, setOpType] = useState('')
  const { setItem, CACHE_KEYS, getItem } = useStorage()

  const onFinish = async(values) => {
    // 存储操作类型
    await setItem(CACHE_KEYS.OP_TYPE, opType)
    // 存储TOKEN
    await setItem(CACHE_KEYS.TOKEN, values.token)
    chrome.runtime.openOptionsPage()
  }

  const [showInput, setShowInput] = useState(true)
  const isShow = async() => {
    // 有 TOKEN, 则显示头像
    const token = await getItem(CACHE_KEYS.TOKEN)
    if (token)
      setShowInput(false)
    else
      setShowInput(true)
  }

  useEffect(() => {
    isShow()
  }, [])

  const goOption = async(opType: string) => {
    // 存储操作类型
    await setItem(CACHE_KEYS.OP_TYPE, opType)
    chrome.runtime.openOptionsPage()
  }
  return (
        <div className="h-240px w-380px p-4 login" style={{ backgroundImage: `url(${loginBg})` }}>
          <div className="flex items-center">
            <h1 className="text-gray-600">
              <i>x</i>
              pr-checker
            </h1>
          </div>
          {showInput ? <Form
           layout="vertical "
           onFinish={onFinish} >
            <Form.Item label="Github Token" name="token" rules={[{ required: true }]}>
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
            : <div className="flex justify-center items-center w-full">
              <Button className="mx-4" type="primary"
                      htmlType="submit"
                      onClick={() => goOption('merge')}
              >Merge PR
              </Button>
              <Button className="mx-4" type="primary"
                      htmlType="submit"
                      onClick={() => goOption('rebase')}
              >Rebase PR
              </Button>
              </div>
          }
        </div>
  )
}
