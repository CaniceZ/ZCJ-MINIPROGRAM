import { View } from '@tarojs/components'
import { ListView } from '@/package'
import { useCallback, useEffect, useState } from 'react'
import location from '@/utils/location'
import RealName from './components/RealName'
import TaskItem from './components/TaskItem'

import './index.less'
import NavBar from './components/NavBar'
import Header from './components/Header'
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
  const [hotelName, setHotName] = useState()
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
    })
    // console.log(a)
  }, [])
  // 点击搜索
  const handleSearch = useCallback((params) => {
    setHotName(params)
    console.log(hotelName)
  }, [])
  return (
    <View>
      <NavBar></NavBar>
      <Header handleSearch={handleSearch}></Header>
      <RealName></RealName>
      total：{listViewProps.pagination.total}
      <ListView {...listViewProps}>
        {listData.map((_, index) => (
          <TaskItem key={index} index={index}></TaskItem>
        ))}
      </ListView>
    </View>
  )
}
