import { configureStore } from '@reduxjs/toolkit'
import { activitySlice } from './activity/activitySlice'
import { authSlice } from './auth/authSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        activity: activitySlice.reducer
    },
})