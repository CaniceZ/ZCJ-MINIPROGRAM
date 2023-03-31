import { getSystemInfo, getNetworkType, redirectTo, showToast } from '@tarojs/taro'
import storage from './storage'

/**
 * 生成uuid
 * @param len 长度
 * @param radix 基位
 * @returns string
 */
export function createUUID(len: number, radix: number) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid: string[] = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

export function formatMoney(s1, n = 2) {
  if (!s1) return '0.00'
  let flag = ''
  if (s1 < 0) {
    flag = '-'
  }
  let s2: any = Math.abs(s1)
  n = n > 0 && n <= 20 ? n : 2
  s2 = parseFloat((s2 + '').replace(/[^\d\\.-]/g, '')).toFixed(n) + ''
  let l = s2.split('.')[0].split('').reverse(),
    r = s2.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
  }
  return flag + t.split('').reverse().join('') + '.' + r
}

export function uIsGps() {
  return new Promise((resolve) => {
    // 首次api获取
    getSystemInfo({
      success: (res) => {
        const { locationEnabled } = res
        resolve(locationEnabled)
      },
    })
  })
}

// 判断当前网络状态
export function uIsNetworkType() {
  return new Promise((resolve) => {
    // 首次api获取
    getNetworkType({
      success: (res) => {
        const { networkType } = res
        resolve(networkType)
      },
    })
  })
}
/**
 * 去除为空的字段
 * @param {Object} obj 来源对象
 */
export function removeEmptyField(obj) {
  var newObj = {}
  if (typeof obj === 'string') {
    obj = JSON.parse(obj)
  }
  if (obj instanceof Array) {
    newObj = []
  }
  if (obj instanceof Object) {
    for (var attr in obj) {
      // 属性值不为'',null,undefined才加入新对象里面(去掉'',null,undefined)
      if (
        obj.hasOwnProperty(attr) &&
        obj[attr] !== '' &&
        obj[attr] !== null &&
        obj[attr] !== undefined
      ) {
        if (obj[attr] instanceof Object) {
          // 空数组或空对象不加入新对象(去掉[],{})
          if (JSON.stringify(obj[attr]) === '{}' || JSON.stringify(obj[attr]) === '[]') {
            continue
          }
          // 属性值为对象,则递归执行去除方法
          newObj[attr] = removeEmptyField(obj[attr])
        } else if (
          typeof obj[attr] === 'string' &&
          ((obj[attr].indexOf('{') > -1 && obj[attr].indexOf('}') > -1) ||
            (obj[attr].indexOf('[') > -1 && obj[attr].indexOf(']') > -1))
        ) {
          // 属性值为JSON时
          try {
            var attrObj = JSON.parse(obj[attr])
            if (attrObj instanceof Object) {
              newObj[attr] = removeEmptyField(attrObj)
            }
          } catch (e) {
            newObj[attr] = obj[attr]
          }
        } else {
          newObj[attr] = obj[attr]
        }
      }
    }
  }
  return newObj
}
// 09:00:00 -> 09:00
export function hms2hm(a) {
  if (!a) return
  var alist = a.split(':')
  alist.splice(alist.length - 1, 1)
  return alist.join(':')
}

// 未登录跳转
export function checkLoginAndRedirect() {
  if (storage.get('registerStatus') == 0) {
    showToast({ title: '前往登录...', icon: 'none' })
    redirectTo({ url: '/pages/login/index' })
    return false
  } else {
    return true
  }
}

// 未认证跳转
export function checkRealnameAndRedirect() {
  if (storage.get('registerStatus') == 1) {
    showToast({ title: '前往认证...', icon: 'none' })
    redirectTo({ url: '/subpackages/realname/info/index' })
  }
}
