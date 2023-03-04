import { View, Icon } from '@tarojs/components'
import { Overlay } from '@nutui/nutui-react-taro'
import { FC, useEffect, useState } from 'react'
import TaskItem from '@/components/TaskItem'
import './Recommend.less'

const Recommend: FC = (props: any) => {
  const { visible, list, onClose } = props
  useEffect(() => {
    setVisible(visible)
  }, [visible])
  const [visible2, setVisible] = useState(false)
  return (
    <>
      <Overlay lockScroll visible={visible2}>
        <View className='wrapper'>
          <View className='wrapper-content'>
            <View className='wrapper-content-tit'>优质推荐商家</View>
            {list.map((_, index) => (
              <TaskItem key={index} index={index}></TaskItem>
            ))}
          </View>
          <Icon
            onClick={() => {
              setVisible(false)
              onClose()
            }}
            className='clear-btn'
            size='50'
            type='cancel'
            color='#ccc'
          />
        </View>
      </Overlay>
    </>
  )
}

export default Recommend
