import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import { PopupPage } from './view/PopupPage'
import 'antd/dist/reset.css'
import 'uno.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1cd2a9',
      },
    }}
  >
    <PopupPage />
  </ConfigProvider>,
)
