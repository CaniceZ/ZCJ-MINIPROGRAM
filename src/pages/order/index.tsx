import { View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { useCallback } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import './index.less'

export default () => {
  const listData = [
    {
      helperSettlementCode: 'ST202303220001',
      merchantName: '大鸽饭（棠下店）',
      payDate: '2023-03-16 至 2023-03',
      workDays: 2,
      settlementTotalNum: 20,
      workPrice: '18',
      settlementAmount: '121.00',
      helperAmount: '388',
    },
    {
      helperSettlementCode: 'ST202303220002',
      merchantName: '大鸽饭（棠下店）',
      payDate: '2023-03-16 至 2023-03',
      workDays: 2,
      settlementTotalNum: 20,
      workPrice: '18',
      settlementAmount: '121.00',
      helperAmount: '388',
    },
    {
      helperSettlementCode: 'ST202303220003',
      merchantName: '大鸽饭（棠下店）',
      payDate: '2023-03-16 至 2023-03',
      workDays: 2,
      settlementTotalNum: 20,
      workPrice: '18',
      settlementAmount: '121.00',
      helperAmount: '388',
    },
  ]
  const goDetail = useCallback((helperSettlementCode) => {
    console.log(helperSettlementCode)
    navigateTo({
      url: `/subpackages/task/orderdetail/index?helperSettlementCode=${helperSettlementCode}`,
    })
  }, [])
  return (
    <>
      {listData.map((item) => (
        <View className='order-item' key={item.helperSettlementCode}>
          <View className='order-code'>
            <View className='w145'>任务ID：</View>
            <View>{item.helperSettlementCode}</View>
          </View>
          <View className='order-content'>
            <View className='order-conten-item'>
              <View className='w145'>服务商家：</View>
              <View className='order-conten-item-value'>{item.merchantName}</View>
            </View>
            <View className='order-conten-item'>
              <View className='w145'>服务时间：</View>
              <View className='order-conten-item-value'>{item.payDate}</View>
            </View>
            <View className='order-conten-item'>
              <View className='w145'>服务天数：</View>
              <View className='order-conten-item-value'>{item.workDays}</View>
            </View>
            <View className='order-conten-item'>
              <View className='w145'>总工时：</View>
              <View className='order-conten-item-value'>{item.settlementTotalNum}小时</View>
            </View>
            <View className='order-conten-item'>
              <View className='w145'>时薪：</View>
              <View className='order-conten-item-value'>{item.workPrice}</View>
            </View>
          </View>
          <View className='order-bottom'>
            <View className='order-bottom-top'>
              <View className='order-total'>
                <View>已收入</View>
                <View className='order-total-num'>¥</View>
                <View className='order-total-num fw'>{item.settlementAmount}</View>
              </View>
              <View className='color-grey-1'>预计收入：¥388</View>
            </View>
            <Button
              type='primary'
              className='foot-btn'
              onClick={() => {
                goDetail(item.helperSettlementCode)
              }}
            >
              收益明细
            </Button>
          </View>
        </View>
      ))}
    </>
  )
}
