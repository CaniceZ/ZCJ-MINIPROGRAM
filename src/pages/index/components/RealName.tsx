import { View } from '@tarojs/components'
import { FC, useCallback } from 'react'
import { navigateTo } from '@tarojs/taro'
import './RealName.less'

const RealName: FC = () => {
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/realname/info/index' })
  }, [])
  return (
    <View className='real-name-box'>
      <View className='real-name-item' onClick={goDetail}>实名认证</View>
      <View className='real-name-item'>去接单</View>
    </View>
  )
}
export default RealName
