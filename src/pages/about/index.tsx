import { Icon } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { navigateTo, switchTab } from '@tarojs/taro'
import storage from '@/utils/storage'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import QrcodePopup from '@/components/QrcodePopup'
import { useState } from 'react'
import './index.less'

export default () => {
  const dispatch = useAppDispatch()
  const logout = () => {
    storage.remove('token')
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }
  const toRouter = (path: string) => {
    navigateTo({ url: `/subpackages/setting/${path}/index` })
  }
  const [isShow, setIsShow] = useState(false)
  return (
    <>
      <View className='about-wrap'>
        <View
          className='about-item-wrap about-info'
          onClick={() => {
            toRouter('userinfo')
          }}
        >
          <View className='about-label'>
            <View className='about-info-username'>郑创俊</View>
            <View className='about-info-phone'>
              {'18819482438'.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')}
            </View>
          </View>
          <View className='about-value'>
            <Icon name='rect-right' size='16px' color='#ccc'></Icon>
          </View>
        </View>
      </View>
      <View className='about-wrap'>
        <View
          className='about-item-wrap'
          onClick={() => {
            setIsShow(true)
          }}
        >
          <View className='about-label'>安全中心</View>
          <View className='about-value'>
            <View className='about-value-text'>修改绑定手机</View>
            <Icon name='rect-right' size='16px' color='#ccc'></Icon>
          </View>
        </View>
      </View>
      <View className='about-wrap doc-box'>
        <View className='about-item-wrap p30'>
          <View className='about-label'>意见反馈</View>
          <View className='about-value'>
            <Icon name='rect-right' size='16px' color='#ccc'></Icon>
          </View>
        </View>
        <View
          className='about-item-wrap p30'
          onClick={() => {
            toRouter('protocol')
          }}
        >
          <View className='about-label'>用户协议</View>
          <View className='about-value'>
            <Icon name='rect-right' size='16px' color='#ccc'></Icon>
          </View>
        </View>
        <View
          className='about-item-wrap p30'
          onClick={() => {
            toRouter('privacy')
          }}
        >
          <View className='about-label'>隐私政策</View>
          <View className='about-value'>
            <Icon name='rect-right' size='16px' color='#ccc'></Icon>
          </View>
        </View>
        <View
          className='about-item-wrap p30'
          onClick={() => {
            toRouter('aboutme')
          }}
        >
          <View className='about-label'>关于我们</View>
          <View className='about-value'>
            <View className='about-value-text'>V1.0.1</View>
            <Icon name='rect-right' size='16px' color='#ccc'></Icon>
          </View>
        </View>
      </View>
      <View className='about-wrap'>
        <View className='about-logout' onClick={logout}>
          退出登录
        </View>
      </View>
      {/* 联系人二维码 */}
      <QrcodePopup
        visible={isShow}
        type='wx'
        onClose={() => {
          setIsShow(false)
        }}
      ></QrcodePopup>
    </>
  )
}
