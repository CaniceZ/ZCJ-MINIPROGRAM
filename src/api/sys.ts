import http, { baseUrl } from '../utils/http/index'

// 获取用户详情
export const listArea = () => {
  return http.post({ url: `${baseUrl.area}/listProvincesTree` })
}

export const getTokens = (data) => {
  return http.request({
    url: `${baseUrl.sys}/king/file/filesystem/getUploadTokenMap`,
    method: 'POST',
    data,
  })
}

export const getPrivateUrls = (data) => {
  return http.get({ url: `${baseUrl.sys}/king/file/filesystem/getPrivateDownloadUrls`, data })
}

export const getBciscmPrivateUrl = (privateFileKey) => {
  return http.get({
    url: `${baseUrl.bciscm}/upload/getPrivateDownloadUrl?privateFileKey=${privateFileKey}`,
  })
}
