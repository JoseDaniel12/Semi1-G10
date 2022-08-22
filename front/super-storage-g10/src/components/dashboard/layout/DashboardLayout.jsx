import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material"
import { InboxOutlined, MailOutline } from '@mui/icons-material';
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { SideBar } from "../components/SideBar";

const drawerWidth = 240;

export const DashboardLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Navbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle}/>

            <SideBar mobileOpen={mobileOpen} drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle}/>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar /> 
                { children }
            </Box>
        </Box>
    );
}
