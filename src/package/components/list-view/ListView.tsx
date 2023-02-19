import { FC, useState, useRef, useEffect, useCallback, createRef, CSSProperties } from 'react'
import { View, ScrollView, ITouchEvent, ScrollViewProps } from '@tarojs/components'
import classnames from 'classnames'

interface ListViewProps extends ScrollViewProps {
  className?: string
  style?: CSSProperties
  hasMore?: boolean
  loading?: boolean
  loadingText?: string
  noMoreText?: string
  threshold?: number
  onScrollToLower: () => Promise<void>
  onPullDownRefresh: () => Promise<void>
}

// 初始化状态
// 滚动加载状态
// 下拉刷新：1.下拉过程状态 2.达到阀值，可释放状态 3.加载中状态
const ListView: FC<ListViewProps> = (props) => {
  const {
    className,
    children,
    hasMore,
    loading,
    loadingText,
    noMoreText,
    threshold,
    onPullDownRefresh,
    onScrollToLower,
    bounces = false,
    ...rest
  } = props
  const scrollViewRef = createRef()
  const startY = useRef(0) // 滑动开始位置
  const scrollTop = useRef(0)
  // const isInit = useRef(false);
  const [scrollY, setScrollY] = useState(true)
  const [pulldown, setPulldown] = useState(false) // 下拉中
  const [reload, setReload] = useState(false) // 刷新中
  const [restore, setRestore] = useState(true) // 是否是归位状态， 默认归位
  const [blockStyle, setBlockStyle] = useState({}) // 下拉盒子样式

  const resetLoad = useCallback((height = 0, cb?) => {
    let canScrollY = false
    if (height === 0) {
      canScrollY = true
    }
    setScrollY(canScrollY)
    setBlockStyle({
      height: `${height}px`,
      transition: 'height 300ms',
    })
    setReload(height === 40)
    setRestore(height === 0)
    // TODO 监听真正动画结束
    setTimeout(function () {
      if (cb) cb()
    }, 400)
  }, [])

  const touchEvent = useCallback(
    (e: ITouchEvent) => {
      const { type, touches } = e
      if (!onPullDownRefresh) return
      if (scrollTop.current > 10) return
      switch (type) {
        case 'touchstart': {
          // 记录触摸开始位置
          startY.current = touches[0].clientY
          break
        }
        case 'touchmove': {
          const { clientY } = touches[0]
          const height = Math.floor((clientY - startY.current) / 5)
          if (height < 0 || scrollTop.current > 10) return
          setScrollY(false)
          setRestore(false)

          e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
          if (height > 0 && height < 80) {
            if (height < 40) {
              setPulldown(false)
            } else {
              setPulldown(true)
            }
            setBlockStyle({
              height: `${height}px`,
            })
          }
          break
        }
        case 'touchend': {
          if (pulldown) {
            init()
          } else {
            resetLoad(0)
          }
          break
        }
        case 'touchcancel': {
          if (!pulldown) {
            init()
          } else {
            resetLoad(0)
          }
          break
        }
        default: {
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPullDownRefresh, pulldown, resetLoad],
  )

  const handleScroll = useCallback((e) => {
    const {
      detail: { scrollTop: top },
    } = e
    scrollTop.current = top
  }, [])

  const handleScrollToLower = useCallback(async () => {
    await onScrollToLower()
  }, [onScrollToLower])

  const init = useCallback(async () => {
    resetLoad(40)
    if (onPullDownRefresh) {
      await onPullDownRefresh()
    }
    resetLoad(0)
    setPulldown(false)
    // eslint-disable-next-line
  }, [])

  // 初始化
  useEffect(() => {
    init()
    // eslint-disable-next-line
  }, [])

  return (
    <ScrollView
      ref={scrollViewRef}
      className={classnames('ygp-listview', className)}
      scrollY={scrollY}
      lowerThreshold={threshold}
      enableBackToTop
      scrollWithAnimation
      onScrollToLower={handleScrollToLower}
      onScroll={handleScroll}
      bounces={bounces}
      {...rest}
    >
      <View
        style={{ minHeight: '100%' }}
        onTouchStart={touchEvent}
        onTouchMove={touchEvent}
        onTouchEnd={touchEvent}
        onTouchCancel={touchEvent}
      >
        <View className='ygp-listview__pulldown' style={blockStyle}>
          <View className='ygp-listview__pulldown-indicator'>
            {!restore && pulldown && !reload && <View>释放刷新</View>}
            {!restore && !pulldown && !reload && <View>下拉刷新</View>}
            {reload && <View>刷新中</View>}
          </View>
        </View>
        <View className='ygp-listview__body'>{children}</View>
        <View>
          {!reload && (
            <View className='ygp-listview__footer'>
              {loading && loadingText}
              {!hasMore && noMoreText}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

ListView.defaultProps = {
  loading: false, // 滚动加载状态
  loadingText: '加载中...',
  noMoreText: '暂无更多内容',
  hasMore: true, // 是否还有更多数据
  threshold: 200,
  onScrollToLower: async () => {},
  onPullDownRefresh: async () => {},
}

export default ListView
