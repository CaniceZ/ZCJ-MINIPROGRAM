import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'tabbar',
  initialState: {
    activeVisible: 0,
    dotVisible: false,
  },
  reducers: {
    setActiveVisible(state, { payload }) {
      state.activeVisible = payload
    },
    setDotVisible(state, { payload }) {
      state.dotVisible = payload
    },
  },
})

export const { setActiveVisible, setDotVisible } = slice.actions
export default slice.reducer
