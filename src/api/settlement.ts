import http, { baseUrl } from '../utils/http/index'

// 查询帮工结算单详情
export const getHelperSettlementDetail = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/settlement/getHelperSettlementDetail`,
    method: 'GET',
    data,
  })
}

// 分页查询帮工收益列表
export const pageHelperIncome = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/settlement/pageHelperIncome`,
    method: 'POST',
    data,
  })
}

// 分页查询帮工结算单
export const pageHelperSettlement = (data) => {
  return http.request({
    url: `${baseUrl.banggong}/settlement/pageHelperSettlement`,
    method: 'POST',
    data,
  })
}
