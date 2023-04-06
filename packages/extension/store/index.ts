import { configureStore } from '@reduxjs/toolkit'
// eslint-disable-next-line import/no-named-as-default
import counterSlice from './features/counterSlice'

// configureStore创建一个redux数据
const store = configureStore({
  // 合并多个Slice
  reducer: {
    counter: counterSlice,
  },
})

export default store
