import { Button } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { switchTab, useRouter } from '@tarojs/taro'
import classNames from 'classnames'
import { getHelperSettlementDetail } from '@/api/settlement'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'

import './index.less'

export default () => {
  const {
    params: { helperTaskCode },
  } = useRouter()
  const [info, setInfo] = useState<any>({})
  const dispatch = useAppDispatch()
  const back = () => {
    switchTab({ url: '/pages/order/index' })
    dispatch(setActiveVisible(2))
  }
  useEffect(() => {
    getHelperSettlementDetail({
      helperTaskCode,
    }).then((res) => {
      setInfo(res)
    })
  }, [helperTaskCode])
  return (
    <>
      <View className='common-title'>任务信息</View>
      <View className='order-code bg-white'>
        <View>任务ID：</View>
        <View>{info.helperTaskCode}</View>
      </View>
      <View className='order-content bg-white'>
        <View className='order-conten-item'>
          <View>服务商家</View>
          <View className='order-conten-item-value'>{info.merchantName}</View>
        </View>
        <View className='order-conten-item'>
          <View>服务时间</View>
          <View className='order-conten-item-value'>
            {info.serviceStartDate?.split(' ')[0]} 至 {info.serviceEndDate?.split(' ')[0]}
          </View>
        </View>
        <View className='order-conten-item'>
          <View>服务天数</View>
          <View className='order-conten-item-value'>{info.workDays}天</View>
        </View>
        <View className='order-conten-item'>
          <View>预计总工时</View>
          <View className='order-conten-item-value'>{info.workDays * info.workNum}</View>
        </View>
        <View className='order-conten-item'>
          <View>时薪</View>
          <View className='order-conten-item-value'>¥{info.helperPrice}/时</View>
        </View>
        <View className='order-conten-item'>
          <View>车补</View>
          <View className='order-conten-item-value'>¥{info.travelAllowance}/人/天</View>
        </View>
        <View className='order-conten-item'>
          <View>餐补</View>
          <View className='order-conten-item-value'>¥{info.mealAllowance}/人/天</View>
        </View>
      </View>
      {info.helperSettlementList?.length > 0 && (
        <>
          <View className='common-title'>收益明细</View>
          <View className='fw-content bg-white'>
            {info.helperSettlementList?.map((item) => (
              <View className='sy-wrap' key={item.id}>
                <View className='sy-left'>
                  <View className='fw-title'>
                    <View>日期</View>
                    <View>时薪</View>
                    <View>工时</View>
                    <View>餐/车补贴</View>
                  </View>
                  <View className='fw-value'>
                    <View>{item.serviceDate.split(' ')[0]}</View>
                    <View>￥{item.helperPrice}</View>
                    <View>{item.settlementNum}</View>
                    <View>
                      ￥{item.mealAllowance || 0}/{item.travelAllowance || 0}
                    </View>
                  </View>
                </View>
                <View className='sy-right'>
                  <View
                    className={classNames('sy-right-top', {
                      'no-receive': item.helperSettlementStatus == 10,
                    })}
                  >
                    <View className='fs24'>¥</View>
                    <View className='amount'>{item.helperSettlementAmount}</View>
                  </View>
                  <View className='sy-right-normal'>{item.helperSettlementStatusName}</View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
      <View className='fw-content fw-last bg-white'>
        <View>已收入</View>
        <View className='fs24'>¥</View>
        <View className='amount'>{info.receivedAmount}</View>
      </View>
      <View className='bg-bottom'>
        <View className='bg-bottom-btn'>
          <Button block plain type='primary' size='large' className='foot-btn' onClick={back}>
            返回收益列表
          </Button>
        </View>
      </View>
    </>
  )
}
