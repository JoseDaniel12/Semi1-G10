import { Alert, Button, Card, Divider, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography, Box, IconButton, CardMedia, CardActions, InputLabel, Select, MenuItem } from "@mui/material"
import { useForm } from "react-hook-form";
import { useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { useStorageStore } from "../../../hooks/useStorageStore";

export const EliminarArchivo = () => {

    const { register, handleSubmit, formState: {errors} } = useForm()
    const { startBorrarArchivo } = useStorageStore();

    const handleNuevo = (data) => {
        startBorrarArchivo(data);
    }

    return (
        <form onSubmit={handleSubmit(handleNuevo)}>
            <Typography variant="h5"><FolderDeleteIcon sx={{ mt: 1 }} /> Eliminar archivo</Typography>
            <br/>
            <Grid container>
                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-label">Seleccionar archivo</InputLabel>
                        <Select
                            labelId="select-label"
                            id="simple-select"
                            label="Seleccionar archivo"
                            { ...register("archivo", { required: true }) }
                        >
                            <MenuItem value={'tareaprivada.png'}>1 tarea privada</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                        </Select>
                    </FormControl>
                    {errors.archivo && <Alert severity="error">Archivo <strong>requerido</strong></Alert>}
                    <Divider/>
                    <br/>
                    <TextField
                        { ...register("password", { required: true }) }
                        label="Contraseña:" variant="outlined" type="text"
                        error={errors.password}
                        />
                        {errors.password && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}

                    <br/><br/>
                    <Button variant="contained" sx={{ mr: 2 }}>Cancelar</Button>
                    <Button type="submit"  variant="contained">Eliminar</Button>
                </Grid>
            </Grid>
        </form>
    )
}
