import { View, Image, ScrollView } from '@tarojs/components'
import { useEffect, useState } from 'react'
import location from '@/utils/location'
import TaskCell from '@/components/TaskCell'
import QrcodePopup from '@/components/QrcodePopup'
import usePage from '@/hooks/usePage'
import SafeArea from '@/package/components/safe-area'
import useSafeBottom from '@/package/hooks/useSafeBottom'
import { usePullDownRefresh, stopPullDownRefresh, useDidShow } from '@tarojs/taro'
import { pageMerchantTask } from '@/api/task'
import { listJobType } from '@/api/sys'
import { getTodoTask } from '@/api/info'
import { Icon } from '@nutui/nutui-react-taro'
import homeTitleImg from '@/assets/imgs/home-title-img.png'
import classNames from 'classnames'
import storage from '@/utils/storage'
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
import TaskItem from '../../components/TaskItem'
import './index.less'

type StatusMap = {
  dictCode: string
  dictName: string
  url: string | undefined
  activeurl: string | undefined
}
const urlMap = [
  { jobType: '1', jobTypeName: '服务员', url: fuwuyuan, activeurl: fuwuyuanselect },
  { jobType: '3', jobTypeName: '传菜', url: chuancai, activeurl: chuancaiselect },
  { jobType: '5', jobTypeName: '洗碗', url: xiwangong, activeurl: xiwangongselect },
  { jobType: '4', jobTypeName: '咨客', url: zike, activeurl: zikeselect },
  { jobType: '2', jobTypeName: '打包员', url: dabaoyuan, activeurl: dabaoyuanselect },
]

export default () => {
  const [quotationStatus, setQuotationStatus] = useState<StatusMap[]>([])
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
  type InfoType = {
    merchantCode: string
    merchantName: string
    merchantTaskCode: string
    merchantTaskStatus: number
    merchantTaskStatusName: string
    serviceEndDate: string
    serviceStartDate: string
    servicedDay: number
    totalWorkNum: number
    workDays: number
    workNum: number
    workPrice: number
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
  const { lists, fetchData } = usePage(pageMerchantTask, { limit: 10 })
  usePullDownRefresh(() => {
    console.log('onPullDownRefresh')
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
      fetchData(handleApi({ initCity: { name: res.address_component.city } }))
    })
    stopPullDownRefresh()
  })
  const [taskinfo, setTaskInfo] = useState<Partial<InfoType>>({})
  useEffect(() => {
    listJobType({}).then((data) => {
      data.forEach((item) => {
        item.url = urlMap.find((item2) => item2.jobType === item.dictCode)?.url
        item.activeurl = urlMap.find((item2) => item2.jobType === item.dictCode)?.activeurl
      })
      setQuotationStatus(data)
    })
  }, [])
  useDidShow(() => {
    if (storage.get('token')) {
      location.getMap().then((res) => {
        setInitCity({ name: res.address_component.city })
        fetchData(handleApi({ city: res.address_component.city }))
      })
      getTodoTask({}).then((data) => {
        if (data) {
          setTaskInfo(data)
        }
      })
    } else {
      setTimeout(() => {
        location.getMap().then((res) => {
          setInitCity({ name: res.address_component.city })
          fetchData(handleApi({ city: res.address_component.city }))
        })
        getTodoTask({})
      }, 1000)
    }
  })
  // 工种类型修改
  const [jobType, setType] = useState('1')
  const selectType = (item) => {
    setType(item.dictCode)
    fetchData(handleApi({ jobType: item.value })) // 改动的字段
  }
  // 解决setstate异步问题，获取最新的值
  const handleApi = (changeParams = {}) => {
    const queryData = {
      jobType,
      city: initCity?.name,
      ...changeParams,
      latitude: storage.get('localAddress')?.latitude,
      longitude: storage.get('localAddress')?.longitude,
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
                  'type-item-active': item.dictCode == jobType,
                })}
                key={item.dictCode}
                onClick={() => {
                  selectType(item)
                }}
              >
                <Image
                  className='type-item-image'
                  mode='aspectFit'
                  src={item.dictCode == jobType ? item.activeurl : item.url}
                ></Image>
                <View className='type-item-text'>{item.dictName}</View>
              </View>
            ))}
          </View>
        </ScrollView>
        {lists.map((item) => (
          <TaskItem key={item.merchantTaskCode} {...item}></TaskItem>
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
