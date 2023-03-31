import { View, Image } from '@tarojs/components'
import './index.less'

export default (props) => {
  const { text = '暂时没有相关数据' } = props
  return (
    <View className='no-data-wrap'>
      <Image
        className='no-data-img'
        mode='aspectFit'
        src='http://bg1.51ptj.com/no-data.png'
      ></Image>
      <View className='no-data-desc'>{text}</View>
    </View>
  )
}
