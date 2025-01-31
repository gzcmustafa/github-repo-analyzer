import { configureStore } from '@reduxjs/toolkit'
import githubReducer from "./githubSlice"

export const store = configureStore({
  reducer: {
    counter: githubReducer,
  },
})