import { View } from '@tarojs/components'
import classNames from 'classnames'
import { FC, Children, cloneElement, isValidElement, CSSProperties, ReactNode } from 'react'

type Props = {
  /** 标题 */
  title?: string | ReactNode
  /** 标题对齐位置,默认left*/
  tilteAlign?: 'right' | 'center' | 'left'
  /** 列数,默认3*/
  columnNum?: 1 | 2 | 3 | 4
  /** 外层盒子自定义calss名*/
  className?: string
  /** 组件的内联样式, 可以动态设置的内联样式 */
  style?: string | CSSProperties
  /** 底下GridItem是否等比*/
  equalRatio?: boolean,
  /** 默认插槽*/
  children?: ReactNode
}

const Grid: FC<Props> = (props) => {
  const {
    title,
    equalRatio,
    columnNum = 3,
    tilteAlign = 'left',
    style = {},
    children,
    className = '',
  } = props
  return (
    <View className={classNames('grid-layout', className)} style={style}>
      {title && <View className={`grid-layout-title-${tilteAlign}`}>{title}</View>}
      <View className={`grid-layout-content-${columnNum}`}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) {
            return null
          }
          const childProps = {
            equalRatio,
            ...child.props,
          }
          return cloneElement(child, childProps)
        })}
      </View>
    </View>
  )
}

export default Grid
