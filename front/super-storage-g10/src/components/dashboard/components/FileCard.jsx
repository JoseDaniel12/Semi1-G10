import { Box, Card, CardContent, CardMedia, IconButton, Tooltip, Typography } from "@mui/material"
import FileOpenIcon from '@mui/icons-material/FileOpen';

export const FileCard = ({ archivo, idSbs, autor }) => {

    return (
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {archivo.s3_key.substring(idSbs, archivo.s3_key.length)}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {autor}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {archivo.fecha}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <Tooltip title="Abrir archivo">
                        <IconButton target="_blank" href={`https://archivos-g10-p1.s3.amazonaws.com/${archivo.s3_key}`}>
                            <FileOpenIcon sx={{ height: 30, width: 30 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 145 }}
                image="http://127.0.0.1:5173/src/assets/img-doc.jpg"
                alt="Imagen archivo"
            />
        </Card>
    )
}
