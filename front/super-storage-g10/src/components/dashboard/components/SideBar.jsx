import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material"
import { InboxOutlined, MailOutline } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BackupTableIcon from '@mui/icons-material/BackupTable';

export const SideBar = ({drawerWidth = 240, mobileOpen, handleDrawerToggle}) => {

    const drawer = (
        <div>
            
            <Grid container
                justifyContent="center"
                textAlign="center"
                alignItems="center"
                >
                <Grid item xs={12}>
                    <br/>
                    <img className="foto-perfil" src="https://www.prensalibre.com/wp-content/uploads/2018/12/eb1911fd-fc8b-42ef-a0e8-43119bd17ac7.jpg" width="100" heigth="100" />
                    <Typography variant='h6' noWrap component='div'>Grupo 9</Typography>
                </Grid>
            </Grid>
            <br/>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <UploadFileIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Subir archivo"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <DriveFileRenameOutlineIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Editar archivo"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <FolderDeleteIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Eliminar archivo"} />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonAddIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Agregar amigo"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <BackupTableIcon />
                        </ListItemIcon>          
                        <ListItemText primary={"Ver archivos"} />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton>
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
