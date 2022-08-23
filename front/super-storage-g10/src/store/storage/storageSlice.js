import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    publicos: [],
    privados: [],
    amigos: [],
    amigos_archivos: [],
    cargando: false
}

export const storageSlice = createSlice({
    name: 'storage',
    initialState,
    reducers: {
        onSubirPublico: (state, {payload}) => {
            state.publicos.push(payload);
        },
        onSubirPrivado: (state, {payload}) => {
            state.privados.push(payload);
        },
    },
})

export const { 
    onSubirPrivado,
    onSubirPublico,
    
} = storageSlice.actions