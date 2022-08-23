import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import storageApi from "../api/storageApi";
import { onChecking, onLogin, onLogout } from "../store/auth/authSlice";

export const useStorageStore = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { publicos, privados } = useSelector(state => state.storage);

    const startSubirArchivo = async({nombre, password, tipo, archivo}) => {
        try {
            let formData = new FormData();
            formData.append("userId", user.id);
            formData.append("password", password);
            formData.append("file", archivo[0]);
            formData.append("fileName", nombre);
            formData.append("visibility", parseInt(tipo));

            const config = {     
                headers: { 'content-type': 'multipart/form-data' }
            }
            
            const { data } = await storageApi.post("archivos/subirArchivo", formData, config);
            console.log(data);

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
            const { data } = await storageApi.delete("archivos/borrarArchivo", 
                {"userId": user.id, password, "fileName": archivo});
            console.log(data);

        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el archivo',
                text: 'Contraseña incorrecta',
                confirmButtonColor: '#006064',
            });
        }
    }

    return {
        publicos,
        privados,

        startSubirArchivo,
        startBorrarArchivo,
    }
}
