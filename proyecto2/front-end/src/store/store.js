import { configureStore } from '@reduxjs/toolkit'
import { activitySlice } from './activity/activitySlice'
import { authSlice } from './auth/authSlice'
import { storageSlice } from './storage/storageSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        activity: activitySlice.reducer,
        storage: storageSlice.reducer,
    },
})