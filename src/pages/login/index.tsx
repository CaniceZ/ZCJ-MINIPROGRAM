import { View, Image, Text } from '@tarojs/components'
import { Button, Checkbox } from '@nutui/nutui-react-taro'
import { useEffect, useState, useCallback } from 'react'
import { switchTab, showToast } from '@tarojs/taro'
import storage from '@/utils/storage'
import './index.less'

export default () => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    // hideHomeButton()
  })
  const toHome = useCallback(() => {
    switchTab({ url: '/pages/index/index' })
  }, [])
  const loginHandle = () => {
    if (!checked) {
      showToast({ title: '请先阅读并同意隐私政策及用户协议', icon: 'none' })
      return false
    }
    storage.set('token', 10086)
    toHome()
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
        <Text className='agree-link'>《隐私政策》</Text>
        <Text className='agree-link'>《用户协议》</Text>
      </View>
    </View>
  )
}
