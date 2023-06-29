import Taro from '@tarojs/taro'
import local from '../../../local.env'
import type { BaseUrl } from './types'
// 小程序运行环境
const { envVersion } = Taro.getAccountInfoSync().miniProgram
// 线上版本，不允许修改
const release: any = {
  java: 'https://wx.51ptj.com/',
}

// 体验版环境，可修改
const trial: any = {
  java: 'https://wx-dev.51ptj.com/',
}

// Java微服务
const services = ['uc', 'wx', 'sys', 'banggong', 'merchant', 'area', 'crm']

function getBaseURL(): BaseUrl {
  if (envVersion === 'release') {
    return services.reduce((r, s) => {
      r[s] = `${r.java}${s}`
      return r
    }, release)
  } else if (envVersion === 'trial') {
    return services.reduce((r, s) => {
      r[s] = `${r.java}${s}`
      return r
    }, trial)
  }

  const { env, override } = local
  const config = {
    // 线上版本
    prod: release,
    uat: {
      java: 'https://wx-uat.51ptj.com/',
    },
    // 体验版本
    trial: trial,
    // 测试版本
    test: {
      java: 'https://wx-test.51ptj.com/',
    },
    // 开发版本
    dev: {
      java: 'https://wx-dev.51ptj.com/',
    },
  }[env]

  services.forEach((s) => {
    config[s] = override[s] || `${override.java || config.java}${s}`
  })
  return config
}
const baseURL = getBaseURL()
export default baseURL
