import { View, Text, Image } from '@tarojs/components'
import { navigateTo, makePhoneCall, openLocation, useRouter } from '@tarojs/taro'
import { Button, Swiper, SwiperItem, Icon } from '@nutui/nutui-react-taro'
import { useState, useEffect, useCallback } from 'react'
import { checkLoginAndRedirect } from '@/utils/utils'
import localImg from '@/assets/icon/local.png'
import Dialog from '@/components/Dialog'
import storage from '@/utils/storage'
import { getMerchantTask } from '@/api/task'
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
  const [initPage1] = useState(0)
  const [list, setList] = useState<string[]>([])
  const [info, setInfo] = useState<any>({})
  const {
    params: { merchantTaskCode },
  } = useRouter()
  useEffect(() => {
    getMerchantTask({ merchantTaskCode }).then((data) => {
      setInfo(data)
    })
  }, [merchantTaskCode])
  useEffect(() => {
    setTimeout(() => {
      const arr: string[] = [
        'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
        'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
        'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
        'https://storage.360buyimg.com/jdc-article/fristfabu.jpg',
      ]
      setList(arr)
    }, 1000)
  }, [])
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/checklist/index' })
  }, [])
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
      latitude: 23.14463,
      longitude: 113.39199,
      scale: 18,
      name: '小炳胜',
      address: '广东省广州市天河区天河路218号天环PARC',
    })
  }
  // 确认报名
  const [dialogVisible, setDialogVisible] = useState(false)
  const confirm = () => {
    console.log('confirm')
    setDialogVisible(false)
  }
  const onCancel = () => {
    console.log('cancel')
    setDialogVisible(false)
  }
  const signUp = async () => {
    if (checkLoginAndRedirect()) {
      if (storage.get('registerStatus') == 1) {
        setDialogVisible2(false)
      } else {
        console.log('立即报名')
      }
    }
  }
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
  return (
    <>
      <View className='taskdetail-wrap'>
        {/* 完成情况 */}
        <View className='check-info'>
          <View className='check-info-item'>
            <View className='check-info-total'>
              <View className='check-info-total-label'>完成工时(小时)</View>
              <View className='check-info-total-value'>
                <View className='info-warn'>10</View>
                <View className='info-tag'>考勤待确认</View>
              </View>
            </View>
            <View className='check-info-oper'>
              {/* <View className='normal-warn'>查看考勤工时</View> */}
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
                <View className='info-warn'>2</View>
              </View>
            </View>
            <View className='check-info-oper2'>
              <View className='check-info-oper2-label'>总收入(元)</View>
              <View className='info-warn'>120</View>
            </View>
          </View>
        </View>
        {/* 基本信息 */}
        <View className='taskdetail-base'>
          <View className='task-jobname'>服务员</View>
          <Image
            className='status-img'
            mode='aspectFit'
            src={iconMap[info.merchantTaskStatus]}
          ></Image>
          <View className='taskdetail-base-title'>小炳胜</View>
          <View className='taskdetail-base-time'>
            <Icon size='14px' color='#5B5C5D' name='locationg3'></Icon>距您19公里
          </View>
          <View className='taskdetail-base-time'>
            <View className='green'>3天</View>| 2023-02-23 至 2023-02-29
          </View>
          <View className='taskdetail-base-time'>上班时间：9:00-18:00</View>
          <View className='taskdetail-base-time space-between'>
            <View className='red'>到岗时间: 8:00</View>
            <View>
              报名人数：<Text className='red fwb'>1</Text>/5
            </View>
          </View>
          <View className='taskdetail-base-time'>休息时间: 12:00-13:00</View>
          <View className='taskdetail-base-bottom'>
            <View className='taskdetail-base-bottom-left'>
              {/* todo 取消->显示备注 */}
              <View className='form-text-item'>
                <View className='form-text-label'>联系人：</View>
                {false ? (
                  <View className='color-grey-2'>成功报名后显示</View>
                ) : (
                  <View className='has-signup'>
                    <View>陈小姐</View>
                    <View
                      className='text-primary-color'
                      onClick={() => {
                        callPhone('18819282222')
                      }}
                    >
                      18819282222
                    </View>
                  </View>
                )}
              </View>
              <View className='form-text-item'>
                <View className='form-text-label'>地址：</View>
                <View className='form-text-value'>
                  广东省广州市天河区天河路218号天环PARC CENTRALB25
                </View>
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
              ¥<Text className='fs38 fwb'>10</Text>/小时
            </View>
          </View>
          <View className='taskdetail-price-item'>
            <View className='price-item-label'>预估总工时</View>
            <View className='price-item-value fs38 fwb'>24</View>
          </View>
          <View className='taskdetail-price-item'>
            <View className='price-item-label'>时薪</View>
            <View className='price-item-value'>
              ¥<Text className='fs38 fwb'>1200</Text>
            </View>
          </View>
        </View>
        {/* 工作要求 */}
        <View className='task-remark'>
          <View className='task-remark-title'>工作要求</View>
          <View className='task-remark-content'>
            包午餐、晚餐，工作时间不能玩手机；工作要求有服务员经验，性格开朗，飞机勿扰
          </View>
        </View>
        {/* 报名信息 */}
        <View className='task-remark'>
          <View className='task-remark-title'>报名信息</View>
          <View className='task-remark-content'>任务号: ST20230322001001</View>
          <View className='task-remark-content'>报名时间: 2023-03-22 09:02:56</View>
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
                  <Image className='swiper-img' src={item} />
                </SwiperItem>
              )
            })}
          </Swiper>
        </View>
      </View>
      {/* 底部操作栏 */}
      <View className='task-deatil-bottom'>
        <View className='task-deatil-bottom-btn'>
          <Button block type='primary' size='large' className='foot-btn' onClick={signUp}>
            立刻报名
          </Button>
        </View>
      </View>
      <Dialog title='报名确认' visible={dialogVisible} onConfirm={confirm} onCancel={onCancel}>
        <View className='kq-tip'>
          <View>大鸽饭（棠下店）</View>
          <View className='kq-tip-item'>
            <View className='kq-tip-label'>帮工日期</View>
            <View className='grey1 kq-tip-val'>2023-03-22至2023-03-23</View>
          </View>
          <View className='kq-tip-item'>
            <View className='kq-tip-label'>到岗时间</View>
            <View className='grey1 kq-tip-val'>08:00</View>
          </View>
        </View>
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
