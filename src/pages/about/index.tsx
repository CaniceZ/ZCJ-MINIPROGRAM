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
import storage from '@/utils/storage'
import { checkLoginAndRedirect } from '@/utils/utils'
import Dialog from '@/components/Dialog'
import './index.less'

export default () => {
  const toRouter = (path: string) => {
    navigateTo({ url: `/subpackages/setting/${path}/index` })
  }
  const toRealName = () => {
    if (storage.get('registerStatus') == '0') {
      navigateTo({ url: '/pages/login/index' })
    } else {
      navigateTo({ url: '/subpackages/realname/info/index' })
    }
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
  // 未实名弹窗
  const [dialogVisible2, setDialogVisible2] = useState(false)
  const confirm2 = () => {
    setDialogVisible2(false)
    navigateTo({ url: '/subpackages/realname/info/index' })
  }
  const onCancel2 = () => {
    console.log('cancel2')
    setDialogVisible2(false)
  }
  const toPlan = async () => {
    if (checkLoginAndRedirect()) {
      if (storage.get('registerStatus') == 1) {
        setDialogVisible2(true)
      } else {
        navigateTo({ url: '/subpackages/setting/plan/index' })
      }
    }
  }
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
              {info.mobile ? '立即认证' : '立即注册'}
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
        <View className='about-item-wrap p30' onClick={toPlan}>
          <View className='about-label'>可兼职时间</View>
          <View className='about-value'>
            <Icon name='rect-right' size='14px' color='#5B5C5D'></Icon>
          </View>
        </View>
      </View>
      {/* 联系人二维码 */}
      <QrcodePopup
        visible={isShow}
        type='wx'
        isNavigationBar
        onClose={() => {
          setIsShow(false)
        }}
      ></QrcodePopup>
      <Dialog
        title='填写失败'
        type='danger'
        confirmlText='前往认证'
        cancelText='取消'
        isNavigationBar
        visible={dialogVisible2}
        onConfirm={confirm2}
        onCancel={onCancel2}
      >
        抱歉，请完成个人资料 认证后再填写可兼职时间
      </Dialog>
    </>
  )
}
