import { View, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FC, ReactNode, useCallback } from 'react'
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
        <Image
          className='task-image'
          mode='aspectFill'
          src='https://t8.baidu.com/it/u=920319538,2894541429&fm=218&app=126&size=f242,150&n=0&f=JPEG&fmt=auto?s=DA003A641AF0A44F4E75548B0300E0C1&sec=1679677200&t=d928df375d194a0c7280076d1cd248d0'
        ></Image>
        <View className='task-jobname'>服务员</View>
        <View className='task-image-mask'>已满</View>
      </View>
      <View className='task-content'>
        <View className='task-title'>
          <View className='task-title-left'>
            任务名称任务
            {index?.toString()}
          </View>
          <View className='task-title-right'>5km</View>
        </View>
        <View className='task-desc'>
          <View className='task-desc-time'>
            <View className='green'>3天</View> | 2023-02-23 至 2023-02-24
          </View>
          <View className='task-desc-time'>上班时间：14:00-16:00</View>
          <View className='task-desc-time'>
            <View className='task-desc-tag'>近地铁</View>
            <View className='task-desc-tag'>包中餐</View>
            <View className='task-desc-tag'>车费补贴</View>
          </View>
          <View className='task-desc-price'>
            <View className='task-desc-single red'>
              <View>¥</View>
              <View className='fs38 '>20</View>
              <View>/小时</View>
            </View>
            <View className='task-desc-total'>
              <View className='color-grey-1'>预计总收入：</View>
              <View className='red fs38'>860</View>
              <View>元</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TaskItem
