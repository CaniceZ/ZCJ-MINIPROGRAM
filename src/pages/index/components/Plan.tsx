import { View } from '@tarojs/components'
import { checkLoginAndRedirect } from '@/utils/utils'
import storage from '@/utils/storage'
import { navigateTo, useDidShow } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import Dialog from '@/components/Dialog'
import classNames from 'classnames'
import { useAppSelector } from '@/hooks/useStore'
import { listCurrentHelperPartTimePlan, listAllPartTimeShift } from '@/api/plan'
import dayjs from 'dayjs'
import './Plan.less'

export default (props) => {
  const token = useAppSelector((state) => state.user.token)
  const weekList = ['一', '二', '三', '四', '五', '六', '日']
  const [areaList, setAreaList] = useState<any[]>([])
  const [listData, setListData] = useState<any[]>([
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
    {
      partTimeDate: '1',
      partTimePlanList: [
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
        { planStatus: 10 },
      ],
    },
  ])
  useDidShow(() => {
    if (token) {
      init()
    }
  })
  useEffect(() => {
    if (token) {
      init()
    }
  }, [token])
  const isHide = useMemo(() => {
    let data = []
    for (let index = 0; index < listData.length; index++) {
      const element = listData[index]
      data = data.concat(...element.partTimePlanList)
    }
    if (data.some((item) => item.planStatus === 20)) {
      props.onIsHideChange(true)
      return true
    } else {
      props.onIsHideChange(false)
      return false
    }
  }, listData)
  const init = () => {
    listAllPartTimeShift({}).then((data2) => {
      const now = dayjs()
      const monday = now.startOf('week').add(1, 'day').format('YYYY-MM-DD')
      const sunday = now.endOf('week').add(1, 'day').format('YYYY-MM-DD')
      listCurrentHelperPartTimePlan({
        partTimeStartDate: monday,
        partTimeEndDate: sunday,
      }).then((data) => {
        if (!data) {
          data = new Array(7).fill({
            partTimeDate: '2023-01-01',
            partTimePlanList: new Array(4).fill({ planStatus: 10 }),
          })
        }
        setListData(data)
      })
      setAreaList(data2)
    })
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
  const signUp = async () => {
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
      <View className='plan-wrap' onClick={signUp}>
        <View className='date-title'>
          <View className='date-title-left'></View>
          <View className='date-title-right'>
            <View className='date-week'>
              {weekList.map((item) => (
                <View key={item} className='date-week-item'>
                  {item}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className='plan-content'>
          <View className='plan-content-left'>
            {areaList?.map((item) => (
              <View key={item.shiftName} className='area-item'>
                <View className='area-item-text'>{item.shiftName}</View>
              </View>
            ))}
          </View>
          <View className='plan-content-right'>
            {listData?.map((item, index) => (
              <View key={index} className='plan-item'>
                {item?.partTimePlanList?.map((item2, index2) => (
                  <View
                    key={index2}
                    className={classNames('plan-item-unit', {
                      active: item2.planStatus === 20,
                    })}
                  ></View>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View
          className={classNames('no-plan', {
            hide: isHide,
          })}
        >
          <View>您还未填写本周的可兼职时间，</View>
          <View>填写后系统将为您推荐任务</View>
        </View>
      </View>
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
