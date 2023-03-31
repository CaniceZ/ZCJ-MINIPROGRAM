import http, { baseUrl } from '../utils/http/index'

// 查询当前帮工信息详情
export const getCurrentHelperInfoDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperInfo/getCurrentHelperInfoDetail`,
    method: 'GET',
    data,
  })
}

// 查询帮工信息详情
export const getHelperInfoDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperInfo/getHelperInfoDetail`,
    method: 'GET',
    data,
  })
}

// 查询帮工简历
export const getHelperInfoProfile = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperInfo/getHelperInfoProfile`,
    method: 'POST',
    data,
  })
}

// 保存帮工信息
export const saveHelperInfo = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperInfo/saveHelperInfo`,
    method: 'POST',
    data,
  })
}

// 提交帮工信息（银行卡信息，附件id）
export const userSaveHelperInfo = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/user/saveHelperInfo`,
    method: 'POST',
    data,
  })
}

// 用户实名认证
export const realNameIdentify = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/user/realNameIdentify`,
    method: 'POST',
    data,
  })
}

// 查询帮工待办任务（首页任务备忘录）
export const getTodoTask = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperTask/getTodoTask`,
    method: 'GET',
    data,
  })
}
