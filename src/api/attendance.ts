import http, { baseUrl } from '../utils/http/index'

// 获取评价详情
export const getEvaluationDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/attendance/getEvaluationDetail`,
    method: 'GET',
    data,
  })
}

// 查询帮工考勤任务详情
export const getHelperTaskItemDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/attendance/getHelperTaskItemDetail`,
    method: 'POST',
    data,
  })
}

// 帮工考勤打卡
export const helperClockIn = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/attendance/helperClockIn`,
    method: 'POST',
    data,
  })
}

// 分页查询帮工子任务列表
export const pageHelperTaskItem = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/attendance/pageHelperTaskItem`,
    method: 'POST',
    data,
  })
}

// 帮工进入任务详情，帮工考勤状态汇总
export const getHelperTaskItemStatus = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/attendance/getHelperTaskItemStatus`,
    method: 'GET',
    data,
  })
}
