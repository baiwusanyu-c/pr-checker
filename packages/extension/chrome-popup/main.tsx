import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import store from '../store'
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
    <Provider store={store}>
        <PopupPage />
    </Provider>
  </ConfigProvider>,
)
