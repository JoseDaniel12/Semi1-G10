import { useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthPage } from "../components/auth/pages/AuthPage";
import { DashboardPage } from "../components/dashboard/pages/DashboardPage";
import { useAuthStore } from "../hooks/useAuthStore";
import { authTypes } from "../types/authTypes";

export const AppRouter = () => {

    const { status, startCheckAuth } = useAuthStore();

    useEffect(() => {
        startCheckAuth();
    }, [])
    
    if (status == authTypes.checking) {
        return <p>Cargando...</p>;
    }

    return (
        <Routes>
            {
                (status == authTypes.notLogged)
                ? (
                    <>
                    <Route path="/auth" element={ <AuthPage />} />
                    <Route path="/*" element={ <Navigate to="/auth" /> } />
                    </>
                )
                : (
                    <>
                        <Route path="/" element={ <DashboardPage />} />
                        <Route path="/*" element={ <Navigate to="/" /> } />
                    </>
                )
            }
        </Routes>
    )
}
