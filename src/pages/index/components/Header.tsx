import { View } from '@tarojs/components'

import { FC, useState } from 'react'
import { Input, Popup, Icon } from '@nutui/nutui-react-taro'
import './Header.less'

type Props = {
  handleSearch: Function
}
const Header: FC<Props> = (props) => {
  const [value, UpdateValue] = useState('')
  const cityList = [
    {
      name: '北京',
      code: 1,
    },
    {
      name: '上海',
      code: 2,
    },
    {
      name: '天津',
      code: 3,
    },
    {
      name: '重庆',
      code: 4,
    },
    {
      name: '广州',
      code: 5,
    },
    {
      name: '深圳',
      code: 6,
    },
    {
      name: '成都',
      code: 7,
    },
    {
      name: '杭州',
      code: 8,
    },
  ]
  const handleSearch = () => {
    props.handleSearch(value)
  }
  const [showBottom, setShowBottom] = useState(false)
  return (
    <View className='navbar-wrap'>
      <View
        onClick={() => {
          setShowBottom(true)
        }}
        className='navbar-left'
      >
        广州
      </View>
      <View className='navbar-right'>
        <Input
          className='navbar-inp'
          leftIcon='search'
          clearable
          leftIconSize='14'
          placeholder='请输入酒店名称'
          onChange={(val) => {
            UpdateValue(val)
          }}
        ></Input>
        <View className='search-text' onClick={handleSearch}>
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
            <Icon name='rect-left' color='#ccc' size={16}></Icon>
          </View>
          <View className='pop-title-des'>选择城市</View>
          <View></View>
        </View>
        <View className='hot-city'>
          <View className='hot-city-tit'>热门城市</View>
          <View className='hot-city-list'>
          {cityList.map((item) => (
              <View className='hot-city-list-item' key={item.code}>
                {item.name}
              </View>
          ))}
          </View>
        </View>
      </Popup>
    </View>
  )
}
export default Header
