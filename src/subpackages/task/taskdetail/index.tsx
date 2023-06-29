import { View, Text, Image } from '@tarojs/components'
import {
  navigateTo,
  makePhoneCall,
  openLocation,
  useRouter,
  showToast,
  navigateBack,
  switchTab,
  useDidShow,
  useShareAppMessage,
} from '@tarojs/taro'
import { Button, Swiper, SwiperItem, Icon } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import { hms2hm, geoDistance } from '@/utils/utils'
import localImg from '@/assets/icon/local.png'
import storage from '@/utils/storage'
import Dialog from '@/components/Dialog'
import {
  cancelHelperTask,
  getHelperTaskDetail,
  getMerchantPhoto,
  getMerchantTask,
} from '@/api/task'
import { getHelperTaskItemStatus } from '@/api/attendance'

import useSetState from '@/hooks/useSetState'
import daikaishiIcon from '@/assets/icon/task-daikaishi.png' // 待开始
import fuwuzhongIcon from '@/assets/icon/task-fuwuzhong.png' // 进行中
import daijiesuanIcon from '@/assets/icon/task-daijiesuan.png' // 待结算
import yijieshuIcon from '@/assets/icon/task-yijieshu.png' // 已结束
import yiquxiaoIcon from '@/assets/icon/task-yiquxiao.png' // 已取消
import './index.less'

