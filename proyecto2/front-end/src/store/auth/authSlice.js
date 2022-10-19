import { createSlice } from '@reduxjs/toolkit'
import { authTypes } from '../../types/authTypes';

const initialState = {
    status: authTypes.checking,
    user: {},
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        onChecking: (state) => {
            state.status = authTypes.checking;
            state.user = {};
            state.error = null;
        },
        onLogin: (state, {payload}) => {
            state.status = authTypes.logged;
            state.user = payload;
            state.error = null;
        },
        onLogout: (state, {payload}) => {
            state.status = authTypes.notLogged;
            state.user = {};
            state.error = payload || null;
        },
        onClearError: (state) => {
            state.error = null;
        }
    },
})

export const { 
    onChecking,
    onClearError,
    onLogin,
    onLogout,

} = authSlice.actions  