import { Button } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { navigateBack, useRouter } from '@tarojs/taro'
import classNames from 'classnames'
// import { getMerchantSettlementDetail } from '@/api/merchant'
import { useEffect } from 'react'

import './index.less'

export default () => {
  const {
    params: { helperSettlementCode },
  } = useRouter()
  const info = {
    helperSettlementCode: 'ST202303220001',
    id: '87878798797',
    merchantName: '大鸽饭（棠下店）',
    payDate: '2023-03-16 至 2023-03-17',
    settlementPersonNum: 2,
    settlementTotalNum: 20,
    createTime: '2023-03-16 22:41:22',
    settlementAmount: '121.00',
    aaa: [{ id: 1 }, { id: 2 }],
  }
  const back = () => {
    navigateBack()
  }
  useEffect(() => {
    // getMerchantSettlementDetail({ merchantSettlementCode }).then((res) => {
    //   console.log(11)
    // })
  }, [])
  return (
    <>
      <View className='common-title'>任务信息</View>
      <View className='order-code bg-white'>
        <View>任务ID：</View>
        <View>{info.helperSettlementCode}</View>
      </View>
      <View className='order-content bg-white'>
        <View className='order-conten-item'>
          <View>服务商家</View>
          <View className='order-conten-item-value'>{info.merchantName}</View>
        </View>
        <View className='order-conten-item'>
          <View>服务时间</View>
          <View className='order-conten-item-value'>{info.payDate}</View>
        </View>
        <View className='order-conten-item'>
          <View>服务天数</View>
          <View className='order-conten-item-value'>3天</View>
        </View>
        <View className='order-conten-item'>
          <View>预计工时</View>
          <View className='order-conten-item-value'>20</View>
        </View>
        <View className='order-conten-item'>
          <View>时薪</View>
          <View className='order-conten-item-value'>¥40/时</View>
        </View>
        <View className='order-conten-item'>
          <View>车补</View>
          <View className='order-conten-item-value'>¥20/人/天</View>
        </View>
        <View className='order-conten-item'>
          <View>餐补</View>
          <View className='order-conten-item-value'>¥20/人/天</View>
        </View>
      </View>
      <View className='common-title'>收益明细</View>
      <View className='fw-content bg-white'>
        {info.aaa.map((item) => (
          <View className='sy-wrap' key={item.id}>
            <View className='sy-left'>
              <View className='fw-title'>
                <View>日期</View>
                <View>时薪</View>
                <View>工时</View>
                <View>餐/车补贴</View>
              </View>
              <View className='fw-value'>
                <View>2023-03-22</View>
                <View>￥25</View>
                <View>5</View>
                <View>￥10/0</View>
              </View>
            </View>
            <View className='sy-right'>
              <View
                className={classNames('sy-right-top', {
                  'no-receive': item.id == 2,
                })}
              >
                <View className='fs24'>¥</View>
                <View className='amount'>116.39</View>
              </View>
              <View className='sy-right-normal'>已收款</View>
            </View>
          </View>
        ))}
      </View>
      <View className='fw-content fw-last bg-white'>
        <View>已收入</View>
        <View className='fs24'>¥</View>
        <View className='amount'>{info.settlementAmount}</View>
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
