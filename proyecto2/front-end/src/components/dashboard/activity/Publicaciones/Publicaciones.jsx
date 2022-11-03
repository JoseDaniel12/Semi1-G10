import { Avatar, Box, CardHeader, CardMedia, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import storageApi from "../../../../api/storageApi";

import people from '../../../../assets/people.jpg';
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export const Publicaciones = () => {

  const [open, setOpen] = useState(false);
  const [etiquetas, setEtiquetas] = useState([{texto_etiqueta: "*"}]);
  const [pubs, setPubs] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { register, handleSubmit, formState: {errors}, getValues } = useForm();

  const traerTodasLasPubs = async() => {
    const kog_obj = { "kog": JSON.parse(localStorage.getItem("user")).uid };
    let { data } = await storageApi.post("publicaciones/usuario", kog_obj);
    const parámetros = { usuario: data.id };
    let resp = await storageApi.post("publicaciones/publicaciones", parámetros);
    setPubs(resp.data);
    console.log(resp.data);
}

  const traerLasPubsConEtiqueta = async(etiqueta) => {
    const kog_obj = { "kog": JSON.parse(localStorage.getItem("user")).uid };
    let { data } = await storageApi.post("publicaciones/usuario", kog_obj);
    const parámetros = { usuario: data.id, etiqueta: etiqueta };
    let resp = await storageApi.post("publicaciones/publicaciones-etiqueta", parámetros);
    setPubs(resp.data);
    console.log(resp.data);
}

  const filtrarPubs = async(e) => {
    console.log(JSON.stringify(e.target));
    const elegida = e.target.value;
    if (elegida == "*") {
      traerTodasLasPubs();
    } else {
      traerLasPubsConEtiqueta(elegida);
    }
  }

  const traerEtiquetas = async() => {
    const { data } = await storageApi.get("publicaciones/etiquetas");
    setEtiquetas(data);
  }

  useEffect(() => {
    traerEtiquetas();
    traerTodasLasPubs();
  }, []);

  const startSubirImágen = async({imágen, texto}) => {
    try {
        let formData = new FormData();
        const kog_obj = { "kog": JSON.parse(localStorage.getItem("user")).uid };
        const { data } = await storageApi.post("publicaciones/usuario", kog_obj);
        formData.append("usuario", data.id);
        formData.append("texto", texto);
        formData.append("imagen", imágen[0]);
        const config = { headers: { 'content-type': 'multipart/form-data' } }
        let resp = await storageApi.post("publicaciones/publicar", formData, config);
        setOpen(false);
        traerTodasLasPubs();
        traerEtiquetas();

    } catch (error) {
        console.log(JSON.stringify(error));
        Swal.fire({
            icon: 'error',
            title: 'Error al subir imágen. Espere unos minutos y vuelva a intentarlo.',
            text: 'El usuario o correo ya existe',
            confirmButtonColor: '#006064',
        });
    }
}

  const handleSubirImágen = (data) => {
    console.log(JSON.stringify(data));
    setOpen(false);
    startSubirImágen(data);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form onSubmit={handleSubmit(handleSubirImágen)}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nueva publicación
          </Typography>
          <br />
          <Fab variant="extended" color="primary" component="label" aria-label="add" sx={{ mb: 1 }}>
            <AddAPhotoIcon sx={{ mr: 1 }} />
            Subir foto
            <input type="file" accept="image/png, image/jpeg, image/jpg" hidden  { ...register("imágen", { required: true }) } />
          </Fab>
          <br />
          <img className="foto-preview" src={people} width="330" height="250"/>
          <TextField 
            { ...register("texto", { required: false }) }
            label="Descripción" variant="outlined" type="text" fullWidth sx={{ mt: 2 }} />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>Publicar</Button>
        </form>
        </Box>
      </Modal>

      <Box>
          <Card sx={{ minWidth: 275, mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Publicaciones
                <Fab sx={{ ml: 2 }} size="small" color="primary" aria-label="add" onClick={handleOpen}>
                  <AddIcon />
                </Fab>
                <TextField
                  { ...register("etiqueta", { onChange: filtrarPubs }) }
                  select
                  multiple
                  label="Elegir filtro"
                  size="small"
                  helperText="Filtra las publicaciones"
                  sx={{ ml: 2 }}
                >
                <MenuItem value="*">
                     *
                </MenuItem>
                {
                    (etiquetas.length > 0)
                    ?
                    (
                        etiquetas.map(eti => (
                          <MenuItem value={eti.texto_etiqueta}>
                            {eti.texto_etiqueta}
                          </MenuItem>
                       ))
                      )
                      : <MenuItem value="--">
                     *
                        </MenuItem>
                  }
                </TextField>
              </Typography>
              <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center">
              {
                 (pubs.length > 0)
                 ?
                 (
                   pubs.map(pub => (
                <Grid item xs={12} md={6} lg={6} sx={{ p: 2 }}>
                  <Card sx={{ maxWidth: 445 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                          { pub.usuario[0].toUpperCase() }
                        </Avatar>
                      }
                      title={ pub.usuario }
                      subheader={ pub["fecha_de_publicación"].replace("T", " ").replace("Z"," ") }
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={ "https://semi1-s3-bucket.s3.amazonaws.com/pubs/" + pub.s3_key }
                      alt="Img"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                          { pub.texto }
                      </Typography>
                      <Button>Traducir...</Button>
                    </CardContent>
                  </Card>
                </Grid>
                 ))
                 )
                 : ( <p>No hay nada que mostrar. :(</p> ) }
              </Grid>
            </CardContent>
          </Card>
      </Box>
    </>
  )
}
