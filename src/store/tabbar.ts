import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'tabbar',
  initialState: {
    activeVisible: 0,
  },
  reducers: {
    setActiveVisible(state, { payload }) {
      state.activeVisible = payload
    },
  },
})

export const { setActiveVisible } = slice.actions
export default slice.reducer
