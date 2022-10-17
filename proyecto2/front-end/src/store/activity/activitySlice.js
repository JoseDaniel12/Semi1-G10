import { createSlice } from '@reduxjs/toolkit'
import { activityTypes } from '../../types/activityTypes';

const initialState = {
    active: activityTypes.inicio,
}

export const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        onChangeActive: (state, {payload}) => {
            state.active = payload
        },
    },
});

export const { onChangeActive } = activitySlice.actions