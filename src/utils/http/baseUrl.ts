import Taro from '@tarojs/taro'
import local from '../../../local.env'
import type { BaseUrl } from './types'
// 小程序运行环境
const { envVersion } = Taro.getAccountInfoSync().miniProgram
// 线上版本，不允许修改
const release: any = {
  java: 'https://api.yigongpin.com/api/',
}

// 体验版环境，可修改
const trial: any = {
  java: 'https://gateway-uat.yigongpin.net/api/',
}

// Java微服务
const services = ['uc', 'wx', 'sys', 'bciscm', 'area', 'sys', 'crm']

function getBaseURL(): BaseUrl {
  if (envVersion === 'release') {
    return services.reduce((r, s) => {
      r[s] = `${r.java}${s}/`
      return r
    }, release)
  } else if (envVersion === 'trial') {
    return services.reduce((r, s) => {
      r[s] = `${r.java}${s}/`
      return r
    }, trial)
  }

  const { env, override } = local
  const config = {
    // 线上版本
    prod: release,
    uat: {
      java: 'https://gateway-uat.yigongpin.net/api/',
    },
    uat2: {
      java: 'https://gateway-uat2.yigongpin.net/api/',
    },
    // 体验版本
    trial: {
      java: 'http://gateway-uat.yigongpin.net/api/',
    },
    // 体验版本
    test: {
      java: 'http://test-gateway.yigongpin.net/api/',
    },
    test1: {
      java: 'http://gateway-test1.yigongpin.net/api/',
    },
    test2: {
      java: 'http://gateway-test2.yigongpin.net/api/',
    },
    test3: {
      java: 'http://gateway-test3.yigongpin.net/api/',
    },
    test4: {
      java: 'http://gateway-test4.yigongpin.net/api/',
    },
    // 开发版本
    dev: {
      java: 'http://devrefactor-crm.yigongpin.net/api/',
    },
    dev1: {
      java: 'http://gateway-dev1.yigongpin.net/api/',
    },
    dev2: {
      java: 'http://gateway-dev2.yigongpin.net/api/',
    },
    dev3: {
      java: 'http://devrefactor3-gateway.yigongpin.net/api/',
    },
  }[env]

  services.forEach((s) => {
    config[s] = override[s] || `${override.java || config.java}${s}`
  })
  return config
}
const baseURL = getBaseURL()
export default baseURL
