import { View, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FC, ReactNode, useCallback } from 'react'
import settingIcon from '@/assets/imgs/im-facedefault.png'
import classNames from 'classnames'
import './index.less'

type Props = {
  index?: Number
  children?: ReactNode
  [key: string]: any
}

const TaskItem: FC<Props> = (props) => {
  const { index } = props
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/detail/index' })
  }, [])
  return (
    <View className='task-item' onClick={goDetail}>
      <View className={classNames('task-image-wrap', { 'image-disable': index % 2 })}>
        <Image className='task-image' mode='aspectFit' src={settingIcon}></Image>
        <View className='task-image-mask'>已满</View>
      </View>
      <View className='task-content'>
        <View className='task-title text-ellipsis'>
          标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
          {index?.toString()}
        </View>
        <View className='task-desc'>
          <View className='task-desc-time'>
            2023-02-23至2023-02-24 共1天 {true && '| 距您10公里'}
          </View>
          <View className='task-desc-time'>上班时间：14:00-16:00</View>
          <View className='task-desc-price'>
            <View className='task-desc-single red'>¥20/小时</View>
            <View className='task-desc-total'>
              <View>预计总收入：</View>
              <View className='red'>860元</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TaskItem
