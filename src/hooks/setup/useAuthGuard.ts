import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import storage from '@/utils/storage'
import { setToken, setInfo, setEnterpriseList, setUserType } from '@/store/user'

const useAuthGuard = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    let token = storage.get('token')
    if (token) {
      let userInfo = storage.get('userInfo')
      let enterpriseList = storage.get('enterpriseList')
      let userType = storage.get('userType')
      dispatch(setToken(token))
      dispatch(setInfo(userInfo))
      dispatch(setUserType(userType))
      dispatch(setEnterpriseList(enterpriseList))
    }
  }, [])
}

export default useAuthGuard
