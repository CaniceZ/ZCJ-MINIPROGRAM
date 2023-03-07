/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
// import { refreshMapKey } from '../api/home'
// import log from './log'
// import { uLoading, uCloseLoading } from './utils'
import {
  showToast,
  offLocationChange,
  stopLocationUpdate,
  hideLoading,
  canIUse,
  onLocationChangeError,
  getLocation,
  getSetting,
  openSetting,
} from '@tarojs/taro'
import { uIsGps, uIsNetworkType } from '@/utils/utils'
import storage from '@/utils/storage'

let QQMapWX = null
let qqMapSdk
// let num = 1 // 轮询的次数
function init() {
  QQMapWX = require('./qqmap-wx-jssdk.js')
  qqMapSdk = new QQMapWX({
    key: 'VYHBZ-5T7WV-TRPPQ-USNY4-MPDNV-4XFWH',
  })
}

// 停止定位服务、防止持续调用耗电
function stopLocation() {
  offLocationChange()
  stopLocationUpdate()
}

async function getMap(setGlobal = true) {
  // 地理位置授权
  // wx.ygp.uLoading()
  const workType = await noneWorkType()
  if (!workType) {
    hideLoading()
    showToast('网络不佳,请稍后重试')
    return
  }
  const Gps = await openGps()
  if (!Gps) {
    hideLoading()
    showToast('请打开GPS')
    return
  }
  init()
  const { latitude, longitude } = (await getAuthorize()) || {}
  if (latitude && longitude) {
    const localAddress = await getLocal(latitude, longitude, setGlobal)
    stopLocation()
    hideLoading()
    return localAddress
  }
  showToast('无法获取经纬度信息')
  return false
}

async function getAuthorize() {
  // const r = await startLocation()
  console.log(777)
  return new Promise((resolve, reject) => {
    // 监听实时地理位置变化事件
    // if (wx.canIUse('onLocationChange') && r) {
    //   wx.onLocationChange(function (res) {
    //     resolve(res)
    //   })
    // } else {
    // 不支持onLocationChange,改用getLocation
    getLocation({
      type: 'gcj02',
      altitude: true,
      isHighAccuracy: true, // 开启高精度定位
      success(res) {
        console.log(888)
        resolve(res)
      },
      fail(err) {
        console.log({ logType: 'wx.getLocation fail', ...err })
        showToast('getLocation定位获取失败，请稍后再试')
        reject()
      },
    })
    // }
    if (canIUse('onLocationChangeError')) {
      console.log(999)
      onLocationChangeError(function (errCode) {
        console.log(1000)
        console.log({ logType: 'onLocationChangeError ==', errCode })
        showToast('定位获取失败，请稍后再试')
        reject()
      })
    }
  })
}

// 经纬度转地址
async function getLocal(latitude, longitude, setGlobal) {
  const workType = await noneWorkType()
  if (!workType) {
    return false
  }
  if (!(latitude && longitude)) {
    showToast('无法获取经纬度信息')
    return false
  }
  return new Promise((resolve, reject) => {
    qqMapSdk.reverseGeocoder({
      location: {
        latitude,
        longitude,
      },
      success({ result }) {
        const { province, city, street } = result.address_component
        let { district } = result.address_component
        // 使用高精度经纬度，更换qqMapSdk返回来的经纬度
        result.location.lat = latitude
        result.location.lng = longitude
        const { lat, lng } = result.location
        if (district === '') {
          district = result.address_reference.town ? result.address_reference.town.title : ''
        }
        if (setGlobal) {
          storage.set('localAddress', {
            province,
            city,
            area: district,
            street,
            latitude: lat,
            longitude: lng,
          })
        }
        resolve(result)
      },
      fail(err) {
        const { status } = err
        console.log({ logType: ' qqMapSdk.reverseGeocoder fail', ...err })
        showToast('定位获取失败，请稍后再试!')
        if (status === 120 || status === 121) {
          getRefreshMapKey()
        }
        reject()
      },
    })
  })
}

async function getOpenSetting(resolve) {
  console.log(111)
  const workType = await noneWorkType()
  if (!workType) {
    return
  }
  const Gps = await openGps()
  if (!Gps) {
    return
  }
  console.log(222)
  getSetting({
    success(res) {
      console.log(333)
      if (res.authSetting['scope.userLocation'] === false) {
        console.log(444)
        openSetting({
          // eslint-disable-next-line no-shadow
          success(res) {
            console.log(555)
            if (res.authSetting['scope.userLocation']) {
              getAuthorize(resolve)
            }
          },
        }) // 打开授权页面，让用户授权
      } else {
        console.log(666)
        getAuthorize(resolve)
      }
    },
  })
}

async function openGps() {
  // 打开Gps
  const locationEnabled = await uIsGps()
  if (locationEnabled === false) {
    showToast('请打开手机GPS定位.....')
    return false
  }
  return true
}

async function noneWorkType() {
  // 没有网络
  const getWorkType = await uIsNetworkType()
  if (getWorkType === 'none') {
    showToast('当前无网络，请稍后再试')
    return false
  }
  return true
}

// 地址转经纬度
async function getLatLon(address, region, level) {
  const workType = await noneWorkType()
  if (!workType) {
    return false
  }
  return new Promise((reslove) => {
    qqMapSdk.geocoder({
      address, // 地址，地址中请包含城市名称，否则会影响解析效果
      region, // 地址所属城市
      level: level || 9, // 解析精度级别
      success(res) {
        console.log('经纬度转地址', res)
        reslove(res)
      },
      fail({ status }) {
        showToast('经纬度获取失败')
        if (status === 120 || status === 121) {
          getRefreshMapKey(status)
        }
      },
    })
  })
}

async function getRefreshMapKey() {
  console.log('getRefreshMapKey')
  // if (Number(num) < 4) {
  //   const { data, code } = await refreshMapKey({
  //     key: wx.ygp.uGetStorage('mapKey')
  //   })
  //   if (code === 0) {
  //     num = 1
  //     wx.ygp.uSetStorage('mapKey', data)
  //     getMap()
  //   } else {
  //     num += 1
  //     getRefreshMapKey()
  //   }
  // }
}
export default {
  getMap,
  getLocal,
  getOpenSetting,
  getLatLon, // 地址转经纬度
  noneWorkType, // 网络判断
  init,
}
