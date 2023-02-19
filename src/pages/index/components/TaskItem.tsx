import { View, Image } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { FC, ReactNode, useCallback } from "react"
import settingIcon from '@/assets/imgs/im-facedefault.png'
import './TaskItem.less'
type Props = {
  index?: Number,
  children?: ReactNode
}

const TaskItem:FC<Props> = (props)=>{
  const { index } = props
  const goDetail = useCallback(() => {
    Taro.navigateTo({ url: '/subpackages/task/detail/index' })
  }, [])
  return (
    <View className="task-item" onClick={goDetail}>
      <Image mode="aspectFit" className="task-image" src={settingIcon}></Image>
      <View className="task-content">
        <View className="task-title">标题{index?.toString()}</View>
        <View className="task-desc">内容内容内容内容内容内容内容内容内容内容内容{index?.toString()}</View>
      </View>
    </View>
  )
}

export default TaskItem