import { View, Image, ScrollView } from '@tarojs/components'
import { useMemo, useRef, useState } from 'react'
import location from '@/utils/location'
import TaskCell from '@/components/TaskCell'
import usePage from '@/hooks/usePage'
import SafeArea from '@/package/components/safe-area'
import useSafeBottom from '@/package/hooks/useSafeBottom'
import {
  usePullDownRefresh,
  stopPullDownRefresh,
  useDidShow,
  useShareAppMessage,
  showLoading,
  hideLoading,
  useReachBottom,
} from '@tarojs/taro'
import { getTodoTaskNum, pageMerchantTask, indexRecommend } from '@/api/task'
import { listBanner, listJobType } from '@/api/sys'
import { getTodoTask, updateHelperLocation } from '@/api/info'
import { setDotVisible } from '@/store/tabbar'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Icon, Swiper, SwiperItem } from '@nutui/nutui-react-taro'
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
import NoData from '@/components/NoData'
import useUpdateEffect from '@/hooks/useUpdateEffect'
import TaskItem from '../../components/TaskItem'
import './index.less'
import Plan from './components/Plan'

type StatusMap = {
  dictCode: string
  dictName: string
  url: string | undefined
  activeurl: string | undefined
}
const urlMap = [
  { jobType: '-10086', jobTypeName: '推荐任务', url: fuwuyuan, activeurl: fuwuyuanselect },
  { jobType: '1', jobTypeName: '服务员', url: fuwuyuan, activeurl: fuwuyuanselect },
  { jobType: '3', jobTypeName: '传菜', url: chuancai, activeurl: chuancaiselect },
  { jobType: '5', jobTypeName: '洗碗', url: xiwangong, activeurl: xiwangongselect },
  { jobType: '4', jobTypeName: '咨客', url: zike, activeurl: zikeselect },
  { jobType: '2', jobTypeName: '打包员', url: dabaoyuan, activeurl: dabaoyuanselect },
]
const homeTab = [
  {
    type: 1,
    text: '工作计划',
  },
  {
    type: 2,
    text: '活动',
  },
]
export default () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)
  const [quotationStatus, setQuotationStatus] = useState<StatusMap[]>([])
  const { safeBottom } = useSafeBottom()
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
  // banner
  const [bannerList, setBannerList] = useState<string[]>([])
  // 是否为推荐
  const isTuijian = useRef(false)
  // 首页列表数据
  const { lists, fetchData, getData } = usePage(pageMerchantTask, {
    limit: 10,
    noUseReachBottom: true,
  })
  // 推荐任务列表数据
  const {
    lists: lists2,
    fetchData: fetchData2,
    getData: getData2,
  } = usePage(indexRecommend, {
    limit: 10,
    noUseReachBottom: true,
  })
  // 调用哪个分页
  const finalFetchData = (params) => {
    if (isTuijian.current) {
      fetchData2({ ...params })
    } else {
      fetchData({ ...params })
    }
  }
  useReachBottom(() => {
    if (isTuijian.current) {
      getData2()
    } else {
      getData()
    }
  })
  usePullDownRefresh(() => {
    console.log('onPullDownRefresh')
    showLoading({
      title: '正在更新定位...',
    })
    location
      .getMap()
      .then((res) => {
        setInitCity({ name: res.address_component.city })
        finalFetchData(handleApi({ city: res.address_component.city }))
      })
      .catch(() => {
        finalFetchData(handleApi())
      })
      .finally(() => {
        hideLoading()
        stopPullDownRefresh()
      })
  })
  const [taskinfo, setTaskInfo] = useState<Partial<InfoType>>({})
  useUpdateEffect(() => {
    if (token) {
      getTodoTaskNum({}).then((res) => {
        if (res > 1) {
          dispatch(setDotVisible(true))
        }
      })
    }
    listJobType({}).then((data) => {
      data.unshift({ dictCode: '-10086', dictName: '推荐任务' })
      data.forEach((item) => {
        item.url = urlMap.find((item2) => item2.jobType === item.dictCode)?.url
        item.activeurl = urlMap.find((item2) => item2.jobType === item.dictCode)?.activeurl
      })
      setQuotationStatus(data)
    })
    listBanner({}).then((banner) => {
      setBannerList(banner?.picList?.map((item) => item.url))
    })
    location
      .getMap()
      .then((res) => {
        setInitCity({ name: res.address_component.city })
        finalFetchData(handleApi({ city: res.address_component.city }))
        updateHelperLocation({
          latitude: res.location.lat,
          locatedAddress: res.address,
          locatedCity: res.address_component.city,
          locatedDistrict: res.address_component.district,
          locatedProvince: res.address_component.province,
          locatedStreet: res.address_component.street,
          longitude: res.location.lng,
        })
      })
      .catch(() => {
        finalFetchData(handleApi())
      })
  }, [token])
  useDidShow(() => {
    if (storage.get('token')) {
      getTodoTask({}).then((data) => {
        if (data) {
          setTaskInfo(data)
        } else {
          setTaskInfo({})
        }
      })
    } else {
      setTimeout(() => {
        getTodoTask({}).then((data) => {
          if (data) {
            setTaskInfo(data)
          } else {
            setTaskInfo({})
          }
        })
      }, 1000)
    }
  })
  // 工种类型修改
  const [jobType, setType] = useState('1')
  const selectType = (item) => {
    setType(item.dictCode)
    if (item.dictCode === '-10086') {
      isTuijian.current = true
    } else {
      isTuijian.current = false
    }
    finalFetchData(handleApi({ jobType: item.dictCode }))
  }
  // 解决setstate异步问题，获取最新的值
  const handleApi = (changeParams = {}) => {
    const queryData = {
      jobType,
      city: initCity?.name,
      ...changeParams,
      latitude: storage.get('localAddress')?.latitude,
      longitude: storage.get('localAddress')?.longitude,
      helperCode: storage.get('helperCode'),
    }
    return queryData
  }
  // 当前tab
  const [tabVal, setTabVal] = useState(1)
  useShareAppMessage(() => {
    return {
      title: '找餐饮好活就上百城用工，有保障才安全',
      imageUrl: 'http://bg1.51ptj.com/bg-share.png',
    }
  })
  // 是否已经填写
  const [isFillOut, setIsFillOut] = useState(false)
  // 是否填写了兼职计划
  const handleIsHideChange = (val) => {
    setIsFillOut(val)
  }
  // 当前列表
  const finalList = useMemo(() => {
    if (jobType === '-10086') {
      return lists2
    } else {
      return lists
    }
  }, [jobType, lists, lists2])
  // 无数据文案
  const noDataText = useMemo(() => {
    if (jobType === '-10086') {
      if (isFillOut) {
        return '抱歉!目前没有符合您兼职时间的任务，可能需要多等一会儿。如果着急，可以调整接单时间或者去首页逛逛其他订单。'
      } else {
        return '填写本周可兼职时间才会显示噢~'
      }
    } else {
      return '暂无商家发布任务，请耐心等待'
    }
  }, [jobType, isFillOut])
  return (
    <>
      <SafeArea
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          zIndex: '10001',
          minHeight: '140rpx',
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
        <View className='home-tab'>
          {homeTab.map((item) => (
            <View
              key={item.type}
              onClick={() => {
                setTabVal(item.type)
              }}
              className={classNames('home-tab-item', {
                'home-tab-item-active': item.type === tabVal,
              })}
            >
              {item.text}
            </View>
          ))}
        </View>
        {/* 工作计划 */}
        {tabVal === 1 && <Plan onIsHideChange={handleIsHideChange}></Plan>}
        {/* 轮播图 */}
        {tabVal === 2 && bannerList.length > 0 && (
          <View className='index-swiper mb30'>
            <Swiper
              height='114'
              width='342'
              isCenter
              paginationColor='#4D8FFF'
              autoPlay='3000'
              initPage={0}
              paginationVisible
            >
              {bannerList.map((item) => {
                return (
                  <SwiperItem key={item}>
                    <Image className='swiper-img' mode='aspectFill' src={item} />
                  </SwiperItem>
                )
              })}
            </Swiper>
          </View>
        )}
        {taskinfo.merchantCode && (
          <View className='mb30'>
            <TaskCell {...taskinfo}></TaskCell>
          </View>
        )}
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
        {finalList.length > 0 ? (
          finalList.map((item) => <TaskItem key={item.merchantTaskCode} {...item}></TaskItem>)
        ) : (
          <NoData text={noDataText}></NoData>
        )}
        <View style={{ height: safeBottom + 48 + 'px' }}></View>
      </View>
    </>
  )
}
