import { Alert, TextField, Button, Grid, Typography, Fab } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useForm } from "react-hook-form";
import { useState, useCallback, useRef } from "react";
import {Buffer} from 'buffer';
import Webcam from "react-webcam";

export const RegisterForm = () => {

    const { startRegister } = useAuthStore();
    const { register, handleSubmit, formState: {errors} } = useForm();
    const webcamRef = useRef(null);
    const [errorPwd, setErrorPwd] = useState(false);
    const [errorFoto, setErrorFoto] = useState(false);
    const [usarWebcam, setUsarWebcam] = useState(false);
    const [previewFoto, setPreviewFoto] = useState('');

    const handleRegister = async(data) => {
        const { password, password2 } = data;

        if (password !== password2 ) return setErrorPwd(true);
        else setErrorPwd(false);

        if (previewFoto === '') return setErrorFoto(true);
        else setErrorFoto(false);

        if (data.foto.length == 0) {   
            const resImg = await fetch(previewFoto);
            const blob = await resImg.blob();
            
            const imgData = new File([blob], "foto.jpeg", {type: 'image/jpeg'});
            data.webcam = imgData;
        }
        
        startRegister(data);
    } 

    const showPhoto = (e) => {
        setPreviewFoto(URL.createObjectURL(e.target.files[0]));
    }

    const videoConstraints = {
        width: 300,
        height: 300,
        facingMode: "user"
    };
      
    const tomarFoto = useCallback(() => {
        const ss = webcamRef.current.getScreenshot();
        const data = ss.toString().replace(/^data:image\/jpg;base64,/, "");
        const buf = Buffer.from(data, 'base64');
        console.log({base64: buf});
        setPreviewFoto(webcamRef.current.getScreenshot());
        setUsarWebcam(false);
    }, [webcamRef]);

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
                        { ...register("password", { required: true, minLength: 6 }) }
                        label="Contraseña" variant="outlined" type="password" fullWidth
                        error={errors.password}
                        />
                        {errors.password && <Alert severity="error">Contraseña <strong>requerida con 6 caracteres minimo</strong></Alert>}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField 
                        { ...register("password2", { required: true, minLength: 6 }) }
                        label="Confirmar contraseña" variant="outlined" type="password" fullWidth
                        error={errors.password}
                        />
                        {errors.password2 && <Alert severity="error">Confirmación <strong>requerida</strong></Alert>}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                    <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                        Subir imagen
                        <input
                            { ...register('foto', { onChange: showPhoto}) }
                            type="file" accept="image/png, image/jpeg, image/jpg" hidden  />
                    </Button>
                    <Button variant="outlined" component="label" sx={{ ml: 2, mb: 1 }} onClick={() => setUsarWebcam(!usarWebcam)}>
                        Tomar foto
                    </Button>
                    
                    {usarWebcam && (
                        <>
                            <Webcam
                                audio={false}
                                height={300}
                                width={300}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                ref={webcamRef}
                                />
                            <Fab color="primary" aria-label="add" onClick={tomarFoto} sx={{ mb: 0, mt: -10 }}>
                                <PhotoCamera  />
                            </Fab>
                        </>
                    )}
                    
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
                    {
                        (errorFoto) && <Alert severity="error">La foto es <strong>obligatoria</strong></Alert>
                    }
                    <Button variant="contained" type="submit" fullWidth>Registrar</Button>
                </Grid>
            </Grid>
        </form>
    ) 
}
