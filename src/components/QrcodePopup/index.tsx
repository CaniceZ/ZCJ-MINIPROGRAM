import { View, Image, Icon } from '@tarojs/components'
import { Overlay } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import qrcodeImg from '@/assets/imgs/xxx.jpg'
import qrcodeImg2 from '@/assets/imgs/aaa.jpg'
import './index.less'

export default (props) => {
  const { visible, type, onClose, text, isNavigationBar = false } = props
  const typeMap = {
    gzh: '长按识别二维码,关注公众号',
    wx: '长按识别二维码添加微信',
  }
  const urlMap = {
    gzh: qrcodeImg,
    wx: qrcodeImg2,
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
            {type === 'gzh' && <View className='qrcode-subtitle'>轻松获取更多就业信息</View>}
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
