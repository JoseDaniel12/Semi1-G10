import { Alert, TextField, Button, Grid, Divider, Typography, CircularProgress, LinearProgress } from "@mui/material";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useForm } from "react-hook-form";
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";

export const LoginForm = () => {

    const { startLogin } = useAuthStore();
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [usarWebcam, setUsarWebcam] = useState(false);

    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 200,
        height: 200,
        facingMode: "user"
    };
      
    const handleLogin = (data) => {
        startLogin(data);
    } 

    const tomarSS = async() => {
        const ss = webcamRef.current.getScreenshot();
        const resImg = await fetch(ss);
        const blob = await resImg.blob();
        
        const imgData = new File([blob], "foto.jpeg", {type: 'image/jpeg'});
    
        //startLoginWebcam();
        console.log(imgData);
    }

    useEffect(() => {
        if (usarWebcam) {
            tomarSS();
        }
    }, [usarWebcam]);

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="animate__animated animate__fadeIn">
            <Divider sx={{ mt: 2 }} />
            <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <TextField
                        { ...register("usuario", { required: true }) }
                        label="Usuario" variant="outlined" type="text" fullWidth
                        error={errors.usuario}
                        />
                        {errors.usuario && <Alert severity="error">Usuario <strong>requerido</strong></Alert>}   
                </Grid>
                <Button type="submit" onClick={() => setUsarWebcam(!usarWebcam)} variant="outlined" fullWidth sx={{ mt: 2, mb: 1 }} endIcon={<PhotoCameraFrontIcon />}>Utilizar faceID </Button>
                {usarWebcam && (
                    <>
                        <Webcam
                            audio={false}
                            height={200}
                            width={200}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            ref={webcamRef}
                            style={{ 'marginBottom': '10px' }}
                            />    
                        <Typography variant='subtitle2' sx={{ mb: 2 }}>Verificando rostro... <LinearProgress  color="inherit" /></Typography>
                    </>
                )}
                <Typography variant='subtitle2'>O</Typography>
                <Grid item xs={12} sx={{ mt: 1, mb: 2 }}>
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
                    <Button type="submit" variant="contained">Ingresar</Button>
                </Grid>
            </Grid>
        </form>
    ) 
}
