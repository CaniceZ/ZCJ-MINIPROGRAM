import { View } from '@tarojs/components'
import { ListView } from '@/package'
import { useCallback, useEffect, useState, useMemo } from 'react'
import location from '@/utils/location'
import TaskCell from '@/components/TaskCell'
import RealName from './components/RealName'
import TaskItem from '../../components/TaskItem'
import NavBar from './components/NavBar'
import Header from './components/Header'
import ListType from './components/ListType'

import './index.less'
// import {getLocation, openLocation} from '@tarojs/taro'

const data = Array(100).fill({})

const fetcher = async (params) => {
  console.log('params', params)
  const { page, limit } = params
  let arr = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.slice((page - 1) * limit, page * limit))
    }, 1000)
  })
  console.log('arr', arr)
  return { list: arr, total: 111 }
}

export default () => {
  const { listData, listViewProps } = ListView.useListView(fetcher as any, {
    limit: 50,
  })
  type City = {
    type?: Number
    name: String
    level?: Number
    parentCode?: Number
    childAreas?: Array<City>
  }
  // 酒店名称
  const [hotelName, setHotName] = useState()
  // 当前城市
  const [initCity, setInitCity] = useState<City>()
  // useEffect(() => {
  //   getLocation({
  //     type: 'gcj02',
  //     success: function (res) {
  //       const latitude = res.latitude
  //       const longitude = res.longitude
  //       const speed = res.speed
  //       const accuracy = res.accuracy
  //       console.log(latitude, longitude, speed, accuracy)
  //       openLocation({
  //         latitude,
  //         longitude,
  //         scale: 18,
  //       })
  //     },
  //   })
  // }, [])
  useEffect(() => {
    console.log(1)
    location.getMap().then((res) => {
      console.log(res, 10086)
      setInitCity({ name: res.address_component.city })
    })
    // console.log(a)
  }, [])
  // 点击搜索
  const handleSearch = useCallback((params) => {
    setHotName(params)
    console.log(hotelName)
  }, [])
  // 切换城市回调
  const handleSetCity = useCallback((params) => {
    setInitCity(params)
    console.log(initCity)
  }, [])
  // 工作类型
  const [type, setType] = useState()
  const onTypeChange = useCallback((params) => {
    setType(params)
    console.log(params)
  }, [])
  return (
    <View>
      <NavBar></NavBar>
      {useMemo(() => {
        return (
          <Header
            handleSearch={handleSearch}
            handleSetCity={handleSetCity}
            initCity={initCity}
          ></Header>
        )
      }, [initCity])}
      <RealName></RealName>
      <View style='margin: 10px'>
        <TaskCell></TaskCell>
      </View>
      <ListType value={type} onChange={onTypeChange}></ListType>
      <ListView {...listViewProps}>
        {listData.map((_, index) => (
          <TaskItem key={index} index={index}></TaskItem>
        ))}
      </ListView>
    </View>
  )
}
