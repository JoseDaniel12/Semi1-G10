import { AddOutlined } from "@mui/icons-material";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActivityStore } from "../../../hooks/useActivityStore";
import { activityTypes } from "../../../types/activityTypes";
import { AgregarAmigo, ArchivosUsuario, EditarArchivo, EliminarArchivo, SubirArchivo, VerArchivos } from "../activity";
import { DashboardLayout } from "../layout/DashboardLayout";

export const DashboardPage = () => {

    const { active } = useActivityStore();

    const renderActivity = () => {
        switch(active) {
            case activityTypes.misArchivos:
                return <ArchivosUsuario />
            case activityTypes.subir:
                return <SubirArchivo />
            case activityTypes.editar:
                return <EditarArchivo />
            case activityTypes.eliminar:
                return <EliminarArchivo />
            case activityTypes.agregarAmigos:
                return <AgregarAmigo />
            case activityTypes.verArchivos:
                return <VerArchivos />
        }
    }

    return (
        <DashboardLayout>
            { renderActivity() }
        </DashboardLayout>
    )
}
