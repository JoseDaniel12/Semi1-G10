import { Box, Grid, Tab, Tabs, Typography, Paper, IconButton, InputBase } from "@mui/material"
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import SearchIcon from '@mui/icons-material/Search';

import { FileCard } from "../components/FileCard";
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useEffect } from "react";

export const VerArchivos = () => {

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
                    <PlagiarismIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Buscar archivos"
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            {/* <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                    <FileCard />
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                    <FileCard />
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                    <FileCard />
                </Grid>
            </Grid> */}
        </>
    )
}
