import { FC, useCallback } from 'react'
import { View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import classNames from 'classnames'
import './index.less'

const TaskCell: FC = (props) => {
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/detail/index' })
  }, [])
  return (
    <View className={classNames('taskcell-wrap', { active: props.merchantTaskStatus == 10 })} onClick={goDetail}>
      <View className='taskcell-top'>
        <View className={classNames('taskcell-top-title', { 'warn-bl': props.merchantTaskStatus == 10 })}>
          <View className='taskcell-top-left'>{props.merchantName}</View>
          <View
            className={classNames('taskcell-top-right', { 'taskcell-top-right-warn': props.merchantTaskStatus == 10 })}
          >
            {props.merchantTaskStatusName}
          </View>
        </View>
        <View className='taskcell-time'>{props.serviceStartDate} 至 {props.serviceEndDate}</View>
        {/* <View className='taskcell-time'>到岗时间：{props.daogangshijian}</View> */}
      </View>
      <View className='taskcell-bot'>
        <View className='taskcell-bot-list'>
        <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>时薪</View>
            <View className='taskcell-bot-item-bottom'>{props.zonggongshi}</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>总工时</View>
            <View className='taskcell-bot-item-bottom'>{props.zonggongshi}</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>出勤天数</View>
            <View className='taskcell-bot-item-bottom'>{props.workDays}</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>预计收入</View>
            <View className='taskcell-bot-item-bottom'>{props.personNum}</View>
          </View>
        </View>
      </View>
    </View>
  )
}
export default TaskCell
