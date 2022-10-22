import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import storageApi from "../api/storageApi";
import { onChecking, onLogin, onLogout } from "../store/auth/authSlice";

export const useAuthStore = () => {

    const dispatch = useDispatch();
    const { status, user, error } = useSelector(state => state.auth);

    const startLogin = async({ usuario, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await storageApi.post('login', { "usuario_correo": usuario, "contrasenia": password });
            
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(onLogin(data));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Credenciales incorrectas',
                text: 'Usuario y contraseña no concuerdan',
                confirmButtonColor: '#006064',
            });
            dispatch(onLogout());
        }
    }

    const startRegister = async({nombre, usuario, email, password, foto, webcam}) => {
        dispatch(onChecking());

        try {
            let formData = new FormData();
            formData.append("nombre", nombre);
            formData.append("usuario", usuario);
            formData.append("correo", email);
            formData.append("foto", foto[0]);
            formData.append("contrasenia", password);
            formData.append("webcam", webcam);

            const config = { headers: { 'content-type': 'multipart/form-data' } }
            const { data } = await storageApi.post("registrar", formData, config);

            localStorage.setItem('user', JSON.stringify(data));
            dispatch(onLogin(data));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registro incorrecto',
                text: 'El usuario o correo ya existe',
                confirmButtonColor: '#006064',
            });
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    }

    const startCheckAuth = () => {
        dispatch(onChecking());

        const user = localStorage.getItem('user');
        if (!user) return startLogout();

        dispatch(onLogin(JSON.parse(user)));
    }

    return {
        status,
        user,
        error,

        startCheckAuth,
        startLogin,
        startLogout,
        startRegister,
    }
}
