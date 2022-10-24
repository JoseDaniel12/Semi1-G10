import { Avatar, Box, CardHeader, CardMedia, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../../hooks/useAuthStore";
import storageApi from "../../../../api/storageApi";

// const socket = io.connect("http://localhost:3001");


const Chats = ({room}) => {
  const {user} = useAuthStore();

  const [idUsuario, setIdUsuario] = useState(-1);
  const [amigos, setAmigos] = useState([]);
  const [idAmigo, setIdAmigo] = useState(-1);

  const [messages, setMessages] = useState([]);
  const [contetMessage, setContentMessage] = useState("");

  const handleContentMessage = (event) => {
    setContentMessage(event.target.value);
  }
  
  const sendMessage = () => {
    const m = {
      contenido: contetMessage,
      id_usuario: idUsuario,
      id_amigo: idAmigo
    }
    // socket.emit("sending_message", {message, room});
    setMessages([...messages, m]);
    setContentMessage("");
  }

  const handleFriend = async (id_amigo) => {
    setIdAmigo(id_amigo);
    const res = await storageApi.post('chat/mensajes', {id_usuario: idUsuario, id_amigo: id_amigo});
    setMessages(res.data);
  }

  const getUserId = async () => {
    let res = await storageApi.post('chat/id_usuario', {usuario: user.username});
    setIdUsuario(res.data.id_usuario);

    res = await storageApi.post('chat/amigos', {id_usuario: res.data.id_usuario});
    setAmigos(res.data.amigos);
  }


  useEffect(() => {
    // Obtner id de usuario logeado
    getUserId()


    // // Conectarse a la sala con un amigo
    // socket.emit("joining_room", `${idUsuario}-${amigo.id}`);

    // // Escuchar si el amigo ha enviado algun mensaje
    // socket.on("relaying_message", m => {
    //   setContentMessages([...messages, message]);
    // });
  }, [])

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
                    {
                      amigos.map(amigo => (
                        <Card key={amigo.id_usuario}>
                          <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                                F
                              </Avatar>
                            }
                            title={amigo.usuario}
                            onClick={() => handleFriend(amigo.id_usuario)}
                          />
                        </Card>
                      ))
                    }
                  </Card>
                </Grid>

                <Grid item xs={12} lg={9} sx={{ p: 2 }}>
                  <Card sx={{ maxWidth: 'auto' }}>

                    <section className="chat">
                      <div className="header-chat">
                        <p className="name">Joel Ramirez</p>
                      </div>

                      <div className="messages-chat">
                        {
                          messages.map(m => (
                            <div className="message" key={m.id_mensaje}>
                              <div className={m.id_usuario === idUsuario? "message": "response"}>
                                <p className="text">{m.contenido}</p>
                              </div>
                            </div>
                          ))
                        }
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