import http, { baseUrl } from '../utils/http/index'

// 查询当前帮工信息详情
export const getCurrentHelperInfoDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperInfo/getCurrentHelperInfoDetail`,
    method: 'GET',
    data,
  })
}
// 查询当前帮工编码
export const getHelperCode = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/helperInfo/getHelperCode`,
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
    url: `${baseUrl.banggong}/user/authAndSaveHelperInfo`,
    method: 'POST',
    data,
  })
}

// 用户实名ocr
export const realNameIdentify = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/user/idCard/ocr`,
    method: 'POST',
    data,
  })
}

// 查询帮工待办任务（首页任务备忘录）
export const getTodoTask = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/helperTask/getTodoTask`,
      method: 'GET',
      data,
    },
    {
      loading: false,
    },
  )
}

// 更新帮工所在地
export const updateHelperLocation = (data) => {
  return http.request(
    {
      url: `${baseUrl.banggong}/helperInfo/updateHelperLocation`,
      method: 'POST',
      data,
    },
    {
      loading: false,
    },
  )
}
