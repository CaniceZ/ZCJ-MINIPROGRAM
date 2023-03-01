import { Icon } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { useCallback } from 'react'
import classNames from 'classnames'
import './index.less'

export default () => {
  const listData = [{}, {}, {}]
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/checksubmit/index' })
  }, [])
  return (
    <>
      <View className='chcecklist-wrap'>
        {listData.map((_, index) => (
          <View key={index} className='checklist-item'>
            <View className='checklist-item-time'>2024-02-24</View>
            <View className='checklist-item-content'>
              <View className='checklist-item-content-main'>10间</View>
              <View className='checklist-item-content-remark'>(标间)</View>
              <View className='checklist-item-content-icon' onClick={goDetail}>
                <Icon name='edit' color='skyblue' size='16px' />
              </View>
            </View>
            <View className={classNames('checklist-item-status', { red: index % 2 })}>已确认</View>
          </View>
        ))}
      </View>
    </>
  )
}
