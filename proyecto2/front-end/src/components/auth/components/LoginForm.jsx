import { Alert, TextField, Button, Grid, Divider, Typography, CircularProgress, LinearProgress } from "@mui/material";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useForm } from "react-hook-form";
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import {Buffer} from 'buffer';

export const LoginForm = () => {

    const { startLogin, startFaceID } = useAuthStore();
    const { register, handleSubmit, formState: {errors}, getValues } = useForm();
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

    const handleFaceID = (e) => {
        if (!usarWebcam) {
            setUsarWebcam(!usarWebcam);

            // Esperar dos y medio segundos
            setTimeout(() => {
                const ss = webcamRef.current.getScreenshot();
                const dataBase64 = ss.toString().replace("data:image/jpeg;base64,", "");

                startFaceID({ usuario: getValues('usuario'), fotoWebcam: dataBase64 });
            }, 2500);
        }
    }

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
                <Button type="button" onClick={handleFaceID} variant="outlined" fullWidth sx={{ mt: 2, mb: 1 }} endIcon={<PhotoCameraFrontIcon />}>Utilizar faceID </Button>
                {usarWebcam ? 
                    (
                        <Grid container textAlign="center" alignItems="center" justifyContent="center">
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Webcam
                                    audio={false}
                                    height={200}
                                    width={200}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    ref={webcamRef}
                                    style={{ 'marginBottom': '10px' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='subtitle2' sx={{ mb: 2 }}>Verificando rostro... <LinearProgress style={{ width: '40%', margin:"0 auto" }}  color="inherit" /></Typography>
                            </Grid>
                        </Grid>
                    ):
                    (
                        <>
                            <Typography variant='subtitle2'>O</Typography>
                            <Grid item xs={12} sx={{ mt: 1, mb: 2 }}>
                                <TextField 
                                    { ...register("password", { required: true }) }
                                    label="Contraseña" variant="outlined" type="password" fullWidth 
                                    error={errors.password}
                                    />
                                    {errors.password && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}
                            </Grid>
                        </>
                    )
                }

            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {!usarWebcam &&
                        <Button type="submit" variant="contained">Ingresar</Button>
                    }
                </Grid>
            </Grid>
        </form>
    ) 
}
