import { checkHelperEnroll } from '@/api/task'
import { View } from '@tarojs/components'
import { useCallback, useEffect } from 'react'
import { redirectTo, useRouter } from '@tarojs/taro'
import { useAppSelector } from '@/hooks/useStore'

export default () => {
  const {
    params: { merchantTaskCode, distance },
  } = useRouter()
  const token = useAppSelector((state) => state.user.token)
  useEffect(() => {
    if (token) {
      console.log(token)
      goDetail()
    }
  }, [token])
  const goDetail = useCallback(async () => {
    const res = await checkHelperEnroll({ merchantTaskCode: merchantTaskCode })
    if (res && res.hasEnroll !== 0) {
      redirectTo({
        url: `/subpackages/task/taskdetail/index?helperTaskCode=${res.helperTaskCode}&shareFlag=1`,
      })
      return
    }
    redirectTo({
      url: `/subpackages/task/detail/index?merchantTaskCode=${merchantTaskCode}&distance=${distance}&shareFlag=1`,
    })
  }, [])
  return (
    <>
      <View>跳转中...</View>
    </>
  )
}
