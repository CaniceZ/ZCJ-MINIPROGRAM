import { Button, Icon } from '@nutui/nutui-react-taro'
import { View, Image } from '@tarojs/components'
import { navigateTo, useDidShow } from '@tarojs/taro'
import QrcodePopup from '@/components/QrcodePopup'
import { useState } from 'react'
import { SafeArea } from '@/package'
import classNames from 'classnames'
import { getCurrentHelperInfoDetail } from '@/api/info'
import maleImg from '@/assets/icon/male.png'
import femaleImg from '@/assets/icon/female.png'
import vipImg0 from '@/assets/icon/vip0.png'
import vipImg from '@/assets/icon/vip.png'

import './index.less'

export default () => {
  const toRouter = (path: string) => {
    navigateTo({ url: `/subpackages/setting/${path}/index` })
  }
  const toRealName = () => {
    navigateTo({ url: '/subpackages/realname/info/index' })
  }
  type InfoType = {
    helperName: string
    jobAge: number
    majorJobTypeName: string
    mobile: string
    sex: number
    validateResult: boolean
  }
  const [info, setInfo] = useState<Partial<InfoType>>({})
  useDidShow(() => {
    getCurrentHelperInfoDetail({}).then((data) => {
      setInfo(data)
    })
  })
  const [isShow, setIsShow] = useState(false)
  return (
    <>
      <SafeArea
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#4D8FFF',
          minHeight: '80px',
          color: '#fff',
          fontSize: '32rpx',
          fontWeight: 500,
        }}
        isNavigationBar
        location='top'
        position='sticky'
      >
        我的
      </SafeArea>
      <View className='info-wrap'>
        <View className='info-left'>
          <Image src={info.sex === 1 ? maleImg : femaleImg} className='info-avart'></Image>
        </View>
        <View className='info-right'>
          <View className='info-right-base'>
            <View className='info-right-base-name'>{info.helperName}</View>
            <View
              className={classNames('info-right-base-level', { disable: !info.validateResult })}
            >
              <Image className='level-img' src={info.validateResult ? vipImg : vipImg0}></Image>
              {info.validateResult ? '已认证' : '未认证'}
            </View>
          </View>
          <View className='info-right-phone'>{info.mobile}</View>
          {false && (
            <View className='info-right-taglist'>
              <View className='tag-item'>{info.majorJobTypeName}</View>
              <View className='tag-item'>{info.jobAge}年工龄</View>
            </View>
          )}
        </View>
        {!info.validateResult && (
          <View className='realname-btn' onClick={toRealName}>
            <Button type='primary' block className='foot-btn'>
              立即认证
            </Button>
          </View>
        )}
      </View>
      <View className='about-wrap'>
        <View
          className='about-item-wrap p30'
          onClick={() => {
            setIsShow(true)
          }}
        >
          <View className='about-label'>联系我们</View>
          <View className='about-value'>
            <Icon name='rect-right' size='14px' color='#5B5C5D'></Icon>
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
            <Icon name='rect-right' size='14px' color='#5B5C5D'></Icon>
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
            <Icon name='rect-right' size='14px' color='#5B5C5D'></Icon>
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
            <Icon name='rect-right' size='14px' color='#5B5C5D'></Icon>
          </View>
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
