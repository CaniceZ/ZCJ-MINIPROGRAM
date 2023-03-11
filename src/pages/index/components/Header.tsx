import { View, ScrollView } from '@tarojs/components'

import { FC, useEffect, useMemo, useState } from 'react'
import { Input, Popup, Icon } from '@nutui/nutui-react-taro'
import address from '@/assets/json/address.json'
import classNames from 'classnames'
import storage from '@/utils/storage'
import './Header.less'

type Props = {
  initCity
  hotelName
  setLocal: Function
  setHotName: Function
  handleSetCity: Function
  handleSearch: Function
}
type City = {
  type?: Number
  name: String
  level?: Number
  parentCode?: Number
  childAreas?: Array<City>
}
const Header: FC<Props> = (props) => {
  const [selectedProvince, setSelectedProvince] = useState<City>()
  // setSelectedCity(props.initCity)
  // 热门城市
  const cityList = [
    {
      name: '北京市',
      type: 110000000000,
    },
    {
      name: '上海市',
      type: 310000000000,
    },
    {
      name: '天津市',
      type: 120000000000,
    },
    {
      name: '重庆市',
      type: 500000000000,
    },
    {
      name: '广州市',
      type: 440100000000,
    },
    {
      name: '深圳市',
      type: 440300000000,
    },
    {
      name: '成都市',
      type: 510100000000,
    },
    {
      name: '杭州市',
      type: 330100000000,
    },
  ]
  // 直辖市
  const noChildCityList = [
    {
      name: '北京',
      type: 110000000000,
    },
    {
      name: '上海',
      type: 310000000000,
    },
    {
      name: '天津',
      type: 120000000000,
    },
    {
      name: '重庆',
      type: 500000000000,
    },
  ]
  // 当前定位的城市
  const [curCity, setCurCity] = useState()
  useEffect(() => {
    setCurCity(storage.get('localAddress')?.city)
  }, [curCity])
  // 显示的列表
  const curList = useMemo(
    () =>
      selectedProvince
        ? address.find((item) => item.type === selectedProvince.type).childAreas
        : address,
    [selectedProvince],
  )
  // 调用父组件设置城市
  const handleSetCity = (item) => {
    props.handleSetCity(item)
    setShowBottom(false)
  }
  // 调用父组件设置当前城市
  const childSetLocal = () => {
    setCurCity(storage.get('localAddress')?.city)
    handleSetCity({ name: storage.get('localAddress')?.city })
  }
  // 列表点击
  const setCity = (item) => {
    if (noChildCityList.map((item2) => item2.type).includes(item.type)) {
      // 点击了直辖市
      console.log('选择了直辖市', item)
      handleSetCity(item)
    } else {
      if (item.level === 1) {
        // 点击了省份
        setSelectedProvince(item)
      } else {
        console.log('选择了城市', item)
        handleSetCity(item)
      }
    }
  }
  // 返回选择省
  const backLevel1 = () => {
    setSelectedProvince(undefined)
  }
  // 弹窗显隐
  const [showBottom, setShowBottom] = useState(false)
  return (
    <View className='navbar-wrap'>
      <View
        onClick={() => {
          setShowBottom(true)
        }}
        className='navbar-left'
      >
        {props.initCity ? props.initCity.name : '定位中'}
      </View>
      <View className='navbar-right'>
        <Input
          className='navbar-inp'
          leftIcon='search'
          clearable
          leftIconSize='14'
          placeholder='请输入酒店名称'
          defaultValue={props.hotelName}
          onChange={(val) => {
            props.setHotName(val)
          }}
          onClear={(val) => {
            props.setHotName(val)
          }}
        ></Input>
        <View
          className='search-text'
          onClick={() => {
            props.handleSearch()
          }}
        >
          {' '}
          搜索{' '}
        </View>
      </View>
      <Popup
        visible={showBottom}
        style={{ height: '70%', padding: '20px' }}
        closeable
        position='bottom'
        round
        onClose={() => {
          setShowBottom(false)
        }}
      >
        <View className='pop-title'>
          <View className='pop-title-back'>
            {selectedProvince ? (
              <Icon
                onClick={() => {
                  backLevel1()
                }}
                name='rect-left'
                color='#ccc'
                size={16}
              ></Icon>
            ) : (
              <View style='width:16px' />
            )}
          </View>
          <View className='pop-title-des'>选择城市</View>
          <View></View>
        </View>
        <View className='select-box'>
          {selectedProvince ? <View className='selected'>{selectedProvince?.name}</View> : ''}
          <View className='selected-txt'>请选择</View>
        </View>
        <ScrollView scrollY style='height: calc(100% - 59px)'>
          {!selectedProvince && (
            <View className='cur-city'>
              <View className='cur-city-title'>定位城市</View>
              <View className='cur-city-name' onClick={childSetLocal}>{curCity}</View>
            </View>
          )}
          {!selectedProvince && (
            <View className='hot-city'>
              <View className='hot-city-tit'>热门城市</View>
              <View className='hot-city-list'>
                {cityList.map((item) => (
                  <View
                    onClick={() => {
                      handleSetCity(item)
                    }}
                    className={classNames('hot-city-list-item', {
                      'item-active': item.name === props.initCity?.name,
                    })}
                    key={item.type}
                  >
                    {item.name}
                  </View>
                ))}
              </View>
            </View>
          )}
          <View className='all-city'>
            <View className='all-city-list'>
              {curList.map((item) => (
                <View
                  className={classNames('all-city-item', {
                    'item-active': item.name === props.initCity?.name,
                  })}
                  key={item.type}
                  onClick={() => {
                    setCity(item)
                  }}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Popup>
    </View>
  )
}
export default Header
