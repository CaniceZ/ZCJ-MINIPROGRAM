import Taro from '@tarojs/taro'
import storage from '@/utils/storage'
import { loginWx } from '@/api/user'
import type { RequestConfig } from './types'
// import store from '@/store'
// import { setDotVisible } from '@/store/tabbar'
// store.dispatch(setDotVisible(true))
// const APP_NAME = 'ygp-yxg-miniprogram'

type RequestStatus = 0 | 400 | 401 | 402 | 403 | 404 | 405 | 408 | 500 | 501 | 502 | 503 | 504 | 505

class httpRequest {
  private readonly defaultConfig

  constructor(conf: RequestConfig) {
    this.defaultConfig = conf
  }
  get<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>(options, config)
  }
  post<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>({ ...options, method: 'POST' }, config)
  }
  put<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>({ ...options, method: 'PUT' }, config)
  }
  delete<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>({ ...options, method: 'DELETE' }, config)
  }
  request<T = any>(options: Taro.request.Option, config?: RequestConfig): Promise<T> {
    const conf = Object.assign({}, this.defaultConfig, config)
    if (conf.loading) {
      Taro.showLoading({ title: '加载中' })
    }
    const opt = requestInterceptor(options)
    return new Promise<T>((resolve) => {
      Taro.request({
        timeout: 8000,
        ...opt,
        success(res) {
          if (conf.loading) Taro.hideLoading()
          const ret = transformResponse(res, conf)
          resolve(ret)
        },
        fail(err) {
          if (conf.loading) Taro.hideLoading()
          responseInterceptorsCatch(err)
        },
      })
    })
  }
}

/**
 * @description: 请求拦截
 */
function requestInterceptor(options: Taro.request.Option): Taro.request.Option {
  const { header } = options
  const token = storage.get('token') || ''
  // 设置token、appName
  options.header = {
    ...header,
    token,
    'wechat-service-appCode': 1,
    // appName: APP_NAME,
  }
  return options
}

function transformResponse(res, config) {
  const { isTransformResponse, isReturnNativeResponse } = config
  if (isReturnNativeResponse) {
    return res
  }

  if (!isTransformResponse) {
    return res.data
  }

  const { data } = res
  if (!data) {
    Taro.showToast({
      title: '请求出错，请稍候重试',
      icon: 'none',
    })
  }

  const { code, data: result } = data
  if (code === 0) {
    return result
  }
  return responseInterceptorsCatch(res)
}

/**
 * @description: 响应错误处理
 */
function responseInterceptorsCatch(error: any) {
  const { data } = error || {}
  const msg: string = data?.msg ?? ''
  const err: string = error?.errMsg?.toString?.() ?? ''
  let errMessage = ''
  try {
    if (err?.includes('request:fail')) {
      errMessage = '请求出错，请稍后重试'
    }
    if (err?.includes('request:fail timeout')) {
      errMessage = '网络异常，请检查您的网络连接是否正常!'
    }
    if (errMessage) {
      Taro.showToast({
        title: errMessage,
        icon: 'none',
      })
      return Promise.reject(error)
    }
  } catch (captureErr) {
    throw new Error(captureErr as unknown as string)
  }
  checkStatus(data?.code || error?.statusCode, msg)
  return Promise.reject(error)
}

function checkStatus(status: RequestStatus, msg: string): void {
  let errMessage = ''

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    // 401: 无接口权限
    case 401:
      errMessage = msg || '没有权限访问'
      // storage.clear()
      Taro.login({
        success(res) {
          console.log(res.code, 898989)
          if (res.code) {
            //发起网络请求
            loginWx({ code: res.code, appCode: 1, sourceChannel: 1, userType: 1 }).then((data) => {
              console.log('request:settoken')
              storage.set('token', data.token)
              storage.set('registerStatus', data.registerStatus)
              storage.set('userVO', data.userVO)
              // Taro.switchTab({ url: '/pages/index/index' })
              // }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        },
      })

      break
    // 403 一般为token过期出现
    case 403:
      // Taro.redirectTo({
      //   url: '/pages/login/index',
      // })
      Taro.redirectTo({ url: '/pages/login/index' })
      errMessage = msg || '登录过期,请重新登录！'
      break
    // 404请求不存在
    case 404:
      errMessage = msg || '网络请求错误,未找到该资源!'
      break
    case 405:
      errMessage = msg || '网络请求错误,请求方法未允许!'
      break
    case 408:
      errMessage = msg || '网络请求超时!'
      break
    case 500:
      errMessage = msg || '服务器错误,请联系管理员!'
      break
    case 501:
      errMessage = msg || '网络未实现!'
      break
    case 502:
      errMessage = msg || '网络错误!'
      break
    case 503:
      errMessage = msg || '服务不可用，服务器暂时过载或维护!'
      break
    case 504:
      errMessage = msg || '网络超时!'
      break
    case 505:
      errMessage = msg || 'http版本不支持该请求!'
      break
    default:
      errMessage = msg || '请求出错，请稍候重试'
  }
  Taro.showToast({
    title: errMessage,
    icon: 'none',
  })
}
function createHttpRequest() {
  return new httpRequest({
    loading: true,
    isTransformResponse: true,
    isReturnNativeResponse: false,
  })
}
export default createHttpRequest()
