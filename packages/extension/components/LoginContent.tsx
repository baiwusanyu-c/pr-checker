import { GithubOutlined } from '@ant-design/icons'
const logoImg = new URL('../assets/img/logo.png', import.meta.url).href
interface LoginContentProps {
  cls: string
  showGH: boolean
  children?: React.ReactNode
}
export const LoginContent = (props: LoginContentProps) => {
  return (
    <div className={`${props.cls}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <a
            href="https://github.com/baiwusanyu-c/pr-checker"
            target="_blank" rel="noreferrer"
            title="https://github.com/baiwusanyu-c/pr-checker"
          >
            <img src={logoImg} alt="pr-checker" className="w-30px h-30px mr-2" />
          </a>
          <h1 className="text-gray-600 m-0 dark:text-white" style={{ lineHeight: 1 }}>
            pr-checker
          </h1>
        </div>
        {props.showGH ? <a
          href="https://github.com/baiwusanyu-c/pr-checker"
          target="_blank" rel="noreferrer"
          title="https://github.com/baiwusanyu-c/pr-checker"
                        >
          <GithubOutlined style={{ fontSize: '24px', color: '#888888' }} />
                        </a> : ''}
      </div>
      { props.children }
    </div>
  )
}
