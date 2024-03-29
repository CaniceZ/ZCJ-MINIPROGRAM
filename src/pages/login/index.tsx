import { View, Image, Text } from '@tarojs/components'
import { Button, Checkbox } from '@nutui/nutui-react-taro'
import { useState, useCallback } from 'react'
import { switchTab, showToast, navigateTo, login, redirectTo } from '@tarojs/taro'
import storage from '@/utils/storage'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import { loginWx, getWxPhoneNumber } from '@/api/user'
import { setToken } from '@/store/user'
import './index.less'
import { getHelperCode } from '@/api/info'

export default () => {
  const [checked, setChecked] = useState(false)
  const dispatch = useAppDispatch()
  const toHome = useCallback(() => {
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }, [])
  const handleClick = () => {
    if (!checked) {
      showToast({ title: '请先阅读并同意隐私政策及用户协议', icon: 'none' })
      return false
    }
  }
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
                storage.set('token', data2.token)
                dispatch(setToken(data2.token))
                storage.set('registerStatus', data2.registerStatus)
                storage.set('userVO', data2.userVO)
                getHelperCode({}).then((helper) => {
                  storage.set('helperCode', helper?.helperCode)
                  // toHome()
                  redirectTo({ url: '/subpackages/realname/info/index?from=login' })
                })
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          },
        })
      })
    }
  }

  const toRouter = (path: string) => {
    navigateTo({ url: `/subpackages/setting/${path}/index` })
  }
  return (
    <View className='login-wrap'>
      <Image
        mode='aspectFit'
        className='login-img'
        src='https://qiniu-fe.yigongpin.com/img_404.png'
      ></Image>
      <Button
        block
        type='success'
        className='login-btn m10'
        open-type={checked ? 'getPhoneNumber' : ''}
        onGetPhoneNumber={handleGetPhoneNumber}
        onClick={handleClick}
      >
        微信授权登录
      </Button>
      <Button className='login-btn' block type='default' onClick={toHome}>
        暂不登录
      </Button>
      <View className='agree-wrap'>
        <Checkbox
          iconSize={18}
          checked={checked}
          onChange={(state) => {
            setChecked(state)
          }}
        >
          <Text className='agree-text'>同意</Text>
        </Checkbox>
        <Text
          className='agree-link'
          onClick={() => {
            toRouter('privacy')
          }}
        >
          《隐私政策》
        </Text>
        <Text
          className='agree-link'
          onClick={() => {
            toRouter('protocol')
          }}
        >
          《用户协议》
        </Text>
      </View>
    </View>
  )
}
