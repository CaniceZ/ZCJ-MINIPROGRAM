import { View } from '@tarojs/components'
import { navigateTo, usePullDownRefresh, stopPullDownRefresh, useDidShow } from '@tarojs/taro'
import { useCallback } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import { pageHelperSettlement } from '@/api/settlement'
import usePage from '@/hooks/usePage'
import NoData from '@/components/NoData'
import './index.less'

export default () => {
  const { lists, fetchData } = usePage(pageHelperSettlement, {
    limit: 10,
  })
  usePullDownRefresh(() => {
    fetchData({})
    stopPullDownRefresh()
  })
  useDidShow(() => {
    fetchData({})
  })
  const goDetail = useCallback((helperTaskCode) => {
    navigateTo({
      url: `/subpackages/task/orderdetail/index?helperTaskCode=${helperTaskCode}`,
    })
  }, [])
  return (
    <>
      {lists.length > 0 ? (
        lists.map((item: any) => (
          <View className='order-item' key={item.helperTaskCode}>
            <View className='order-code'>
              <View className='w145'>任务ID：</View>
              <View>{item.helperTaskCode}</View>
            </View>
            <View className='order-content'>
              <View className='order-conten-item'>
                <View className='w145'>服务商家：</View>
                <View className='order-conten-item-value'>{item.merchantName}</View>
              </View>
              <View className='order-conten-item'>
                <View className='w145'>服务时间：</View>
                <View className='order-conten-item-value'>
                  {item.serviceStartDate?.split(' ')[0]} 至 {item.serviceEndDate?.split(' ')[0]}
                </View>
              </View>
              <View className='order-conten-item'>
                <View className='w145'>服务天数：</View>
                <View className='order-conten-item-value'>{item.workDays}</View>
              </View>
              <View className='order-conten-item'>
                <View className='w145'>总工时：</View>
                <View className='order-conten-item-value'>{item.totalWorkNum}小时</View>
              </View>
              <View className='order-conten-item'>
                <View className='w145'>时薪：</View>
                <View className='order-conten-item-value'>¥{item.helperPrice}</View>
              </View>
            </View>
            <View className='order-bottom'>
              <View className='order-bottom-top'>
                <View className='order-total'>
                  <View>已收入</View>
                  <View className='order-total-num'>¥</View>
                  <View className='order-total-num fw'>{item.receivedAmount}</View>
                </View>
                <View className='color-grey-1'>预计收入：¥{item.helperAmount}</View>
              </View>
              <Button
                type='primary'
                className='foot-btn'
                onClick={() => {
                  goDetail(item.helperTaskCode)
                }}
              >
                收益明细
              </Button>
            </View>
          </View>
        ))
      ) : (
        <NoData></NoData>
      )}
    </>
  )
}
