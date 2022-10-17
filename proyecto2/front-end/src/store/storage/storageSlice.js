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
        onArchivosUsuario: (state, {payload}) => {
            state.publicos = payload.publicos;
            state.privados = payload.privados;
        },
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
    onArchivosUsuario,
    
} = storageSlice.actions