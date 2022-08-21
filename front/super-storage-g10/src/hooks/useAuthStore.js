import { useSelector, useDispatch } from "react-redux";
import { onChecking, onLogin, onLogout } from "../store/auth/authSlice";

export const useAuthStore = () => {

    const dispatch = useDispatch();
    const { status, user, error } = useSelector(state => state.auth);

    const startLogin = () => {
        dispatch(onChecking());

        const user = { name: 'Jeff', id: 123 };
        localStorage.setItem('user', JSON.stringify(user));

        dispatch(onLogin(user));
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    }

    const startCheckAuth = () => {
        dispatch(onChecking());

        setTimeout(() => {
            const user = localStorage.getItem('user');
            if (!user) return startLogout();

            dispatch(onLogin(JSON.parse(user)));
        }, 1000)
    }

    return {
        status,
        user,
        error,

        startCheckAuth,
        startLogin,
        startLogout,
    }
}