const iconMap = {
  10: daikaishiIcon,
  20: fuwuzhongIcon,
  30: daijiesuanIcon,
  40: yijieshuIcon,
  50: yiquxiaoIcon,
}
export default () => {
  const dispatch = useAppDispatch()
  const [initPage1] = useState(0)
  const [list, setList] = useState<string[]>([])
  const [info, setInfo] = useSetState<any>({})
  const [distance, setDistance] = useState(0)
  const {
    params: { helperTaskCode },
  } = useRouter()
  useShareAppMessage(() => {
    return {
      title: info.merchantName,
      path: `/subpackages/task/todetail/index?merchantTaskCode=${info.merchantTaskCode}&distance=${distance}`,
      imageUrl: list[0],
    }
  })
  useDidShow(() => {
    getHelperTaskDetail({ helperTaskCode }).then((data) => {
      setInfo(data)
      if (storage.get('localAddress')) {
        const tmp = geoDistance(
          storage.get('localAddress').latitude,
          storage.get('localAddress').longitude,
          data.latitude,
          data.longitude,
        )
        setDistance(tmp)
      }
      getMerchantPhoto({ merchantCode: data.merchantCode }).then((res2) => {
        setList(res2.merchantPhoto)
      })
      getMerchantTask({ merchantTaskCode: data.merchantTaskCode }).then((res3) => {
        setInfo({
          remark: res3.remark,
          contacts: res3.contacts,
          contactsPhone: res3.contactsPhone,
          address: res3.address,
          jobTypeName: res3.jobTypeName,
          enrollNum: res3.enrollNum,
          personNum: res3.personNum,
          hasEnroll: res3.hasEnroll,
        })
      })
    })
    getHelperTaskItemStatus({ helperTaskCode }).then((res) => {
      setInfo({
        helperTaskItemStatus: res?.helperTaskItemStatus, // 10：待提交，20：待审核，30：已审核，40：驳回，50：已取消
      })
    })
  })
  const goDetail = () => {
    navigateTo({
      url: `/subpackages/task/checklist/index?merchantTaskCode=${info.merchantTaskCode}`,
    })
  }
  const toOrderDetail = () => {
    navigateTo({
      url: `/subpackages/task/orderdetail/index?helperTaskCode=${info.helperTaskCode}`,
    })
  }
  const [dialogVisible, setDialogVisible] = useState(false)
  const cancelTaskHandle = async () => {
    setDialogVisible(true)
  }
  const onCancel = async () => {
    await cancelHelperTask({
      helperCode: storage.get('helperCode'),
      helperTaskCode: info.helperTaskCode,
      operateChannel: 1,
    })
    showToast({
      title: '取消任务成功',
      icon: 'none',
      success() {
        setTimeout(() => {
          setDialogVisible(false)
          navigateBack()
        }, 1000)
      },
    })
  }
  const confirm = () => {
    console.log('cancel')
    setDialogVisible(false)
  }
  const callPhone = (phone) => {
    makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log('拨打电话成功！')
      },
      fail: function () {
        console.log('拨打电话失败！')
      },
    })
  }
  const openLocal = () => {
    openLocation({
      latitude: info.latitude,
      longitude: info.longitude,
      scale: 18,
      name: info.merchantName,
      address: info.address,
    })
  }
  const toTaskList = () => {
    switchTab({ url: '/pages/task/index' })
    dispatch(setActiveVisible(1))
  }
  return (
    <>
      <View className='taskdetail-wrap'>
        {/* 完成情况 */}
        <View className='check-info'>
          <View className='check-info-item'>
            <View className='check-info-total'>
              <View className='check-info-total-label'>完成工时(小时)</View>
              <View className='check-info-total-value'>
                <View className='info-warn'>{info.workedNum}</View>
                {info.helperTaskItemStatus === 10 && <View className='info-tag'>考勤待提交</View>}
                {info.helperTaskItemStatus === 40 && <View className='info-tag'>考勤异常</View>}
              </View>
            </View>
            <View className='check-info-oper'>
              <View className='normal-info' onClick={goDetail}>
                查看考勤
              </View>
              <Icon name='rect-right' color={true ? '#4D8FFF' : '#F46048'} size={16}></Icon>
            </View>
          </View>
          <View className='check-info-item'>
            <View className='check-info-total border-r'>
              <View className='check-info-total-label'>已出勤天数(天)</View>
              <View className='check-info-total-value'>
                <View className='info-warn'>{info.servicedDay}</View>
              </View>
            </View>
            <View className='check-info-oper2'>
              <View className='check-info-oper2-label'>总收入(元)</View>
              <View className='info-warn'>{info.receivedAmount}</View>
            </View>
          </View>
        </View>
        {/* 基本信息 */}
        <View className='taskdetail-base'>
          <View className='task-jobname'>{info.jobTypeName}</View>
          <Image
            className='status-img'
            mode='aspectFit'
            src={iconMap[info.helperTaskStatus]}
          ></Image>
          <View className='taskdetail-base-title'>{info.merchantName}</View>
          {distance && (
            <View className='taskdetail-base-time'>
              <Icon size='14px' color='#5B5C5D' name='locationg3'></Icon>距您{distance}公里
            </View>
          )}
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
              {/* todo 取消->显示备注 */}
              {info.hasEnroll !== 2 && (
                <View className='form-text-item'>
                  <View className='form-text-label'>联系人：</View>
                  <View className='has-signup'>
                    <View>{info.contacts}</View>
                    <View
                      className='text-primary-color'
                      onClick={() => {
                        callPhone(info.contactsPhone)
                      }}
                    >
                      {info.contactsPhone}
                    </View>
                  </View>
                </View>
              )}
              {info.hasEnroll === 2 && (
                <View className='form-text-item'>
                  <View className='form-text-label'>备注：</View>
                  <View className='color-grey-1'>{info.operateRemark}</View>
                </View>
              )}
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
        {/* 报名信息 */}
        <View className='task-remark'>
          <View className='task-remark-title'>报名信息</View>
          <View className='task-remark-content'>任务号: {info.helperTaskCode}</View>
          <View className='task-remark-content'>报名时间: {info.createTime}</View>
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
        {/* 底部操作栏 */}
        {info.helperTaskStatus === 10 && (
          <View className='task-deatil-bottom'>
            <View className='task-deatil-bottom-btn'>
              <Button
                block
                type='primary'
                size='large'
                className='foot-btn'
                onClick={cancelTaskHandle}
              >
                取消任务
              </Button>
            </View>
          </View>
        )}
        {[20, 30].includes(info.helperTaskStatus) && info.helperTaskItemStatus !== 10 && (
          <View className='task-deatil-bottom'>
            <View className='task-deatil-bottom-btn'>
              <Button block type='primary' size='large' className='foot-btn' onClick={goDetail}>
                修改考勤工时
              </Button>
            </View>
          </View>
        )}
        {[20, 30].includes(info.helperTaskStatus) && info.helperTaskItemStatus === 10 && (
          <View className='task-deatil-bottom'>
            <View className='task-deatil-bottom-btn'>
              <Button block type='danger' size='large' className='foot-btn' onClick={goDetail}>
                提交考勤工时
              </Button>
            </View>
          </View>
        )}
        {info.helperTaskStatus === 50 && (
          <View className='task-deatil-bottom'>
            <View className='task-deatil-bottom-btn'>
              <Button
                block
                type='primary'
                plain
                size='large'
                className='foot-btn'
                onClick={toTaskList}
              >
                返回任务列表
              </Button>
            </View>
          </View>
        )}
        {info.helperTaskStatus === 40 && (
          <View className='task-deatil-bottom'>
            <View className='task-deatil-bottom-btn'>
              <Button block type='danger' size='large' className='foot-btn' onClick={toOrderDetail}>
                查看收益列表
              </Button>
            </View>
          </View>
        )}
      </View>
      <Dialog
        title='提示'
        type='danger'
        confirmlText='再考虑一下'
        cancelText='确认取消'
        visible={dialogVisible}
        onConfirm={confirm}
        onCancel={onCancel}
      >
        取消任务可能会对你产生负面评价 您确认取消该任务吗？
      </Dialog>
    </>
  )
}
