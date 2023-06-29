import http, { baseUrl } from '../utils/http/index'

// 分页查询商家任务
export const pageMerchantTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/task/page/index`,
    method: 'POST',
    data,
  })
}

// 分页查询帮工任务
export const pageHelperTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperTask/pageHelperTask`,
    method: 'POST',
    data,
  })
}

// 帮工任务报名
export const helperEnroll = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperTask/helperEnroll`,
    method: 'POST',
    data,
  })
}

// 取消帮工任务
export const cancelHelperTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperTask/cancelHelperTask`,
    method: 'POST',
    data,
  })
}

// 查询帮工任务详情
export const getHelperTaskDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperTask/getHelperTaskDetail`,
    method: 'GET',
    data,
  })
}

// 查询商家任务详情（首页）
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
    url: `${baseUrl.banggong}/helperTask/getUndoTaskNum`,
    method: 'GET',
    data,
  })
}
// 查询商家门店照片
export const getMerchantPhoto = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/merchant/getMerchantPhoto`,
    method: 'GET',
    data,
  })
}

// 查询帮工是否报名该商家任务
export const checkHelperEnroll = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperTask/checkHelperEnroll`,
    method: 'GET',
    data,
  })
}

// 查询帮工待办任务量（待开始、进行中）
export const getTodoTaskNum = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/helperTask/getTodoTaskNum`,
      method: 'GET',
      data,
    },
    {
      loading: false,
    },
  )
}

// 分页查询商家任务（首页推荐任务）
export const indexRecommend = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/task/page/indexRecommend`,
      method: 'POST',
      data,
    },
    {
      loading: false,
    },
  )
}
