import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import storageApi from "../api/storageApi";
import { onChangeChecking, onChecking, onLogin, onLogout, onEdit } from "../store/auth/authSlice";

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

    const startEdit = async({nombre, modo_bot, pwd, foto}) => {
        dispatch(onChecking());

        try {
            let formData = new FormData();
            formData.append("subuser", user.uid);
            formData.append("usuario", user.username);
            formData.append("nombre", nombre);
            formData.append("modobot", modo_bot);
            formData.append("correo", user.email);
            formData.append("contrasenia", pwd)
            formData.append("foto", foto[0]);
      
            const config = { headers: { 'content-type': 'multipart/form-data' } }
            await storageApi.put("editar", formData, config);

            const userUpdate = { ...user };
            userUpdate.name = nombre;
            userUpdate.modo_bot = modo_bot;

            if (foto.length > 0) { userUpdate.ext_foto = foto[0].name.split(".")[1]; }

            localStorage.setItem('user', JSON.stringify(userUpdate));
            dispatch(onEdit(userUpdate));

            Swal.fire({
                icon: 'success',
                title: 'Datos actualizados',
                confirmButtonColor: '#006064',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: 'La contraseña es incorrecta',
                confirmButtonColor: '#006064',
            });

            localStorage.setItem('user', JSON.stringify(user));
            dispatch(onEdit(user));
            dispatch(onChangeChecking(1));
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
        startEdit,
    }
}
