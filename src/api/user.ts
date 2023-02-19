import http, { baseUrl } from '../utils/http/index'

// export function login(data) {
//   return http.post({ url: `${baseUrl.uc}/login/adminLogin`, data });
// }

/**
 * @description: 账号密码登录
 */
export function login(data) {
  return http.post({
    url: `${baseUrl.uc}/god/scp/dz/wechat/login/accountPassword`,
    data,
  })
}

/**
 * @description: 手机验证码登录
 */
export function loginUseMobile(data) {
  return http.post({
    url: `${baseUrl.uc}/god/scp/dz/wechat/login/mobileSmsCode`,
    data,
  })
}

/**
 * @description: 账号密码登录
 */
export function loginForCustmer(data) {
  return http.post({
    url: `${baseUrl.uc}/god/yxg/wechat/login/accountPassword`,
    data,
  })
}

/**
 * @description: 手机验证码登录
 */
export function loginUseMobileForCustmer(data) {
  return http.post({
    url: `${baseUrl.uc}/god/yxg/wechat/login/mobileSmsCode`,
    data,
  })
}

// 获取验证码
export const sendSMSCode = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/god/login/sendSMSCode`, data })
}

// 验证原手机号
export const verifyPhone = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/god/v2/user/verifyPhone`, data })
}

// 通过验证码修改密码
export const retrievePassword = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/god/v2/user/retrievePassword`, data })
}

//前台用户通过账号修改密码(旧密码修改)
export const editUserPassWord = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/king/ucuser/editUserPassWord`, data })
}

// 商家侧-----获得登陆账号个人信息
export function getByLoginAccountInfo() {
  return http.get({ url: `${baseUrl.uc}/king/account/info/getInfo` })
}

//商家侧-----修改账号个人信息
export const updatePersonalInfo = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/king/account/info/updateInfo`, data })
}

// 获取用户详情
export const getDetail = () => {
  return http.get({ url: `${baseUrl.uc}/king/entity/enterprise/getDetail` })
}

// 退出
export function doLogout() {
  return http.get({ url: `${baseUrl.uc}/login/logout` })
}

/**
 * @description: 客户多企业登录
 */
export function loginOnceToken(data) {
  return http.post({
    url: `${baseUrl.uc}/god/zhike/enterprise/login/onceToken`,
    data,
  })
}

// 选择主体登录
export const checkOutEnterprise = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/god/login/general/checkOutEnterprise`, data })
}

// 账号主体切换
export const switchEnterpriseIdentity = (data: any) => {
  return http.post({ url: `${baseUrl.uc}/king/user/switchEnterpriseIdentity`, data })
}

// 获取当前登录用户信息
export const getBaseUserInfo = () => {
  return http.get({ url: `${baseUrl.uc}/king/ucuser/getBaseUserInfo` })
}

// 获取地址列表
export const listAddress = (data: any) => {
  return http.get({ url: `${baseUrl.crm}/king/mall/address/getByBizType`, data })
}

// 保存地址
export const saveAddress = (data) => {
  return http.post({ url: `${baseUrl.crm}/king/mall/address/create`, data })
}

// 更新地址
export const updateAddress = (data) => {
  return http.post({ url: `${baseUrl.crm}/king/mall/address/update`, data })
}

// 检查手机号是否有效
export const checkMobileRegister = (mobile) => {
  return http.get({ url: `${baseUrl.uc}/god/zhike/checkMobileRegister?mobile=${mobile}` })
}

// 获取custmer临时token
export const consumeSmsCodeToOnceToken = (data) => {
  return http.post({ url: `${baseUrl.uc}/god/sms/consumeSmsCodeToOnceToken`, data })
}

// 更新客户密码
export const updateByMobileOnceToken = (data) => {
  return http.post({ url: `${baseUrl.uc}/god/zhike/password/updateByMobileOnceToken`, data })
}
