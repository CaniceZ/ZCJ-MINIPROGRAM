import { View } from '@tarojs/components'
import { FC } from 'react'
import './RealName.less'

const RealName: FC = () => {
  return (
    <View className='real-name-box'>
      <View className='real-name-item'>实名认证</View>
      <View className='real-name-item'>去接单</View>
    </View>
  )
}
export default RealName
