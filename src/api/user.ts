import http, { baseUrl } from '../utils/http/index'

// export function login(data) {
//   return http.post({ url: `${baseUrl.uc}/login/adminLogin`, data });
// }

/**
 * @description: 账号密码登录
 */
export function loginWx(data) {
  return http.post({
    url: `${baseUrl.banggong}/login/wechat`,
    data,
  })
}

/**
 * @description: 获取手机号
 */
export function getWxPhoneNumber(data) {
  return http.get({
    url: `${baseUrl.wx}/i/wx/v1.1/mini/common/getPhoneNum`,
    data,
  })
}
// 保存用户信息
export function saveUserInfo(data) {
  return http.post({
    url: `${baseUrl.uc}/user/saveUserInfo`,
    data,
  })
}
