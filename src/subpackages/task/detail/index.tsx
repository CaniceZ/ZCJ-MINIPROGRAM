import { View, Text, Image, ScrollView } from '@tarojs/components'
import {
  navigateTo,
  openLocation,
  useRouter,
  showToast,
  redirectTo,
  useShareAppMessage,
  switchTab,
} from '@tarojs/taro'
import { Button, Swiper, SwiperItem, Icon } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import { checkLoginAndRedirect, geoDistance, hms2hm } from '@/utils/utils'
import localImg from '@/assets/icon/local.png'
import Dialog from '@/components/Dialog'
import storage from '@/utils/storage'
import { getMerchantTask, helperEnroll, getMerchantPhoto } from '@/api/task'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import './index.less'

export default () => {
  const [initPage1] = useState(0)
  const [list, setList] = useState<string[]>([])
  const [info, setInfo] = useState<any>({})
  const [distance, setDistance] = useState(0)
  const {
    params: { merchantTaskCode, shareFlag },
  } = useRouter()
  useEffect(() => {
    getMerchantTask({ merchantTaskCode }).then((data) => {
      setInfo(data)
      getMerchantPhoto({ merchantCode: data.merchantCode }).then((res2) => {
        setList(res2.merchantPhoto)
      })
      if (storage.get('localAddress')) {
        const tmp = geoDistance(
          storage.get('localAddress').latitude,
          storage.get('localAddress').longitude,
          data.latitude,
          data.longitude,
        )
        setDistance(tmp)
      }
    })
  }, [merchantTaskCode])
  useShareAppMessage(() => {
    return {
      title: info.merchantName,
      path: `/subpackages/task/todetail/index?merchantTaskCode=${merchantTaskCode}&distance=${distance}`,
      imageUrl: list[0],
    }
  })
  const openLocal = () => {
    openLocation({
      latitude: info.latitude,
      longitude: info.longitude,
      scale: 18,
      name: info.merchantName,
      address: info.address,
    })
  }
  // 确认报名
  const [dialogVisible, setDialogVisible] = useState(false)
  const confirm = async () => {
    const data = await helperEnroll({
      helperCode: storage.get('helperCode'),
      merchantTaskCode: info.merchantTaskCode,
    })
    showToast({
      title: '报名成功',
      icon: 'none',
      success() {
        setTimeout(() => {
          redirectTo({ url: `/subpackages/task/taskdetail/index?helperTaskCode=${data}` })
        }, 1000)
      },
    })
    setDialogVisible(false)
  }
  const onCancel = () => {
    console.log('cancel')
    setDialogVisible(false)
  }
  const signUp = async () => {
    if (checkLoginAndRedirect()) {
      if (storage.get('registerStatus') == 1) {
        setDialogVisible2(true)
      } else {
        setDialogVisible(true)
      }
    }
  }
  // 未实名弹窗
  const [dialogVisible2, setDialogVisible2] = useState(false)
  const confirm2 = () => {
    setDialogVisible2(false)
    navigateTo({ url: '/subpackages/realname/info/index?from=taskdetail' })
  }
  const onCancel2 = () => {
    console.log('cancel2')
    setDialogVisible2(false)
  }
  const dispatch = useAppDispatch()
  const toHome = () => {
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }
  return (
    <>
      <View className='taskdetail-wrap'>
        {/* 基本信息 */}
        <View className='taskdetail-base'>
          <View className='task-jobname'>{info.jobTypeName}</View>
          <View className='taskdetail-base-title'>{info.merchantName}</View>
          <View className='taskdetail-base-time'>
            <Icon size='14px' color='#5B5C5D' name='locationg3'></Icon>距您{distance}公里
          </View>
          <View className='taskdetail-base-time'>
            <View className='green'>{info.workDays}天</View>| {info.serviceStartDate?.split(' ')[0]}{' '}
            至 {info.serviceEndDate?.split(' ')[0]}
          </View>
          <View className='taskdetail-base-time'>
            上班时间：{hms2hm(info.shiftStartTime)}-{hms2hm(info.shiftEndTime)}
          </View>
          <View className='taskdetail-base-time space-between'>
            <View className='red'>到岗时间:{hms2hm(info.arrivalTime)}</View>
            <View>
              报名人数：<Text className='red fwb'>{info.enrollNum}</Text>/{info.personNum}
            </View>
          </View>
          {info.restType === 1 && (
            <View className='taskdetail-base-time'>
              休息时间: {hms2hm(info.restStartTime)}-{hms2hm(info.restEndTime)}
            </View>
          )}
          <View className='taskdetail-base-bottom'>
            <View className='taskdetail-base-bottom-left'>
              <View className='form-text-item'>
                <View className='form-text-label'>联系人：</View>
                <View className='color-grey-2'>成功报名后显示</View>
              </View>
              <View className='form-text-item'>
                <View className='form-text-label'>地址：</View>
                <View className='form-text-value w215'>{info.address}</View>
                <Image
                  className='local-img'
                  mode='aspectFit'
                  src={localImg}
                  onClick={() => {
                    openLocal()
                  }}
                ></Image>
              </View>
            </View>
          </View>
        </View>
        {/* 价格信息 */}
        <View className='taskdetail-price'>
          <View className='taskdetail-price-item'>
            <View className='price-item-label'>时薪</View>
            <View className='price-item-value'>
              ¥<Text className='fs38 fwb'>{info.helperPrice}</Text>/小时
            </View>
          </View>
          <View className='taskdetail-price-item'>
            <View className='price-item-label'>预估总工时</View>
            <View className='price-item-value fs38 fwb'>{info.workNum * info.workDays}</View>
          </View>
          {info.mealAllowance > 0 && (
            <View className='taskdetail-price-item'>
              <View className='price-item-label'>餐补</View>
              <View className='price-item-value'>
                ¥<Text className='fs38 fwb'>{info.mealAllowance}</Text>/天
              </View>
            </View>
          )}
          {info.travelAllowance > 0 && (
            <View className='taskdetail-price-item'>
              <View className='price-item-label'>车补</View>
              <View className='price-item-value'>
                ¥<Text className='fs38 fwb'>{info.travelAllowance}</Text>/天
              </View>
            </View>
          )}
          <View className='taskdetail-price-item'>
            <View className='price-item-label'>预计收入</View>
            <View className='price-item-value'>
              ¥<Text className='fs38 fwb'>{info.helperAmount}</Text>
            </View>
          </View>
        </View>
        {/* 工作要求 */}
        <View className='task-remark'>
          <View className='task-remark-title'>工作要求</View>
          <View className='task-remark-content'>{info.remark || '无'}</View>
        </View>
        {/* 轮播图 */}
        <View className='taskdetail-swiper'>
          <Swiper
            height='188'
            paginationColor='#4D8FFF'
            autoPlay='3000'
            initPage={initPage1}
            paginationVisible
          >
            {list.map((item) => {
              return (
                <SwiperItem key={item}>
                  <Image className='swiper-img' mode='aspectFill' src={item} />
                </SwiperItem>
              )
            })}
          </Swiper>
        </View>
      </View>
      {/* 底部操作栏 */}
      {info.enrollNum !== info.personNum && !info.hasEnroll && (
        <View className='task-deatil-bottom'>
          <View className='task-deatil-bottom-btn'>
            <Button block type='primary' size='large' className='foot-btn' onClick={signUp}>
              立刻报名
            </Button>
          </View>
        </View>
      )}
      {!(info.enrollNum !== info.personNum && !info.hasEnroll) && shareFlag && (
        <View className='task-deatil-bottom'>
          <View className='task-deatil-bottom-btn'>
            <Button block type='primary' size='large' className='foot-btn' onClick={toHome}>
              查看更多任务
            </Button>
          </View>
        </View>
      )}
      <Dialog title='报名确认' visible={dialogVisible} onConfirm={confirm} onCancel={onCancel}>
        <ScrollView className='kq-tip' scrollY>
          <View>{info.merchantName}</View>
          <View className='kq-tip-item'>
            <View className='kq-tip-label'>帮工日期</View>
            <View className='grey1 kq-tip-val'>
              {info.serviceStartDate?.split(' ')[0]} 至 {info.serviceEndDate?.split(' ')[0]}
            </View>
          </View>
          <View className='kq-tip-item'>
            <View className='kq-tip-label'>到岗时间</View>
            <View className='grey1 kq-tip-val'>{hms2hm(info.arrivalTime)}</View>
          </View>
        </ScrollView>
      </Dialog>
      <Dialog
        title='报名失败'
        type='danger'
        confirmlText='前往认证'
        cancelText='取消'
        visible={dialogVisible2}
        onConfirm={confirm2}
        onCancel={onCancel2}
      >
        抱歉，请完成个人资料 认证后再进行任务报名
      </Dialog>
    </>
  )
}
