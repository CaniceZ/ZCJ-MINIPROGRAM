import { FC, useCallback } from 'react'
import { View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import classNames from 'classnames'
import './index.less'

const TaskCell: FC = (props: any) => {
  const goDetail = useCallback(() => {
    navigateTo({ url: `/subpackages/task/taskdetail/index?helperTaskCode=${props.helperTaskCode}` })
  }, [props.helperTaskCode])
  return (
    <View
      className={classNames('taskcell-wrap', { active: props.helperTaskStatus == 10 })}
      onClick={goDetail}
    >
      <View className='taskcell-top'>
        <View
          className={classNames('taskcell-top-title', {
            'warn-bl': props.helperTaskStatus == 10,
          })}
        >
          <View className='taskcell-top-left'>{props.merchantName}</View>
          <View
            className={classNames('taskcell-top-right', {
              'taskcell-top-right-warn': props.helperTaskStatus == 10,
              'taskcell-top-right-disable': [40, 50].includes(props.helperTaskStatus),
            })}
          >
            {props.helperTaskStatusName}
          </View>
        </View>
        <View className='taskcell-time'>
          {props.serviceStartDate?.split(' ')[0]} 至 {props.serviceEndDate?.split(' ')[0]}
        </View>
      </View>
      <View className='taskcell-bot'>
        <View className='taskcell-bot-list'>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>时薪</View>
            <View className='taskcell-bot-item-bottom'>{props.helperPrice}</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>总工时</View>
            <View className='taskcell-bot-item-bottom'>{props.totalWorkNum}</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>出勤天数</View>
            <View className='taskcell-bot-item-bottom'>{props.workDays}</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>预计收入</View>
            <View className='taskcell-bot-item-bottom'>{props.helperAmount}</View>
          </View>
        </View>
      </View>
    </View>
  )
}
export default TaskCell
