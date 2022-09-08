import { Box, Grid, Tab, Tabs, Typography, Paper, IconButton, InputBase } from "@mui/material"
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import SearchIcon from '@mui/icons-material/Search';

import { FileCard } from "../components/FileCard";
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useEffect } from "react";
import { useState } from "react";

export const VerArchivos = () => {

    const [archivosAmigos, setArchivosAmigos] = useState([]);
    const { startArchivosAmigos } = useStorageStore();

    useEffect(() => {
        startArchivosAmigos().then((data) => setArchivosAmigos(data));
    }, []);

    useEffect(() => {
        console.log(archivosAmigos);
    }, [archivosAmigos]);

    return (
        <>  
            <Grid container sx={{ mt: 2 }}>
                {
                    archivosAmigos.map(archivo => 
                        (
                            <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }} key={archivo.usuario + archivo.fecha}>
                                {<FileCard archivo={archivo} idSbs={(archivo.usuario.toString()+"/").length} autor={""} />}
                            </Grid>
                        )
                    )
                }
            </Grid>
        </>
    )
}
