import { Avatar, Box, Button, Card, CardContent, CardMedia, IconButton, Tooltip, Typography } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export const UserCard = ({ persona, agregarAmigo }) => {
    return (
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <Avatar src={`https://archivos-g10-p1.s3.amazonaws.com/fotos/${persona.id}.${persona.formatofoto}`} sx={{ width: 56, height: 56 }} />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {persona.nombre_usuario}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {persona.archivos_publicos} archivos
                        </Typography>
                    </Box>
                    <Button onClick={() => agregarAmigo(persona)} sx={{ ml: 4 }} size="small" variant="contained" endIcon={<PersonAddAlt1Icon />}>
                        Agregar
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}
