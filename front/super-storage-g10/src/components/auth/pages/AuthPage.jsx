import { useAuthStore } from "../../../hooks/useAuthStore"

export const AuthPage = () => {
    const { status, user, startLogin } = useAuthStore();

    return (
        <>
            <div>LoginPage</div>
            <button onClick={() => startLogin()}>Login</button>
        </>
    )
}
