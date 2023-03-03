import { View, Image, Icon } from '@tarojs/components'
import { Overlay } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import qrcodeImg from '@/assets/imgs/xxx.jpg'
import qrcodeImg2 from '@/assets/imgs/aaa.jpg'
import './index.less'

export default (props) => {
  const { visible, type, onClose } = props
  const typeMap = {
    gzh: '长按识别二维码关注公众号',
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
      <Overlay lockScroll visible={visible2}>
        <div className='wrapper'>
          <div className='wrapper-content'>
            <Image className='qrcode-image' mode='aspectFit' src={urlMap[type]}></Image>
            <View className='qrcode-desc'>{typeMap[type]}</View>
            <Icon
              onClick={() => {
                setVisible(false)
                onClose()
              }}
              className='clear-btn'
              size='50'
              type='cancel'
              color='#ccc'
            />
          </div>
        </div>
      </Overlay>
    </>
  )
}
