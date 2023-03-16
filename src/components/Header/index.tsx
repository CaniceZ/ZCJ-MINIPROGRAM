import { Button } from '@nutui/nutui-react-taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { navigateTo, useDidShow, showToast } from '@tarojs/taro'
import { useState } from 'react'
import settingIcon from '@/assets/imgs/im-facedefault.png'
import classNames from 'classnames'
import storage from '@/utils/storage'
import './index.less'

export default (props) => {
  const [show, setShow] = useState(false)
  const [curShop, setCurShop] = useState()
  const [shopList, setShopList] = useState([
    { a: 1, name: '饭店1' },
    { a: 2, name: '饭店2' },
    { a: 3, name: '饭店3' },
    { a: 4, name: '饭店4' },
  ])
  const tabClick = async () => {
    console.log('tabClick')
    setShow((val) => !val)
  }
  const toLogin = () => {
    navigateTo({ url: '/pages/login/index' })
  }
  useDidShow(() => {
    if (storage.get('curShop')) {
      setCurShop(storage.get('curShop'))
    }
  })
  const choseItem = (item, index) => {
    let shopListTmp = JSON.parse(JSON.stringify(shopList))
    let first = shopListTmp[0]
    shopListTmp[index] = first
    shopListTmp[0] = item
    setShopList(shopListTmp)
    setCurShop(item)
    storage.set('curShop', item)
    setShow(false)
    showToast({ title: `你已切换到${item.name}`, icon: 'none' })
  }
  return (
    <View className='head-wrap' catchMove>
      {false ? (
        <View className='head-top' onClick={toLogin}>
          登录/注册
        </View>
      ) : (
        <View className='head-top'>
          <View className='header-top-name' onClick={tabClick}>
            {curShop ? curShop.name : '请添加门店'}
          </View>
          <View className='header-top-oper' onClick={tabClick}>
            | {!show ? '切换 >' : '收起 ∨'}{' '}
          </View>
        </View>
      )}
      {show ? (
        <View className='head-mock'>
          <ScrollView scrollY className='head-content'>
            <View className='shop-list'>
              <View>我的商户</View>
              {shopList.map((item, index) => (
                <View
                  key={index}
                  className={classNames('shop-item', {
                    'shop-item-disable': index === 1,
                  })}
                >
                  <View
                    className='shop-item-left'
                    onClick={() => {
                      choseItem(item, index)
                    }}
                  >
                    <Image className='shop-item-image' mode='aspectFit' src={settingIcon}></Image>
                  </View>
                  <View
                    className='shop-item-content'
                    onClick={() => {
                      choseItem(item, index)
                    }}
                  >
                    <View className='shop-item-name'>广州酒家{item.a}</View>
                    <View className='shop-item-address'>广州市天河区体育东路112号百福广场F1</View>
                  </View>
                  <View className='shop-item-right'>&gt;</View>
                  <View
                    className={classNames('shop-item-tag', {
                      'shop-item-tag-cur': index === 0,
                      'shop-item-tag-fail': index === 1,
                      'shop-item-tag-pending': index === 2,
                    })}
                  >
                    {index === 0
                      ? '当前门店'
                      : index === 1
                      ? '审核不通过'
                      : index === 2
                      ? '审核中'
                      : ''}
                  </View>
                </View>
              ))}
            </View>
            <View className='shop-item add-btn'>添加门店管理</View>
            <View className='back-btn'>
              <Button
                type='primary'
                size='small'
                onClick={() => {
                  setShow(false)
                }}
              >
                {' '}
                返回{' '}
              </Button>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  )
}
