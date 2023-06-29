import { View, Image, Icon } from '@tarojs/components'
import { Overlay } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import './index.less'

export default (props) => {
  const {
    visible,
    type,
    onClose,
    text,
    subText = '轻松获取更多就业信息',
    isNavigationBar = false,
  } = props
  const typeMap = {
    gzh: '长按识别二维码,关注公众号',
    wx: '长按识别二维码添加微信',
  }
  const urlMap = {
    gzh: 'http://bg1.51ptj.com/bggzh-qrcode.png',
    wx: 'http://bg1.51ptj.com/bgkf-qrcode.png',
  }
  useEffect(() => {
    setVisible(visible)
  }, [visible])
  const [visible2, setVisible] = useState(false)
  return (
    <>
      <Overlay lockScroll visible={visible2} zIndex={10000}>
        <div className='qr-wrapper' style={{ marginTop: isNavigationBar ? '50%' : '30%' }}>
          <div className='qr-wrapper-content'>
            <View className='qrcode-image-wrap'>
              <Image
                className='qrcode-image'
                mode='aspectFit'
                show-menu-by-longpress='true'
                src={urlMap[type]}
              ></Image>
            </View>
            <View className='qrcode-desc'>{text || typeMap[type]}</View>
            {type === 'gzh' && <View className='qrcode-subtitle'>{subText}</View>}
            <Icon
              onClick={() => {
                setVisible(false)
                onClose()
              }}
              className='clear-btn'
              size='40'
              type='cancel'
              color='#fff'
            />
          </div>
        </div>
      </Overlay>
    </>
  )
}
