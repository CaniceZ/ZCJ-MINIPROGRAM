import { View } from '@tarojs/components'
import classNames from 'classnames'
import { FC, CSSProperties, ReactNode } from 'react'

type Props = {
  /** 标题 */
  title?: string | ReactNode
  header?: ReactNode
  /** 标题对齐位置,默认left*/
  tilteAlign?: 'right' | 'center' | 'left'
  /** 外层盒子自定义calss名*/
  className?: string
  /** 组件的内联样式, 可以动态设置的内联样式 */
  style?: string | CSSProperties
}

const Card: FC<Props> = (props) => {
  const { title, tilteAlign = 'left', style = {}, className = '', children, header } = props
  return (
    <View className={classNames('card-layout', className)} style={style}>
      {header ? (
        <View className='card-layout-header'>{header}</View>
      ) : (
        title && (
          <View className={classNames('card-layout-header', `card-layout-title-${tilteAlign}`)}>
            {title}
          </View>
        )
      )}
      {children}
    </View>
  )
}

export default Card
