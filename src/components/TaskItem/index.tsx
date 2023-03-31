import { View, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FC, ReactNode, useCallback } from 'react'
import classNames from 'classnames'
import { hms2hm } from '@/utils/utils'
import './index.less'

type Props = {
  index?: Number
  children?: ReactNode
  [key: string]: any
}

const TaskItem: FC<Props> = (props) => {
  const goDetail = useCallback(() => {
    navigateTo({ url: `/subpackages/task/detail/index?merchantTaskCode=${props.merchantTaskCode}` })
  }, [])
  return (
    <View className='task-item' onClick={goDetail}>
      <View
        className={classNames('task-image-wrap', {
          'image-disable': props.enrollNum === props.personNum,
        })}
      >
        <Image
          className='task-image'
          mode='aspectFill'
          src='https://t8.baidu.com/it/u=920319538,2894541429&fm=218&app=126&size=f242,150&n=0&f=JPEG&fmt=auto?s=DA003A641AF0A44F4E75548B0300E0C1&sec=1679677200&t=d928df375d194a0c7280076d1cd248d0'
        ></Image>
        <View className='task-jobname'>{props.jobTypeName}</View>
        {props.enrollNum === props.personNum && <View className='task-image-mask'>已满员</View>}
      </View>
      <View className='task-content'>
        <View className='task-title'>
          <View className='task-title-left'>{props.merchantName}</View>
          <View className='task-title-right'>5km</View>
        </View>
        <View className='task-desc'>
          <View className='task-desc-time'>
            <View className='green'>{props.workDays}天</View> |{' '}
            {props.serviceStartDate?.split(' ')[0]} 至 {props.serviceEndDate?.split(' ')[0]}
          </View>
          <View className='task-desc-time'>
            上班时间：{hms2hm(props.shiftStartTime)}至{hms2hm(props.shiftEndTime)}
          </View>
          <View className='task-desc-time'>
            {props.mealType !== 1 && <View className='task-desc-tag'>{props.mealTypeName}</View>}
            {props.travelType !== 1 && (
              <View className='task-desc-tag'>{props.travelTypeName}</View>
            )}
          </View>
          <View className='task-desc-price'>
            <View className='task-desc-single red'>
              <View>¥</View>
              <View className='fs38 '>{props.workPrice}</View>
              <View>/小时</View>
            </View>
            <View className='task-desc-total'>
              <View className='color-grey-1'>预计总收入：</View>
              <View className='red fs38'>{props.merchantAmount}</View>
              <View>元</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TaskItem
