import http, { baseUrl } from '../utils/http/index'

// 分页查询商家任务
export const pageMerchantTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/pageMerchantTask`,
    method: 'POST',
    data,
  })
}

// 分页查询帮工任务
export const pageHelperTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/pageHelperTask`,
    method: 'POST',
    data,
  })
}

// 帮工任务报名
export const helperEnroll = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/helperEnroll`,
    method: 'POST',
    data,
  })
}

// 取消帮工任务
export const cancelHelperTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/cancelHelperTask`,
    method: 'POST',
    data,
  })
}

// 查询帮工任务详情
export const getHelperTaskDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/getHelperTaskDetail`,
    method: 'GET',
    data,
  })
}

// 查询商家任务详情
export const getMerchantTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/getMerchantTask`,
    method: 'GET',
    data,
  })
}

// 查询帮工待办任务量
export const getUndoTaskNum = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/getUndoTaskNum`,
    method: 'GET',
    data,
  })
}
