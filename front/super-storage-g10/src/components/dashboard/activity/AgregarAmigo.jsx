import { Grid, Paper, InputBase, IconButton } from "@mui/material"
import { UserCard } from "../components/UserCard";
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useEffect } from "react";
import { useState } from "react";

export const AgregarAmigo = () => {

    const [personas, setPersonas] = useState([]);
    const { startPersonasDisponibles, startAgregarPersona } = useStorageStore();

    const verPersonasDisponibles = () => {
        startPersonasDisponibles().then(data => setPersonas(data));
    }

    useEffect(() => {
        verPersonasDisponibles();
    }, []);

    const agregarAmigo = (persona) => {
        startAgregarPersona({ agregarUserID: persona.id }).then(data => verPersonasDisponibles());
    }

    return (
        <>
            <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center">
                {
                    personas.map(persona => (
                        <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }} key={persona.id}>
                            <UserCard persona={persona} agregarAmigo={agregarAmigo} />
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )
}
