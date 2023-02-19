import { CSSProperties, FC, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { ITouchEvent } from '@tarojs/components/types/common'
import classNames from 'classnames'
import Taro from '@tarojs/taro'
import useUUID from '../../../hooks/useUUID'

type Props = {
  /** 组件的内联样式, 可以动态设置的内联样式 */
  style?: CSSProperties
  /** 同 class，在 React/Nerv 里一般使用 className 作为 class 的代称 */
  className?: string
  /** 宽高是否等比 */
  equalRatio?: boolean
  /** 点击回调事件 */
  onClick?: (event: ITouchEvent) => void
}

const GridItem: FC<Props> = (props) => {
  const { className = '', style = {}, equalRatio, children, onClick } = props
  const [height, setHeight] = useState(0)
  const uuid = useUUID()

  useEffect(() => {
    Taro.nextTick(() => {
      if (equalRatio) {
        const query = Taro.createSelectorQuery()
        query.select('.grid-item-equal-ratio' + uuid).boundingClientRect()
        query.exec((res) => {
          res.length && res[0] && setHeight(res[0].width)
        })
      }
    })
  }, [equalRatio, className, style, uuid])

  return (
    <View
      style={{ ...style, height: height ? height + 'px' : 'auto' }}
      className={classNames(`grid-item ${equalRatio && 'grid-item-equal-ratio' + uuid}`, className)}
      onClick={onClick}
    >
      {children}
    </View>
  )
}

export default GridItem
