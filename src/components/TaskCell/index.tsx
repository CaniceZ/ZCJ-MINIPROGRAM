import { FC, useCallback } from 'react'
import { View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import './index.less'

const TaskCell: FC = (props) => {
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/detail/index' })
  }, [])
  return (
    <View className='taskcell-wrap' onClick={goDetail}>
      <View className='taskcell-top'>
        <View className='taskcell-top-title'>
          <View className='taskcell-top-left'>网鱼电竞酒店</View>
          <View className='taskcell-top-right'>待开始</View>
        </View>
        <View className='taskcell-time'>2023-02-23至2023-02-29</View>
      </View>
      <View className='taskcell-bot'>
        <View className='taskcell-bot-list'>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>¥10/间</View>
            <View className='taskcell-bot-item-bottom'>时薪</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>35</View>
            <View className='taskcell-bot-item-bottom'>总时长</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top'>7</View>
            <View className='taskcell-bot-item-bottom'>出勤时间</View>
          </View>
          <View className='taskcell-bot-item'>
            <View className='taskcell-bot-item-top red'>700</View>
            <View className='taskcell-bot-item-bottom'>预计收入</View>
          </View>
        </View>
      </View>
    </View>
  )
}
export default TaskCell
