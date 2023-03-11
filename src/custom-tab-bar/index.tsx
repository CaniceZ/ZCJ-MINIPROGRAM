import { Tabbar, TabbarItem } from '@nutui/nutui-react-taro'
import { switchTab } from '@tarojs/taro'
import { useAppSelector, useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import { checkLoginAndRedirect } from '@/utils/utils'
import './index.less'

export default () => {
  const activeVisible = useAppSelector((state) => state.tabbar.activeVisible)
  const dispatch = useAppDispatch()
  const tabSwitch = ({ props }, index) => {
    if (index === 0 || (index && checkLoginAndRedirect())) {
      switchTab({
        url: props.href,
        success: () => {
          dispatch(setActiveVisible(index))
        },
      })
    }
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
      iconPath: '../assets/icon/home-index.png',
      selectedIconPath: '../assets/icon/home-index-active.png',
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
      unactiveColor='#ccc'
      activeColor='#333'
      bottom
      onSwitch={tabSwitch}
    >
      {list.map((item, index) => (
        <TabbarItem
          key={item.text}
          tabTitle={item.text}
          href={item.pagePath}
          icon={index === activeVisible ? item.selectedIconPath : item.iconPath}
        />
      ))}
    </Tabbar>
  )
}
