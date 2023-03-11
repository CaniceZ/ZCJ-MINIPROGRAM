import { View } from '@tarojs/components'
import './index.less'

export default () => {
  return (
    <>
      <View className='about-wrap'>
        <View className='about-item-wrap p30'>
          <View className='about-label'>真实姓名</View>
          <View className='about-value'>郑创俊</View>
        </View>
        <View className='about-item-wrap p30'>
          <View className='about-label'>手机号码</View>
          <View className='about-value'>18819482438</View>
        </View>
        <View className='about-item-wrap p30'>
          <View className='about-label'>所在地区</View>
          <View className='about-value'>广东省广州市天河区</View>
        </View>
        <View className='about-item-wrap p30'>
          <View className='about-label'>详细地址</View>
          <View className='about-value'>广东省广州市天河区天河路218号天环PARC</View>
        </View>
        <View className='about-item-wrap p30'>
          <View className='about-label'>擅长工作</View>
          <View className='about-value'>厨房</View>
        </View>
        <View className='about-item-wrap p30'>
          <View className='about-label'>工龄</View>
          <View className='about-value'>5年</View>
        </View>
      </View>
      <View className='about-wrap'>
        <View className='about-item-wrap p30'>
          <View className='about-label'>紧急联系人</View>
          <View className='about-value'>吕慌慌</View>
        </View>
        <View className='about-item-wrap p30'>
          <View className='about-label'>紧急联系人电话</View>
          <View className='about-value'>13222222222</View>
        </View>
      </View>
    </>
  )
}
