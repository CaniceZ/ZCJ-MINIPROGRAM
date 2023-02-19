import Taro from '@tarojs/taro'
import { useEffect } from 'react'

/** 检测小程序更新 */
const useUpdateGuard = () => {
  useEffect(() => {
    /* 版本自动更新代码 */
    const updateManager = Taro.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // console.log('我看看', res) // 请求完新版本信息的回调 true说明有更新
    })
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新检测', // 此处可自定义提示标题
        content: '检测到新版本，是否重启易小钢小程序？', // 此处可自定义提示消息内容
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        },
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      Taro.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false,
      })
    })
  }, [])
}

export default useUpdateGuard
