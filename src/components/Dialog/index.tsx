import { View } from '@tarojs/components'
import { Overlay, Button } from '@nutui/nutui-react-taro'
import { ReactNode, useEffect, useState } from 'react'
import classNames from 'classnames'
import './index.less'

export type DialogProps = {
  visible: Boolean
  title: String
  onCancel: () => void
  onConfirm: () => void
  isNavigationBar?: Boolean
  children?: ReactNode
  type?: 'danger' | undefined
  cancelText?: String
  confirmlText?: String
}

export default (props: DialogProps) => {
  const {
    visible,
    title = '提醒',
    onCancel,
    onConfirm,
    isNavigationBar,
    children,
    type,
    cancelText = '取消',
    confirmlText = '确定',
  } = props
  useEffect(() => {
    setVisible(visible)
  }, [visible])
  const [visible2, setVisible] = useState(false)
  return (
    <>
      <Overlay lockScroll visible={visible2} zIndex={10000}>
        <View className='dialog-wrapper' style={{ marginTop: isNavigationBar ? '70%' : '50%' }}>
          <View
            className={classNames('dialog-wrapper-content', {
              'dialog-wrapper-content-danger': type === 'danger',
            })}
          >
            <View>
              <View className='dialog-wrapper-title'>{title}</View>
              <View className='desc'>{children}</View>
            </View>
            <View className='foot-btn'>
              <Button
                onClick={onCancel}
                className='round-btn'
                type={type === 'danger' ? 'default' : 'primary'}
                plain
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                className='round-btn'
                type={type === 'danger' ? 'danger' : 'primary'}
              >
                {confirmlText}
              </Button>
            </View>
          </View>
        </View>
      </Overlay>
    </>
  )
}
