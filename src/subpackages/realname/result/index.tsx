import { Button, Icon } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { switchTab } from '@tarojs/taro'
import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import './index.less'

export default () => {
  const dispatch = useAppDispatch()
  const toHome = useCallback(() => {
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }, [])
  return (
    <View className='result-wrap'>
      <Icon name='checked' size='120px' color='#5270ea'></Icon>
      <View>恭喜您已成功注册，返回首页马上接单吧！</View>
      <Button size='large' type='info' onClick={toHome}>
        完成
      </Button>
    </View>
  )
}
