import { Alert, TextField, Button, Grid } from "@mui/material";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const RegisterForm = () => {

    const { startRegister } = useAuthStore();
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [errorPwd, setErrorPwd] = useState(false);
    const [previewFoto, setPreviewFoto] = useState('');

    const handleRegister = (data) => {
        const { password, password2 } = data;

        if (password !== password2 ) return setErrorPwd(true);
        else setErrorPwd(false);

        startRegister(data);
    } 

    const showPhoto = (e) => {
        setPreviewFoto(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <form onSubmit={handleSubmit(handleRegister)} className="animate__animated animate__fadeIn">
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <TextField 
                        { ...register("nombre", { required: true }) }
                        label="Nombre y apellidos" variant="outlined" fullWidth
                        error={errors.usuario}
                        />
                        {errors.usuario && <Alert severity="error">Nombre de usuario <strong>requerido</strong></Alert>}   
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField 
                        { ...register("usuario", { required: true }) }
                        label="Nombre de usuario" variant="outlined" fullWidth
                        error={errors.usuario}
                        />
                        {errors.usuario && <Alert severity="error">Nombre de usuario <strong>requerido</strong></Alert>}   
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField 
                        { ...register("email", { required: true }) }
                        label="Correo electrónico" variant="outlined" type="email" fullWidth
                        error={errors.email}
                        />
                        {errors.email && <Alert severity="error">Correo <strong>requerido</strong></Alert>}   
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField 
                        { ...register("password", { required: true }) }
                        label="Contraseña" variant="outlined" type="password" fullWidth
                        error={errors.password}
                        />
                        {errors.password && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField 
                        { ...register("password2", { required: true }) }
                        label="Confirmar contraseña" variant="outlined" type="password" fullWidth
                        error={errors.password}
                        />
                        {errors.password2 && <Alert severity="error">Confirmación <strong>requerida</strong></Alert>}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                    <Button variant="contained" component="label" sx={{ mb: 2 }}>
                        Subir foto
                        <input
                            { ...register('foto', { required: true, onChange: showPhoto}) }
                            type="file" accept="image/png, image/jpeg, image/jpg" hidden  />
                    </Button>
                    <br />
                    {(previewFoto !== "") && <img className="foto-perfil" src={previewFoto} width="150" height="150" /> }
                    {errors.foto && <Alert severity="error">Foto de perfil <strong>requerida</strong></Alert>}
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {
                        (errorPwd) && <Alert severity="error">Las contraseñas <strong>no</strong> coinciden</Alert>
                    }
                    <Button variant="contained" type="submit" fullWidth>Registrar</Button>
                </Grid>
            </Grid>
        </form>
    ) 
}
