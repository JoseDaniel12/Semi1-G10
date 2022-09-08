import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import storageApi from "../api/storageApi";
import { onArchivosUsuario } from "../store/storage/storageSlice";
import { activityTypes } from "../types/activityTypes";
import { useActivityStore } from "./useActivityStore";

export const useStorageStore = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { publicos, privados } = useSelector(state => state.storage);
    const { startChange } = useActivityStore();

    const startSubirArchivo = async({nombre, password, tipo, archivo}) => {
        try {
            let formData = new FormData();
            formData.append("userId", user.id);
            formData.append("password", password);
            formData.append("file", archivo[0]);
            formData.append("fileName", nombre);
            formData.append("visibility", parseInt(tipo));

            const config = { headers: { 'content-type': 'multipart/form-data' } }
            const { data } = await storageApi.post("archivos/subirArchivo", formData, config);
            
            Swal.fire({
                icon: 'success',
                title: 'Archivo subido',
                confirmButtonColor: '#006064',
            });
            startChange(activityTypes.misArchivos);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al subir el archivo',
                text: 'El archivo esta duplicado o contraseña incorrecta',
                confirmButtonColor: '#006064',
            });
        }
    }

    const startBorrarArchivo = async({archivo, password}) => {
        try {
            const body = { "userId": user.id, "password": password, "fileName": archivo };
            const { data } = await storageApi.delete("archivos/borrarArchivo", {data: body});

            Swal.fire({
                icon: 'success',
                title: 'Archivo eliminado',
                confirmButtonColor: '#006064',
            });
            startChange(activityTypes.misArchivos);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el archivo',
                text: 'Contraseña incorrecta',
                confirmButtonColor: '#006064',
            });
        }
    }

    const startEditarArchivo = async({archivo, password, nombre, tipo}) => {
        try {
            let formData = new FormData();
            formData.append("userId", user.id);
            formData.append("password", password);
            formData.append("fileNameOriginal", archivo);
            formData.append("fileNameDestino", nombre);
            formData.append("visibilidad", parseInt(tipo));

            console.log(archivo, password, tipo, nombre)

            // const config = { headers: { 'content-type': 'multipart/form-data' } }
            // const { data } = await storageApi.put("archivos/editarArchivo", formData, config);
            
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Archivo editado',
            //     confirmButtonColor: '#006064',
            // });
            // startChange(activityTypes.misArchivos);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al editar el archivo',
                text: 'Contraseña incorrecta',
                confirmButtonColor: '#006064',
            });
        }
    }


    const startArchivosUsuario = async() => {
        try {
            const body = { "userId": user.id };
            const { data } = await storageApi.post('allFiles', body);
            
            const publicos = data.archivos.filter(archivo => archivo.visibilidad == 1);
            const privados = data.archivos.filter(archivo => archivo.visibilidad == 0);

            dispatch(onArchivosUsuario({publicos, privados}));
            
        } catch (error) {
            console.log(error);
        }
    }

    const startPersonasDisponibles = async() => {
        try {
            const { data } = await storageApi.get('amigos/personas-disponibles', { params: { userId: user.id } });
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    }

    return {
        publicos,
        privados,

        startSubirArchivo,
        startBorrarArchivo,
        startArchivosUsuario,
        startPersonasDisponibles,
        startEditarArchivo,
    }
}
