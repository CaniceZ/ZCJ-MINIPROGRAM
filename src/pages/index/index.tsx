import { View } from '@tarojs/components'
// import { ListView } from '@/package'
import { useCallback, useEffect, useState, useMemo } from 'react'
import location from '@/utils/location'
import TaskCell from '@/components/TaskCell'
import RealName from './components/RealName'
import TaskItem from '../../components/TaskItem'
import NavBar from './components/NavBar'
import Header from './components/Header'
import ListType from './components/ListType'
import Recommend from './components/Recommend'

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
  // const { listData, listViewProps } = ListView.useListView(fetcher as any, {
  //   limit: 50,
  // })
  const listData = Array(20).fill({})
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
  // 工作类型
  const [type, setType] = useState(1)
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
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
    })
    // console.log(a)
  }, [])
  // 点击搜索
  // const handleSearch = useCallback(() => {
  //   handleApi()
  // }, [hotelName, initCity, type])
  const handleSearch = () => {
    handleApi()
  }
  // 切换城市回调
  const handleSetCity = (params) => {
    setInitCity(params)
    handleApi({ initCity: params })
  }
  // 工种类型修改
  const onTypeChange = (params) => {
    setType(params)
    handleApi({ type: params }) // 改动的字段
  }
  // 重新设置定位为当前位置
  const setLocal = useCallback(() => {
    location.getMap().then((res) => {
      setInitCity({ name: res.address_component.city })
    })
  }, [])

  // 调用后端查询接口
  const handleApi = (changeParams = {}) => {
    const queryData = {
      hotelName,
      type,
      initCity,
      ...changeParams,
    }
    console.log(queryData)
  }
  // 去接单弹窗
  const [recommendShow, setRecommendShow] = useState(false)
  const recommendList = useMemo(() => (listData.length > 0 ? listData.slice(0, 7) : []), [listData])
  return (
    <View>
      <NavBar></NavBar>
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
      {listData.map((_, index) => (
          <TaskItem key={index} index={index}></TaskItem>
        ))}
      <Recommend
        visible={recommendShow}
        list={recommendList}
        onClose={() => {
          setRecommendShow(false)
        }}
      ></Recommend>
    </View>
  )
}
