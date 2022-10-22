import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useActivityStore } from "../../../hooks/useActivityStore";
import { activityTypes } from "../../../types/activityTypes";

export const SideBar = ({drawerWidth = 240, mobileOpen, handleDrawerToggle}) => {

    const { user, startLogout } = useAuthStore();
    const { startChange } = useActivityStore();

    const handleClickItem = (activity) => {
        startChange(activity);
        handleDrawerToggle();
    }

    const drawer = (
        <div>
            
            <Grid container
                justifyContent="center"
                textAlign="center"
                alignItems="center"
                >
                <Grid item xs={12}>
                    <br/>
                    <img className="foto-perfil" src={`https://archivos-g10-p1.s3.amazonaws.com/fotos/${user.id}.${user.formatoFoto}`} width="100" />
                    <Typography variant='h6' noWrap component='div'>{user.username}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {user.email}
                    </Typography>
                </Grid>
            </Grid>
            <br/>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleClickItem(activityTypes.inicio)}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Inicio"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleClickItem(activityTypes.publicaciones)}>
                        <ListItemIcon>
                            <BackupTableIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Publicaciones"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleClickItem(activityTypes.chat)}>
                        <ListItemIcon>
                            <ChatIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Chat"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleClickItem(activityTypes.editarCuenta)}>
                        <ListItemIcon>
                            <ManageAccountsIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Editar cuenta"} />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => startLogout()}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Cerrar sesión"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
                >
                {drawer}
            </Drawer>
        </Box>
    )
}
