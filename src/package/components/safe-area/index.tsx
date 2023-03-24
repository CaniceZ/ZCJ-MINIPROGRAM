import { View } from '@tarojs/components'
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import Taro from '@tarojs/taro'
import useSafeBottom from '../../hooks/useSafeBottom'
import useSafeTop from '../../hooks/useSafeTop'

type Props = {
  /** 安全区所处位置,默认:bottom */
  location?: 'top' | 'bottom'
  /** 安全区定位模式,默认:fixed */
  position?: 'sticky' | 'fixed' | 'absolute'
  /** 是否是导航栏(仅在location为top时生效,与isBarHeight互斥且优先级高于isBarHeight),默认:false */
  isNavigationBar?: boolean
  /** 是否需要加上自定义导航栏高度(仅在location为top时生效),默认:false */
  isBarHeight?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * 安全区域组件(H5无需使用)
 * 支持头部自定义导航栏安全区域,同时可以通过isNavigationBar=true用于封装自定义导航栏
 * 支持底部操作条安全区域
 * @supported weapp, rn
 */
const SafeArea: FC<Props> = (props) => {
  const { safeAreaPadding: safeAreaTopPadding, statusBarHeight, safeTop } = useSafeTop()
  const { safeAreaPadding: safeAreaBottomPadding, safeBottom } = useSafeBottom()
  const {
    location = 'bottom',
    position = 'fixed',
    isNavigationBar = false,
    isBarHeight = false,
    className,
    style = {},
  } = props
  const [placeholderHeight, setPlaceholderHeight] = useState(0)

  useEffect(() => {
    Taro.nextTick(() => {
      if (position === 'fixed') {
        const query = Taro.createSelectorQuery()
        query
          .select('#safe_area')
          .boundingClientRect((rec) => {
            setPlaceholderHeight(rec.height)
          })
          .exec()
      }
    })
  }, [])

  const topPadding = useMemo(() => {
    let padding: CSSProperties = safeAreaTopPadding
    if (isBarHeight && !isNavigationBar) {
      padding.paddingTop = statusBarHeight + safeTop + 'px'
    }
    if (isNavigationBar) {
      padding.height = statusBarHeight + safeTop + 'px'
    }
    return padding
  }, [safeAreaTopPadding, statusBarHeight, safeTop])

  return process.env.TARO_ENV !== 'h5' ? (
    position !== 'fixed' ? (
      <View
        id='safe_area'
        className={classNames(`safe-area-${location}-${position}`, className)}
        style={{
          ...style,
          ...(location === 'bottom'
            ? safeBottom
              ? safeAreaBottomPadding
              : undefined
            : isBarHeight
            ? topPadding
            : safeAreaTopPadding),
        }}
      >
        {props.children}
      </View>
    ) : (
      <View style={{ height: placeholderHeight + 'px' }}>
        <View
          id='safe_area'
          className={classNames(`safe-area-${location}-${position}`, className)}
          style={{
            ...(location === 'bottom'
              ? safeBottom
                ? safeAreaBottomPadding
                : undefined
              : isBarHeight
              ? topPadding
              : safeAreaTopPadding),
            ...style,
          }}
        >
          {props.children}
        </View>
      </View>
    )
  ) : (
    <></>
  )
}

export default SafeArea
