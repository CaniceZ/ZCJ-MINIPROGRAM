// import Taro from '@tarojs/taro'
// import storage from '@/utils/storage'
import { createSlice } from '@reduxjs/toolkit'
// import { getDetail } from '@/api/user'
import { UserType } from './types'

const name = 'user'

const initialState: UserType = {
  token: '',
  // userVO: {},
  // registerStatus: undefined,
}

// export const afterLogin = createAsyncThunk(`${name}/afterLogin`, async (data: any, thunkAPI) => {
//   const { token } = data
//   const { dispatch } = thunkAPI
//   dispatch(setToken(token))
//   storage.set('loginInfo', data)
//   storage.set('token', token)
//   return await getDetail()
// })

export const userSlice = createSlice({
  name,
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload
    },
    // setInfo: (state, { payload }) => {
    //   state.userVO = payload
    // },
    // setRegisterStatus: (state, { payload }) => {
    //   state.registerStatus = payload
    // },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(afterLogin.fulfilled, (state, { payload }) => {
  //     state.info = payload
  //     storage.set('userInfo', payload)
  //     Taro.switchTab({
  //       url: '/pages/home/index',
  //     })
  //   })
  // },
})

export const { setToken } = userSlice.actions

export default userSlice.reducer
