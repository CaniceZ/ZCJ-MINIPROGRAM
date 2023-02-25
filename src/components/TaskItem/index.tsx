import { View, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { FC, ReactNode, useCallback } from 'react'
import { Ellipsis } from '@nutui/nutui-react-taro'
import settingIcon from '@/assets/imgs/im-facedefault.png'
import './index.less'

type Props = {
  index?: Number
  children?: ReactNode
  [key: string]: any
}

const TaskItem: FC<Props> = (props) => {
  const { index } = props
  const content =
    'NutUI3.0上线后我们研发团队也在不断的优化、测试、使用、迭代 Vue3 的相关组件，但是在跨端小程序的开发过程中，发现没有合适的组件库可以支持多端开发。为了填补这一空白，同时为了优化开发者体验，让 NutUI 能够为更多的开发者带来便利，我们决定在 NutUI 中增加小程序多端适配的能力。'
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/detail/index' })
  }, [])
  return (
    <View className='task-item' onClick={goDetail}>
      <Image mode='aspectFit' className='task-image' src={settingIcon}></Image>
      <View className='task-content'>
        <View className='task-title'>标题{index?.toString()}</View>
        <View className='task-desc'>
          <Ellipsis content={content} direction='end' />
          {/* 内容内容内容内容内容内容内容内容内容内容内容{index?.toString()} */}
        </View>
      </View>
    </View>
  )
}

export default TaskItem
