import useUpdateGuard from '@/hooks/setup/useUpdateGuard'
import { Provider } from 'react-redux'
import store from '@/store/index'
import { hideHomeButton, useLaunch, login, navigateTo, switchTab } from '@tarojs/taro'
import storage from '@/utils/storage'
import { loginWx } from '@/api/user'
import { getHelperCode } from '@/api/info'
import '@/package/styles/index.less'
import { setToken } from '@/store/user'
import './app.less'

const App = ({ children }) => {
  useLaunch(() => {
    console.log('useLaunch')
    login({
      success(res) {
        console.log(res.code, 898989)
        if (res.code) {
          //发起网络请求
          loginWx({ code: res.code, appCode: 1, sourceChannel: 1, userType: 1 }).then((data) => {
            storage.set('token', data.token)
            store.dispatch(setToken(data.token))
            storage.set('registerStatus', data.registerStatus)
            storage.set('userVO', data.userVO)
            getHelperCode({}).then((helper) => {
              storage.set('helperCode', helper?.helperCode)
              // if (data.registerStatus === 0) {
              //   navigateTo({ url: '/pages/login/index' })
              // } else {
              // switchTab({ url: '/pages/index/index' })
              // }
            })
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
    })
  })
  useUpdateGuard()
  // hideHomeButton()
  return children
}
export default ({ children }) => {
  return (
    <Provider store={store}>
      <App>{children}</App>
    </Provider>
  )
}
