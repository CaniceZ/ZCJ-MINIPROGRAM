import { View, Image, ScrollView } from '@tarojs/components'
import { useEffect, useState } from 'react'
import location from '@/utils/location'
import TaskCell from '@/components/TaskCell'
import QrcodePopup from '@/components/QrcodePopup'
import usePage from '@/hooks/usePage'
import SafeArea from '@/package/components/safe-area'
import useSafeBottom from '@/package/hooks/useSafeBottom'
import { usePullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'
import homeTitleImg from '@/assets/imgs/home-title-img.png'
import TaskItem from '../../components/TaskItem'
import classNames from 'classnames'
import fuwuyuan from '@/assets/icon/fuwuyuan.png'
import fuwuyuanselect from '@/assets/icon/fuwuyuan-select.png'
import chuancai from '@/assets/icon/chuancai.png'
import chuancaiselect from '@/assets/icon/chuancai-select.png'
import xiwangong from '@/assets/icon/xiwan.png'
import xiwangongselect from '@/assets/icon/xiwan-select.png'
import zike from '@/assets/icon/zike.png'
import zikeselect from '@/assets/icon/zike-select.png'
import dabaoyuan from '@/assets/icon/dabaoyuan.png'
import dabaoyuanselect from '@/assets/icon/dabaoyuan-select.png'

import './index.less'
import { Icon } from '@nutui/nutui-react-taro'

const data = Array(63)
  .fill({})
  .map((item) => {
    return {
      id: Math.random() * 100,
    }
  })
const fetcher2 = async (params) => {
  // console.log('params', params)
  const { page, limit } = params
  let arr = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.slice((page - 1) * limit, page * limit))
    }, 1000)
  })
  return { succeed: true, data: arr, total: 111 }
}

export default () => {
  const [quotationStatus] = useState([
    { value: '2', label: '服务员', url: fuwuyuan, activeurl: fuwuyuanselect },
    { value: '4', label: '传菜', url: chuancai, activeurl: chuancaiselect },
    { value: '1', label: '洗碗', url: xiwangong, activeurl: xiwangongselect },
    { value: '3', label: '咨客', url: zike, activeurl: zikeselect },
    { value: '5', label: '打包员', url: dabaoyuan, activeurl: dabaoyuanselect },
  ])
  const { safeBottom } = useSafeBottom()
  // 公众号二维码
  const [isShow, setIsShow] = useState(false)
  type City = {
    type?: Number
    name: String
    level?: Number
    parentCode?: Number
    childAreas?: Array<City>
  }
  // 当前城市
  const [initCity, setInitCity] = useState<City>()
  // 打开定位
  const openSetting = () => {
    if (!initCity) {
      location.getOpenSetting()
    }
  }
  // 工作类型
  const { lists, fetchData } = usePage(fetcher2, { limit: 20 })
  usePullDownRefresh(() => {
    console.log('onPullDownRefresh')
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
      fetchData(handleApi({ initCity: { name: res.address_component.city } }))
    })
    stopPullDownRefresh()
  })
  const taskinfo = {
    merchantName: '网鱼电竞酒店',
    merchantTaskStatus: 10,
    merchantTaskStatusName: '待开始',
    serviceStartDate: '2023-03-16',
    serviceEndDate: '2023-03-17',
    shiftStartTime: '09:00',
    shiftEndTime: '18:00',
    daogangshijian: '8:30',
    zonggongshi: 10,
    personNum: 5,
    workNum: 4,
    workDays: 2,
    jobTypeName: '服务员',
  }

  useEffect(() => {
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
      fetchData(handleApi({ initCity: { name: res.address_component.city } }))
    })
  }, [])
  // 工种类型修改
  const [jobType, setType] = useState('2')
  const selectType = (item) => {
    setType(item.value)
    fetchData(handleApi({ jobType: item.value })) // 改动的字段
  }
  // 解决setstate异步问题，获取最新的值
  const handleApi = (changeParams = {}) => {
    const queryData = {
      jobType,
      initCity,
      ...changeParams,
    }
    return queryData
  }
  return (
    <>
      <SafeArea
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          zIndex: '10001',
          minHeight: '60px',
        }}
        isNavigationBar
        location='top'
        position='sticky'
      >
        <View className='home-title-wrap'>
          <Image className='home-title-image' mode='aspectFit' src={homeTitleImg}></Image>
        </View>
        <View
          className='home-cityname'
          onClick={() => {
            openSetting()
          }}
        >
          <Icon size='14px' color='#0C0C0D' name='locationg3'></Icon>
          {initCity ? initCity.name : '打开定位'}
        </View>
      </SafeArea>
      <View className='home-wrap'>
        <View className='mb30'>
          <TaskCell {...taskinfo}></TaskCell>
        </View>
        <ScrollView scrollX className='type-wrap'>
          <View className='type-scroll'>
            {quotationStatus.map((item) => (
              <View
                className={classNames('type-item', {
                  'type-item-active': item.value == jobType,
                })}
                key={item.value}
                onClick={() => {
                  selectType(item)
                }}
              >
                <Image
                  className='type-item-image'
                  mode='aspectFit'
                  src={item.value == jobType ? item.activeurl : item.url}
                ></Image>
                <View className='type-item-text'>{item.label}</View>
              </View>
            ))}
          </View>
        </ScrollView>
        {lists.map((_, index) => (
          <TaskItem key={index} index={index}></TaskItem>
        ))}
        <View style={{ height: safeBottom + 48 + 'px' }}></View>
      </View>
      {/* 公众号二维码 */}
      <QrcodePopup
        isNavigationBar
        visible={isShow}
        type='gzh'
        onClose={() => {
          setIsShow(false)
        }}
      ></QrcodePopup>
    </>
  )
}
