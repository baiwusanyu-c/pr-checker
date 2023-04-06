import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import store from '../store'
import { OptionPage } from './view/OptionPage'
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(

    <HashRouter>
        <Provider store={store}>
            <OptionPage />
        </Provider>
    </HashRouter>,
)
