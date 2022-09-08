import { Grid, Paper, InputBase, IconButton } from "@mui/material"
import { UserCard } from "../components/UserCard";
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useEffect } from "react";

export const AgregarAmigo = () => {

    const { startPersonasDisponibles } = useStorageStore();

    useEffect(() => {
        startPersonasDisponibles();
    }, [])

    return (
        <>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <PersonSearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Buscar amigos"
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            {/* <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center">
                <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                    <UserCard />
                </Grid>
                <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                    <UserCard />
                </Grid>
                <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                    <UserCard />
                </Grid>
            </Grid> */}
        </>
    )
}
