import useUpdateGuard from '@/hooks/setup/useUpdateGuard'
import { Provider } from 'react-redux'
import store from '@/store/index'
import { hideHomeButton } from '@tarojs/taro'
import '@/package/styles/index.less'
import './app.less'

const App = ({ children }) => {
  useUpdateGuard()
  hideHomeButton()
  return children
}
export default ({ children }) => {
  return (
    <Provider store={store}>
      <App>{children}</App>
    </Provider>
  )
}
