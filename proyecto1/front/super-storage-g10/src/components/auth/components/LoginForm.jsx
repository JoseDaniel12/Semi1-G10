import { Alert, TextField, Button, Grid } from "@mui/material";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useForm } from "react-hook-form";

export const LoginForm = () => {

    const { startLogin } = useAuthStore();
    const { register, handleSubmit, formState: {errors} } = useForm();

    const handleLogin = (data) => {
        startLogin(data);
    } 

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="animate__animated animate__fadeIn">
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <TextField
                        { ...register("usuario", { required: true }) }
                        label="Usuario" variant="outlined" type="text" fullWidth
                        error={errors.usuario}
                        />
                        {errors.usuario && <Alert severity="error">Usuario <strong>requerido</strong></Alert>}   
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                    <TextField 
                        { ...register("password", { required: true }) }
                        label="Contraseña" variant="outlined" type="password" fullWidth 
                        error={errors.password}
                        />
                        {errors.password && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}
                </Grid>
            </Grid>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>Ingresar</Button>
                </Grid>
            </Grid>
        </form>
    ) 
}
