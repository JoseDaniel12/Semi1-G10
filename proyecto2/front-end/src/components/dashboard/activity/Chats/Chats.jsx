import { Avatar, Box, CardHeader, CardMedia, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import io from "socket.io-client";
import { Chat, MessageSharp } from "@mui/icons-material";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");


const Chats = ({room}) => {
  const styles={
    imgChat: {
      backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)'
    }
  }

  const [amigos, setAmigos] = useState([]);
  const [amigo, setAmigo] = useState(-1);

  const [messages, setContentMessages] = useState([]);
  const [contetMessage, setContentMessage] = useState("");

  const handleContentMessage = (event) => {
    setContentMessage(event.target.value);
  }
  
  const sendMessage = () => {
    const message = {
      contenido: contetMessage,
      id_usuario: 1,
      id_amigo: amigo.id
    }
    socket.emit("sending_message", {message, room});
    setContentMessages([...messages, message]);
    setContentMessage("");
  }

  useEffect(() => {
    // Conectarse a la sala con un amigo
    socket.emit("joining_room", `${1}-${amigo.id}`);

    // Escuchar si el amigo ha enviado algun mensaje
    socket.on("relaying_message", m => {
      setContentMessages([...messages, message]);
    });
  }, [socket])

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

                      <input 
                        name="message"
                        type="text" 
                        placeholder="Escribe tu mensaje..."
                        onChange={handleContentMessage}
                      />

                      <button onClick={sendMessage}>
                        send
                      </button>
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


export default Chats;