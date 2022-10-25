import { Controller, useForm } from "react-hook-form";
import { useAuthStore } from "../../../../hooks/useAuthStore"
import { Alert, TextField, Button, Grid, Typography, Fab, Divider } from "@mui/material";
import { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const EditarCuenta = () => {

  const { user, startEdit } = useAuthStore();
  const { register, handleSubmit, control, formState: {errors} } = useForm({
    defaultValues: {
      modo_bot: user.modo_bot,
      nombre: user.name,
    }
  });
  const [previewFoto, setPreviewFoto] = useState('');

  const showPhoto = (e) => {
    setPreviewFoto(URL.createObjectURL(e.target.files[0]));
  }

  const handleEdit = async (data) => {
    startEdit(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleEdit)}>
        <div><b>Editar datos de tu cuenta:</b></div>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={6} sx={{ p: 1 }}>
            <Grid item xs={12}>
                <TextField 
                    { ...register("nombre", { required: true }) }
                    label="Nombre completo" variant="outlined" fullWidth
                    error={errors.nombre}
                    />
                    {errors.nombre && <Alert severity="error">Nombre <strong>requerido</strong></Alert>}   
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Modo bot</FormLabel>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="modo_bot"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="Activado" />
                      <FormControlLabel value="0" control={<Radio />} label="Desactivado" />
                    </RadioGroup>
                  )}
                  />
              </FormControl> 
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    { ...register("pwd", { required: true }) }
                    label="Contraseña" variant="outlined" type="password" fullWidth
                    sx={{ mt: 1 }}
                    error={errors.pwd}
                    />
                    {errors.pwd && <Alert severity="error">Contraseña <strong>requerida</strong></Alert>}   
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" type="submit" sx={{ mb: 1, mt: 2 }}>
                Actualizar datos
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12} sx={{ mb: 2 }} alignItems="center" justifyContent='center' textAlign='center'>
              {(previewFoto !== "") && <img className="foto-perfil" src={previewFoto} width="150" height="150" style={{ marginBottom: '1px' }} /> }
              <br />
              <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                  Cambiar foto de perfil
                  <input
                      { ...register('foto', { onChange: showPhoto }) }
                      type="file" accept="image/png, image/jpeg, image/jpg" hidden  />
              </Button>
            </Grid>
            <Divider />
          </Grid>
        </Grid>
      </form>
      
    </>
  )
}
