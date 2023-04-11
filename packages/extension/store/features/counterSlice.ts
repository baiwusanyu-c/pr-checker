import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
  title: string
}
const initialState: CounterState = {
  value: 0,
  title: 'redux toolkit pre',
}

// 创建一个 Slice
export const counterSlice = createSlice({
  name: 'counter', // 名称
  initialState, // 默认值
  // 定义 reducers 并生成关联的操作
  reducers: {
    // 定义一个加的方法
    increment: (state) => {
      state.value += 1
    },
    // 定义一个减的方法
    decrement: (state) => {
      state.value -= 1
    },
  },
})
// 导出加减的方法
export const { increment, decrement } = counterSlice.actions
// 默认导出
export default counterSlice.reducer
