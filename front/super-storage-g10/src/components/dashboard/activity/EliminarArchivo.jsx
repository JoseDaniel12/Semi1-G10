import { Alert, Button, Card, Divider, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography, Box, IconButton, CardMedia, CardActions, InputLabel, Select, MenuItem } from "@mui/material"
import { useForm } from "react-hook-form";
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useEffect } from "react";
import { useAuthStore } from "../../../hooks/useAuthStore";

export const EliminarArchivo = () => {

    const { register, handleSubmit, formState: {errors} } = useForm();
    const { user } = useAuthStore();
    const { privados, publicos, startArchivosUsuario, startBorrarArchivo } = useStorageStore();
    
    useEffect(() => {
        startArchivosUsuario();
    }, [])

    const handleNuevo = (data) => {
        startBorrarArchivo(data);
    }

    const substringNombre = (valor) => {
        return valor.substring((user.id.toString() + "/").length, valor.length)
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
                            {
                                publicos.map(archivo => (
                                    <MenuItem key={archivo} value={substringNombre(archivo.s3_key)}>{substringNombre(archivo.s3_key)}</MenuItem>
                                ))
                            }
                            {
                                privados.map(archivo => (
                                    <MenuItem key={archivo} value={substringNombre(archivo.s3_key)}>{substringNombre(archivo.s3_key)}</MenuItem>
                                ))
                            }
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
