import { Avatar, Box, Grid, IconButton } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

export const Inicio = () => {
  return (
    <>
      <Box>
          <Card sx={{ minWidth: 275, mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Solicitudes de amistad
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Pendientes
              </Typography>
              <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="left">
                <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                  <Card sx={{ display: 'flex', p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                          <Avatar src={``} sx={{ width: 56, height: 56 }} />
                          <Box sx={{ ml: 3 }}>
                              <Typography variant="subtitle1" color="text.secondary" component="div">
                                  {'Joel Ramirez Montenegro'}
                              </Typography>
                              <IconButton color="secondary" aria-label="delete">
                                <CheckIcon />
                              </IconButton>
                              <IconButton color="error" aria-label="delete">
                                <CancelIcon />
                              </IconButton>
                          </Box>
                        </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
      </Box>
      <Box>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Agregar amigos
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Usuarios sin agregar
            </Typography>
            <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="left">
              <Grid item xs={10} md={6} lg={4} sx={{ p: 2 }}>
                <Card sx={{ display: 'flex', p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        <Avatar src={``} sx={{ width: 56, height: 56 }} />
                        <Box sx={{ ml: 3 }}>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {'Joel Ramirez Montenegro'}
                            </Typography>
                            <Button sx={{ mt: 1 }} variant="outlined" size="small" startIcon={<PersonAddAlt1Icon />}>
                              Enviar solicitud
                            </Button>
                        </Box>
                      </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
