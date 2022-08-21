import { useAuthStore } from "../../../hooks/useAuthStore"

export const DashboardPage = () => {

    const { status, user, startLogout } = useAuthStore();

    return (
        <>
            <div>DashboardPage</div>
            <button onClick={() => startLogout()}>Logout</button>
        </>
    )
}
