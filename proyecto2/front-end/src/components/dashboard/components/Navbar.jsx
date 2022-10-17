import { AppBar, IconButton, Toolbar, Typography, Grid } from "@mui/material"
import { MenuOutlined, LogoutOutlined } from '@mui/icons-material';

export const Navbar = ({drawerWidth, handleDrawerToggle}) => {

    return (
        <AppBar
            position="fixed"
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuOutlined />
                </IconButton>
                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6' noWrap component='div'>uLink</Typography>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
