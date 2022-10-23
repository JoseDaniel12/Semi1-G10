import { Avatar, Box, Grid, IconButton } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

import { useState, useEffect } from 'react';
import {
  getNoAmigos, getEnviadas,
  getRecibidas, getAmigos,
  enviarSolicitud, aceptarSolicitud,
  rechazarSolicitud
} from "../../../endpoints/amigos";
import { useAuthStore } from "../../../../hooks/useAuthStore";

export const Inicio = () => {
  const [estado, setEstado] = useState(0);

  const [usuarios, setUsuarios] = useState([]);
  const [noAmigos, setNoAmigos] = useState([]);
  const [enviadas, setEnviadas] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [amigos, setAmigos] = useState([]);

  const { user } = useAuthStore();

  useEffect(() => {
    getNoAmigos(user).then((response) => {
      console.log("esto recibio", response.data);
      setNoAmigos(response.data);
      setUsuarios(response.data);
    });

    getEnviadas(user).then((response) => {
      console.log("esto recibio", response.data);
      setEnviadas(response.data);
    });

    getRecibidas(user).then((response) => {
      console.log("esto recibio", response.data);
      setRecibidas(response.data);
    });

    getAmigos(user).then((response) => {
      console.log("esto recibio", response.data);
      setAmigos(response.data);
    });

  }, [])

  function cambiarEstado(estadoo) {
    setEstado(estadoo);
    if (estadoo === 0) {
      setUsuarios(noAmigos);
    } else if (estadoo === 1) {
      setUsuarios(enviadas);
    } else if (estadoo === 2) {
      setUsuarios(amigos);
    }
  }

  function EnviarSolicitud(destino) {
    enviarSolicitud(destino).then((response) => {
      console.log("esto recibio", response.data);
      //setAmigos(response.data);
    });
  }

  function mostrarTitulos() {
    if (estado === 0) {
      return (
        <>
          <Typography variant="h5" component="div">
            Personas que quizás conozcas
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Agregar Amigos
          </Typography>
        </>
      )
    } else if (estado === 1) {
      return (
        <>
          <Typography variant="h5" component="div">
            Solicitudes de amistad
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Pendientes
          </Typography>
        </>
      )
    } else {
      return (
        <>
          <Typography variant="h5" component="div">
            Amigos
          </Typography>
        </>
      )
    }
  }

  return (
    <>
      <button onClick={() => cambiarEstado(0)}>Agregar Amigos</button>
      <button onClick={() => cambiarEstado(1)}>Ver Solicitudes</button>
      <button onClick={() => cambiarEstado(2)}>Ver Amigos</button>
      <Box>
        <Card sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            {mostrarTitulos()}
            <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="left">
              <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                <Card sx={{ display: 'flex', p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                      <Avatar src={``} sx={{ width: 56, height: 56 }} />
                      {
                        usuarios.map((usuario) =>
                          <>
                            {
                              <Box sx={{ ml: 3 }}>
                                <Typography variant="subtitle1" color="text.secondary" component="div">
                                  {usuario.nombre} - {usuario.correo}
                                </Typography>
                                <IconButton color="secondary" aria-label="delete">
                                  <CheckIcon />
                                </IconButton>
                                <IconButton color="error" aria-label="delete">
                                  <CancelIcon />
                                </IconButton>
                              </Box>
                            }
                          </>
                        )}

                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            {estado === 1 ?
              <>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Recibidas
                </Typography>
                <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="left">
                  <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                    <Card sx={{ display: 'flex', p: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                          <Avatar src={``} sx={{ width: 56, height: 56 }} />
                          {
                            recibidas.map((usuario) =>
                              <>
                                {
                                  <Box sx={{ ml: 3 }}>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                      {usuario.nombre} - {usuario.correo}
                                    </Typography>
                                    <IconButton color="secondary" aria-label="delete">
                                      <CheckIcon />
                                    </IconButton>
                                    <IconButton color="error" aria-label="delete">
                                      <CancelIcon />
                                    </IconButton>
                                  </Box>
                                }
                              </>
                            )}

                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </>
              :
              <></>
            }
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
