import { App } from 'antd'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import store from '../store'
import { OptionPage } from './view/OptionPage'
import 'antd/dist/reset.css'
import 'uno.css'
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <App>
      <Provider store={store}>
          <OptionPage />
      </Provider>
    </App>,
)
