import http, { baseUrl } from '../utils/http/index'

// 获取用户详情
export const attachmentUpload = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/attachment/upload`,
    method: 'POST',
    data,
  })
}

// 查询全部有效工种
export const listJobType = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/dict/listJobType`,
      method: 'GET',
      data,
    },
    {
      loading: false,
    },
  )
}
// 首页获取banner
export const listBanner = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/index/listBanner`,
      method: 'GET',
      data,
    },
    {
      loading: false,
    },
  )
}
