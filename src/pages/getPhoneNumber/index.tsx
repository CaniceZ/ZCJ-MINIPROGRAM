import { getWxPhoneNumber, loginWx } from '@/api/user'
import { Button } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { switchTab, login } from '@tarojs/taro'
import { useCallback } from 'react'
import storage from '@/utils/storage'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import './index.less'

export default () => {
  const dispatch = useAppDispatch()
  const toHome = useCallback(() => {
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }, [])
  const handleGetPhoneNumber = (e) => {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      getWxPhoneNumber({ code: e.detail.code }).then((data) => {
        login({
          success(res) {
            if (res.code) {
              //发起网络请求
              loginWx({
                code: res.code,
                appCode: 1,
                sourceChannel: 1,
                userType: 1,
                mobile: data.phone_info.phoneNumber,
              }).then((data2) => {
                console.log(data2, 877)
                storage.set('token', data2)
                storage.set('registerStatus', data2.registerStatus)
                toHome()
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          },
        })
      })
    }
  }
  return (
    <View className='get-phone-wrap'>
      <Button block type='info' open-type='getPhoneNumber' onGetPhoneNumber={handleGetPhoneNumber}>
        一键授权手机号
      </Button>
    </View>
  )
}
