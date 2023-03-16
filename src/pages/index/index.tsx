import { View } from '@tarojs/components'
import { useCallback, useEffect, useState, useMemo } from 'react'
import location from '@/utils/location'
import TaskCell from '@/components/TaskCell'
import QrcodePopup from '@/components/QrcodePopup'
import usePage from '@/hooks/usePage'
import SafeArea from '@/package/components/safe-area'
import useSafeBottom from '@/package/hooks/useSafeBottom'
import { usePullDownRefresh, stopPullDownRefresh } from '@tarojs/taro'

import RealName from './components/RealName'
import TaskItem from '../../components/TaskItem'
import Header from './components/Header'
import ListType from './components/ListType'
import Recommend from './components/Recommend'

import './index.less'
// import { getLocation, openLocation, chooseLocation } from '@tarojs/taro'
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
  const listData = Array(20).fill({})
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
  // 酒店名称
  const [hotelName, setHotName] = useState('')
  // 当前城市
  const [initCity, setInitCity] = useState<City>()
  // 工作类型
  const [type, setType] = useState(1)
  const { lists, fetchData } = usePage(fetcher2, { limit: 20 })
  usePullDownRefresh(() => {
    console.log('onPullDownRefresh')
    setHotName('')
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
      fetchData(handleApi({ initCity: { name: res.address_component.city } }))
    })
    stopPullDownRefresh()
  })
  useEffect(() => {
    // getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     const speed = res.speed
    //     const accuracy = res.accuracy
    //     console.log(latitude, longitude, speed, accuracy)
    //     openLocation({
    //       latitude
    //       longitude
    //       scale: 18,
    //     })
    //   },
    // })
    // getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     const speed = res.speed
    //     const accuracy = res.accuracy
    //     console.log(latitude, longitude, speed, accuracy)
    //     chooseLocation({
    //       latitude,
    //       longitude,
    //       success: function (res) {
    //         console.log(res)
    //       },
    //       fail: function () {},
    //       complete: function () {},
    //     })
    //   },
    // })
  }, [])
  useEffect(() => {
    setIsShow(true)
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
      fetchData(handleApi({ initCity: { name: res.address_component.city } }))
    })
  }, [])
  // 点击搜索
  const handleSearch = () => {
    fetchData(handleApi())
  }
  // 切换城市回调
  const handleSetCity = (params) => {
    setInitCity(params)
    fetchData(handleApi({ initCity: params }))
  }
  // 工种类型修改
  const onTypeChange = (params) => {
    setType(params)
    fetchData(handleApi({ type: params })) // 改动的字段
  }
  // 重新设置定位为当前位置
  const setLocal = useCallback(() => {
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
      fetchData(handleApi({ initCity: { name: res.address_component.city } }))
    })
  }, [])

  // 解决setstate异步问题，获取最新的值
  const handleApi = (changeParams = {}) => {
    const queryData = {
      hotelName,
      type,
      initCity,
      ...changeParams,
    }
    return queryData
    // console.log(queryData)
  }
  // 去接单弹窗
  const [recommendShow, setRecommendShow] = useState(false)
  const recommendList = useMemo(() => (listData.length > 0 ? listData.slice(0, 7) : []), [listData])
  return (
    <View>
      {/* <NavBar></NavBar> */}
      <SafeArea
        style={{
          background: '-webkit-linear-gradient(top, #e7d3b5, #efe7da)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '10001',
        }}
        isNavigationBar
        location='top'
        position='sticky'
      >
        百城用工
      </SafeArea>

      <Header
        handleSearch={handleSearch}
        setHotName={(value) => setHotName(value)}
        handleSetCity={handleSetCity}
        initCity={initCity}
        hotelName={hotelName}
        setLocal={setLocal}
      ></Header>
      <RealName
        show={() => {
          setRecommendShow(true)
        }}
      ></RealName>
      <View style='margin: 10px'>
        <TaskCell></TaskCell>
      </View>
      <ListType value={type} onChange={onTypeChange}></ListType>
      {lists.map((_, index) => (
        <TaskItem key={index} index={index}></TaskItem>
      ))}
      <View style={{ height: safeBottom + 48 + 'px' }}></View>
      <Recommend
        visible={recommendShow}
        list={recommendList}
        onClose={() => {
          setRecommendShow(false)
        }}
      ></Recommend>
      {/* 联系人二维码 */}
      <QrcodePopup
        isNavigationBar
        visible={isShow}
        type='wx'
        onClose={() => {
          setIsShow(false)
        }}
      ></QrcodePopup>
    </View>
  )
}
