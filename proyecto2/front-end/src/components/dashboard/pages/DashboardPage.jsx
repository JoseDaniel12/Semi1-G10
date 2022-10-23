import { AddOutlined } from "@mui/icons-material";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useActivityStore } from "../../../hooks/useActivityStore";
import { activityTypes } from "../../../types/activityTypes";
import { AgregarAmigo, ArchivosUsuario, EditarArchivo, EliminarArchivo, SubirArchivo, VerArchivos } from "../activity";
import  Chats  from "../activity/Chats/Chats";
import { EditarCuenta } from "../activity/EditarCuenta/EditarCuenta";
import { Inicio } from "../activity/Inicio/Inicio";
import { Publicaciones } from "../activity/Publicaciones/Publicaciones";
import { DashboardLayout } from "../layout/DashboardLayout";

export const DashboardPage = () => {

    const { active } = useActivityStore();

    const renderActivity = () => {
        switch(active) {
            case activityTypes.inicio:
                return <Inicio />
            case activityTypes.publicaciones:
                return <Publicaciones />
            case activityTypes.chat:
                return <Chats />
            case activityTypes.editarCuenta:
                return <EditarCuenta />
        }
    }

    return (
        <DashboardLayout>
            { renderActivity() }
        </DashboardLayout>
    )
}
