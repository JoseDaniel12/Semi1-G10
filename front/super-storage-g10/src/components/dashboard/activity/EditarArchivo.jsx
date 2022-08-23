import { Alert, Button, Card, Divider, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography, Box, IconButton, CardMedia, CardActions, InputLabel, Select, MenuItem } from "@mui/material"
import { useForm } from "react-hook-form";
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';

export const EditarArchivo = () => {

    const { register, handleSubmit, formState: {errors} } = useForm()

    const handleNuevo = (data) => {
        console.log(data)
        console.log(data.archivo)
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
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
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
                            defaultValue="publico"
                            { ...register("tipo") }
                            >
                            <FormControlLabel { ...register("tipo") } value="publico" control={<Radio />} label="Publico" />
                            <FormControlLabel { ...register("tipo") } value="privado" control={<Radio />} label="Privado" />
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
