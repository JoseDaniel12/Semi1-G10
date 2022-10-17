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

import people from '../../../../assets/people.jpg';
import { useState } from "react";

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nueva publicación
          </Typography>
          <br />
          <Fab variant="extended" color="primary" component="label" aria-label="add" sx={{ mb: 1 }}>
            <AddAPhotoIcon sx={{ mr: 1 }} />
            Subir foto
            <input type="file" accept="image/png, image/jpeg, image/jpg" hidden  />
          </Fab>
          <br />
          <img className="foto-preview" src={people} width="330" height="250"/>
          <TextField 
            label="Descripción" variant="outlined" type="text" fullWidth sx={{ mt: 2 }} />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>Publicar</Button>
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
                  select
                  multiple
                  label="Elegir filtro"
                  size="small"
                  helperText="Filtra las publicaciones"
                  sx={{ ml: 2 }}
                >
                  <MenuItem value={1}>
                    {1}
                  </MenuItem>
                  <MenuItem value={2}>
                    {2}
                  </MenuItem>
                </TextField>
              </Typography>
              <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={6} lg={6} sx={{ p: 2 }}>
                  <Card sx={{ maxWidth: 445 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                          R
                        </Avatar>
                      }
                      title="Titulo publi"
                      subheader="September 14, 2016"
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={people}
                      alt="Img"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        This impressive paella is a perfect party dish and a fun meal to cook
                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                        if you like.
                      </Typography>
                      <Button>Traducir...</Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ p: 2 }}>
                  <Card sx={{ maxWidth: 445 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                          R
                        </Avatar>
                      }
                      title="Titulo publi"
                      subheader="September 14, 2016"
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={people}
                      alt="Img"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        This impressive paella is a perfect party dish and a fun meal to cook
                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                        if you like.
                      </Typography>
                      <Button>Traducir...</Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
      </Box>
    </>
  )
}
