import { Avatar, Box, CardHeader, CardMedia, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import io from "socket.io-client";
import { useEffect, useState, useRef  } from "react";
import { useAuthStore } from "../../../../hooks/useAuthStore";
import storageApi from "../../../../api/storageApi";

const socket = io.connect("http://localhost:9000");


const Chats = () => {
  const {user} = useAuthStore();

  const [room, setRoom] = useState('');

  const [idUsuario, setIdUsuario] = useState(-1);
  const [amigos, setAmigos] = useState([]);
  const [amigo, setAmigo] = useState(null);

  const [messages, setMessages] = useState([]);
  const [contetMessage, setContentMessage] = useState("");

  // Escuchar si el amigo ha enviado algun mensaje
  socket.on("relaying_message", m => {
    setMessages([...messages, m]);
  });

  const handleContentMessage = (event) => {
    setContentMessage(event.target.value);
  }
  
  const sendMessage = () => {
    const m = {
      contenido: contetMessage,
      id_usuario: idUsuario,
      id_amigo: amigo.id_usuario
    }
    socket.emit("sending_message", {m, room});
    setMessages([...messages, m]);
    setContentMessage("");
  }

  const handleFriend = async (amigo) => {
    setAmigo(amigo);

    // Conectarse a la sala con un amigo
    const ids = [idUsuario, amigo.id_usuario].sort()
    const r =  `${ids[0]}-${ids[1]}`;
    setRoom(r);
    socket.emit("joining_room", r);

    // Se obtiene los mensajes con el amigo
    const res = await storageApi.post('chat/mensajes', {id_usuario: idUsuario, id_amigo: amigo.id_usuario});
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
                      amigos.map((amigo, i) => (
                        <Card key={i}>
                          <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: '#1c54b2' }} aria-label="recipe">
                                F
                              </Avatar>
                            }
                            title={amigo.usuario}
                            onClick={() => handleFriend(amigo)}
                          />
                        </Card>
                      ))
                    }
                  </Card>
                </Grid>

                <Grid item xs={12} lg={9} sx={{ p: 2 }}>

                  {
                    amigo === null ? <div></div> : 
                    <Card sx={{ maxWidth: 'auto' }}>

                      <section className="chat">
                        <div className="header-chat">
                          <p className="name">{amigo.usuario}</p>
                        </div>

                        <div className="messages-chat">
                          {
                            messages.map((m, i) => (
                              <div className="message" key={i}>
                                <div className={m.id_usuario === idUsuario? "message": "response"}>
                                  <p className="text">{m.contenido}</p>
                                </div>
                              </div>
                            ))
                          }
                        </div>

                        <input 
                          value={contetMessage}
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
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
      </Box>
    </>
  )
}


export default Chats;