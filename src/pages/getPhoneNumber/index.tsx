import { Button } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import './index.less'

export default () => {
  const handleGetPhoneNumber = (e) => {
    console.log(e)
  }
  return (
    <View className='get-phone-wrap'>
      <Button block type='info' open-type='getPhoneNumber' onGetPhoneNumber={handleGetPhoneNumber}>
        一键授权手机号
      </Button>
    </View>
  )
}
