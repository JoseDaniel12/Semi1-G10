import { Box, Button, Card, CardContent, CardMedia, IconButton, Tooltip, Typography } from "@mui/material"
import FileOpenIcon from '@mui/icons-material/FileOpen';

export const FileCard = () => {
    return (
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                    Live From Space
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                    Mac Miller
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                    20/15/2022
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <Tooltip title="Abrir archivo">
                        <IconButton>
                            <FileOpenIcon sx={{ height: 30, width: 30 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image="https://img4.yna.co.kr/etc/inner/SP/2022/05/05/ASP20220505000300883_01_i_P4.jpg"
                alt="Live from space album cover"
            />
        </Card>
    )
}
