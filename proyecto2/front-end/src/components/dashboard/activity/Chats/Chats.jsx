import { Avatar, Box, CardHeader, CardMedia, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const Chats = () => {

  const styles={
    imgChat: {
      backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)'
    }
  }


  return (
    <>
      <Box>
          <Card sx={{ minWidth: 275, mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Chats
              </Typography>

              <Grid container sx={{ mt: 2 }} alignItems="center" justifyContent="center">
                <Grid item xs={1} lg={3} sx={{ p: 2 }}>
                  <Card sx={{ maxWidth: 445 }}>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                            R
                          </Avatar>
                        }
                        title="Titulo publi"
                      />
                    </Card>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                            R
                          </Avatar>
                        }
                        title="Titulo publi"
                      />
                    </Card>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                            R
                          </Avatar>
                        }
                        title="Titulo publi"
                      />
                    </Card>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                            R
                          </Avatar>
                        }
                        title="Titulo publi"
                      />
                    </Card>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={9} sx={{ p: 2 }}>
                  <Card sx={{ maxWidth: 'auto' }}>
                    <section className="chat">
                      <div className="header-chat">
                        <p className="name">Joel Ramirez</p>
                      </div>
                      <div className="messages-chat">
                        <div className="message">
                          <div className="photo" style={styles.imgChat}>
                            <div className="online"></div>
                          </div>
                          <p className="text"> 1 </p>
                        </div>
                        <div className="message text-only">
                          <p className="text"> 2</p>
                        </div>
                        <div className="message text-only">
                          <div className="response">
                            <p className="text"> 3</p>
                          </div>
                        </div>
                        <div className="message text-only">
                          <div className="response">
                            <p className="text">4</p>
                          </div>
                        </div>
                        <div className="message">
                          <div className="photo" style={styles.imgChat}>
                            <div className="online"></div>
                          </div>
                          <p className="text">5</p>
                        </div>
                      </div>
                      <TextField 
                        label="Escribe tu mensaje..." variant="outlined" type="text" fullWidth sx={{ mt: 2 }} >
                        </TextField>
                    </section>
                  </Card>
                </Grid>
              </Grid>

            </CardContent>
          </Card>
      </Box>
    </>
  )
}