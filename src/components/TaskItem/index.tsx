import { View, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FC, ReactNode, useCallback } from 'react'
import classNames from 'classnames'
import { hms2hm } from '@/utils/utils'
import { checkHelperEnroll } from '@/api/task'
import './index.less'

type Props = {
  index?: Number
  children?: ReactNode
  [key: string]: any
}
const mealMap = {
  1: '无餐补',
  2: '包餐',
  3: '有餐补',
}
const travelMap = {
  1: '自行到岗',
  2: '有车补',
}
const TaskItem: FC<Props> = (props) => {
  const goDetail = useCallback(async () => {
    const res = await checkHelperEnroll({ merchantTaskCode: props.merchantTaskCode })
    if (res && res.hasEnroll !== 0) {
      navigateTo({ url: `/subpackages/task/taskdetail/index?helperTaskCode=${res.helperTaskCode}` })
      return
    }
    const distance = props.distance ? (props.distance / 1000).toFixed(2) : '9999'
    navigateTo({
      url: `/subpackages/task/detail/index?merchantTaskCode=${props.merchantTaskCode}&distance=${distance}`,
    })
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
          src={`${props.merchantLogo}?imageMogr2/thumbnail/!100x100r`}
        ></Image>
        <View className='task-jobname'>{props.jobTypeName}</View>
        {props.enrollNum === props.personNum && <View className='task-image-mask'>已满员</View>}
      </View>
      <View className='task-content'>
        <View className='task-title'>
          <View className='task-title-left'>
            {props.merchantName}
            {props.anxiousOrder > 0 && <View className='ji'>急</View>}
          </View>
          <View className='task-title-right'>
            {props.distance ? (props.distance / 1000).toFixed(2) + 'km' : ''}
          </View>
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
            {props.mealType !== 1 && (
              <View className='task-desc-tag'>{mealMap[props.mealType]}</View>
            )}
            {props.travelType !== 1 && (
              <View className='task-desc-tag'>{travelMap[props.travelType]}</View>
            )}
          </View>
          <View className='task-desc-price'>
            <View className='task-desc-single red'>
              <View>¥</View>
              <View className='fs38 '>{props.helperPrice}</View>
              <View>/小时</View>
            </View>
            <View className='task-desc-total'>
              <View className='color-grey-1'>预计总收入：</View>
              <View className='red fs38'>{props.helperAmount}</View>
              <View>元</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TaskItem
