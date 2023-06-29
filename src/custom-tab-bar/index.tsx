import { Tabbar, TabbarItem } from '@nutui/nutui-react-taro'
import { switchTab } from '@tarojs/taro'
import { useAppSelector, useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible, setDotVisible } from '@/store/tabbar'
import { checkLoginAndRedirect } from '@/utils/utils'
import './index.less'

export default () => {
  const activeVisible = useAppSelector((state) => state.tabbar.activeVisible)
  const dotVisible = useAppSelector((state) => state.tabbar.dotVisible)
  const dispatch = useAppDispatch()
  const tabSwitch = ({ props }, index) => {
    switchTab({
      url: props.href,
      success: () => {
        dispatch(setActiveVisible(index))
        if (index === 1 && dotVisible) {
          dispatch(setDotVisible(false))
        }
      },
    })
  }
  const list = [
    {
      text: '首页',
      pagePath: '/pages/index/index',
      iconPath: '../assets/icon/home-index.png',
      selectedIconPath: '../assets/icon/home-index-active.png',
    },
    {
      text: '任务',
      pagePath: '/pages/task/index',
      iconPath: '../assets/icon/task-index.png',
      selectedIconPath: '../assets/icon/task-index-active.png',
    },
    {
      text: '收益',
      pagePath: '/pages/order/index',
      iconPath: '../assets/icon/order-index.png',
      selectedIconPath: '../assets/icon/order-index-active.png',
    },
    {
      text: '我的',
      pagePath: '/pages/about/index',
      iconPath: '../assets/icon/home-my.png',
      selectedIconPath: '../assets/icon/home-my-active.png',
    },
  ]
  return (
    <Tabbar
      activeVisible={activeVisible}
      safeAreaInsetBottom
      unactiveColor='#5B5C5D'
      activeColor='#4D8FFF'
      size='24'
      bottom
      onSwitch={tabSwitch}
    >
      {list.map((item, index) => (
        <TabbarItem
          dot={index === 1 && dotVisible}
          key={item.text}
          tabTitle={item.text}
          href={item.pagePath}
          icon={index === activeVisible ? item.selectedIconPath : item.iconPath}
        />
      ))}
    </Tabbar>
  )
}
