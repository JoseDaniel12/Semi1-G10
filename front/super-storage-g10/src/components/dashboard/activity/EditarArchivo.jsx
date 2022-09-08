import { Alert, Button, Card, Divider, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography, Box, IconButton, CardMedia, CardActions, InputLabel, Select, MenuItem } from "@mui/material"
import { useForm } from "react-hook-form";
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useEffect } from "react";

export const EditarArchivo = () => {

    const { register, handleSubmit, formState: {errors} } = useForm()
    const { user } = useAuthStore();
    const { privados, publicos, startArchivosUsuario, startEditarArchivo } = useStorageStore();
    
    useEffect(() => {
        startArchivosUsuario();
    }, [])

    const handleNuevo = (data) => {
        startEditarArchivo(data);
    }

    const substringNombre = (valor) => {
        return valor.substring((user.id.toString() + "/").length, valor.length)
    }

    return (
        <form onSubmit={handleSubmit(handleNuevo)}>
            <Typography variant="h5"><FolderDeleteIcon sx={{ mt: 1 }} /> Editar archivo</Typography>
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
                    <Divider />
                    <br/>
                    <TextField
                        fullWidth
                        { ...register("nombre", { required: true }) }
                        label="Nombre:" variant="outlined" type="text"
                        error={errors.nombre}
                        />
                        {errors.nombre && <Alert severity="error">Nombre <strong>requerido</strong></Alert>}
                    <br/>
                    <FormControl 
                        sx={{ mt: 2 }}
                        >
                        <FormLabel>Tipo</FormLabel>
                        <RadioGroup row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            defaultValue="1"
                            { ...register("tipo") }
                            >
                            <FormControlLabel { ...register("tipo") } value="1" control={<Radio />} label="Publico" />
                            <FormControlLabel { ...register("tipo") } value="0" control={<Radio />} label="Privado" />
                        </RadioGroup>
                    </FormControl>
                    <br/>
                    <Divider sx={{ mt: 2 }} />
                    <br/>
                    <TextField
                        { ...register("password", { required: true }) }
                        label="Contraseña:" variant="outlined" type="text"
                        error={errors.password}
                        />
                        {errors.password && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}

                    <br/><br/>
                    <Button variant="contained" sx={{ mr: 2 }}>Cancelar</Button>
                    <Button type="submit"  variant="contained">Editar</Button>
                </Grid>
            </Grid>
        </form>
    )
}
