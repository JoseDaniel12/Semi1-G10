import { Alert, Button, Card, Divider, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography, Box, IconButton, CardMedia, CardActions } from "@mui/material"
import { useForm } from "react-hook-form";
import { useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { useStorageStore } from "../../../hooks/useStorageStore";

export const SubirArchivo = () => {

    const { register, handleSubmit, formState: {errors} } = useForm()
    const { startSubirArchivo } = useStorageStore();

    const [previewFile, setPreviewFile] = useState('');
    const [url, setURL] = useState('');
    const [esImagen, setEsImagen] = useState(false);

    const handleNuevo = (data) => {
        startSubirArchivo(data);
    }

    const showFile = (e) => {
        const url = document.getElementById('archivoID').value.replace("fakepath", "...");

        setURL(url);
        if (e.target.files[0].type !== "application/pdf" && e.target.files[0].type !== "text/plain") {
            setPreviewFile(URL.createObjectURL(e.target.files[0]))
            setEsImagen(true);
        } else {
            setEsImagen(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(handleNuevo)}>
            <Typography variant="h5"><UploadFileIcon sx={{ mt: 1 }} /> Nuevo archivo</Typography>
            <br/>
            <Grid container>
                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                    <TextField
                        { ...register("nombre", { required: true }) }
                        label="Nombre:" variant="outlined" type="text" fullWidth
                        error={errors.nombre}
                        />
                        {errors.nombre && <Alert severity="error">Nombre <strong>requerido</strong></Alert>}
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
                    <Divider/>
                    <br/>
                    <Button variant="contained" component="label" sx={{ mb: 2 }}>
                        Elegir archivo
                        <input
                            id="archivoID"
                            { ...register('archivo', { required: true, onChange: showFile }) }
                            type="file" accept="application/pdf, text/plain, image/png, image/png, image/jpeg, image/jpg" hidden  
                            />
                    </Button>
                    
                    {errors.archivo && <Alert severity="error">Archivo <strong>requerido</strong></Alert>}
                </Grid>
                <Grid item xs={12} md={6} sx={{ p: 1 }}>
                    {
                        (url !== '')
                        &&
                        (
                            <Card>
                                {
                                    (esImagen)
                                    ? (
                                        <CardMedia
                                            component="img"
                                            alt="archivo"
                                            height="140"
                                            image={previewFile}
                                        />
                                    )
                                    : (
                                        <>
                                            <StickyNote2Icon sx={{ mt: 2 }} /> <b>PDF / TXT</b>
                                        </>
                                    )
                                }
                                
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {url}
                                    </Typography>
                                    <br/>
                                    <TextField
                                        { ...register("password", { required: true }) }
                                        label="Contraseña:" variant="outlined" type="text"
                                        error={errors.password}
                                        />
                                        {errors.password && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Cancelar</Button>
                                    <Button type="submit" size="small">Subir</Button>
                                </CardActions>
                            </Card>
                        )
                    }
                </Grid>
            </Grid>
        </form>
    )
}
