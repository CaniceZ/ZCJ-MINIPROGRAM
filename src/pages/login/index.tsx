import { View, Image, Text } from '@tarojs/components'
import { Button, Checkbox } from '@nutui/nutui-react-taro'
import { useState, useCallback } from 'react'
import { switchTab, showToast, navigateTo } from '@tarojs/taro'
import storage from '@/utils/storage'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import './index.less'

export default () => {
  const [checked, setChecked] = useState(false)
  const dispatch = useAppDispatch()
  const toHome = useCallback(() => {
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }, [])
  const loginHandle = () => {
    if (!checked) {
      showToast({ title: '请先阅读并同意隐私政策及用户协议', icon: 'none' })
      return false
    }
    storage.set('token', 10086)
    toHome()
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
        type='info'
        className='m10'
        onClick={() => {
          loginHandle()
        }}
      >
        微信一键登录
      </Button>
      <Button block type='default' onClick={toHome}>
        暂不登录
      </Button>
      <View className='agree-wrap'>
        <Checkbox
          iconSize={20}
          checked={checked}
          onChange={(state) => {
            setChecked(state)
          }}
        >
          <Text className='agree-text'>同意</Text>
        </Checkbox>
        <Text className='agree-link' onClick={() => {
            toRouter('privacy')
          }}>《隐私政策》</Text>
        <Text className='agree-link' onClick={() => {
            toRouter('protocol')
          }}>《用户协议》</Text>
      </View>
    </View>
  )
}
