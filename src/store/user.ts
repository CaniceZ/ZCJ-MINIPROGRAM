import Taro from '@tarojs/taro'
import storage from '@/utils/storage'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { getDetail } from '@/api/user'
import { UserType } from './types'

const name = 'user'

const initialState: UserType = {
  token: '',
  info: {},
  enterpriseList: [],
  userType: undefined,
}

export const afterLogin = createAsyncThunk(`${name}/afterLogin`, async (data: any, thunkAPI) => {
  const { token } = data
  const { dispatch } = thunkAPI
  dispatch(setToken(token))
  storage.set('loginInfo', data)
  storage.set('token', token)
  // return await getDetail()
})

export const userSlice = createSlice({
  name,
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload
    },
    setInfo: (state, { payload }) => {
      state.info = payload
    },
    setUserType: (state, { payload }) => {
      state.userType = payload
    },
    setEnterpriseList: (state, { payload }) => {
      storage.set('enterpriseList', payload)
      state.enterpriseList = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(afterLogin.fulfilled, (state, { payload }) => {
      state.info = payload
      storage.set('userInfo', payload)
      Taro.switchTab({
        url: '/pages/home/index',
      })
    })
  },
})

export const { setToken, setInfo, setUserType, setEnterpriseList } = userSlice.actions

export default userSlice.reducer
