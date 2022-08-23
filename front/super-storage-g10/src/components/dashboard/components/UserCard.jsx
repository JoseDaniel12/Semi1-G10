import { Avatar, Box, Button, Card, CardContent, CardMedia, IconButton, Tooltip, Typography } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export const UserCard = () => {
    return (
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <Avatar src="https://mui.com/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }} />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            Mac Miller
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            5 archivos
                        </Typography>
                    </Box>
                    <Button sx={{ ml: 4 }} size="small" variant="contained" endIcon={<PersonAddAlt1Icon />}>
                        Agregar
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}
