import http, { baseUrl } from '../utils/http/index'

// 查询当前帮工兼职计划
export const listCurrentHelperPartTimePlan = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/partTimePlan/listCurrentHelperPartTimePlan`,
      method: 'POST',
      data,
    },
    {
      loading: false,
    },
  )
}

// 校验是否关注微信服务号
export const checkHelperSubscribeWSA = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/helperInfo/checkHelperSubscribeWSA`,
      method: 'GET',
      data,
    },
    {
      loading: false,
    },
  )
}

// 保存帮工兼职计划
export const savePartTimePlan = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/partTimePlan/savePartTimePlan`,
    method: 'POST',
    data,
  })
}

// 查询所有帮工兼职班次
export const listAllPartTimeShift = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/partTimeShift/listAllPartTimeShift`,
      method: 'GET',
      data,
    },
    {
      loading: false,
    },
  )
}
