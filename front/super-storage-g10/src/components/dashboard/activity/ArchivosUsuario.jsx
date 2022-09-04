import { Box, Grid, Tab, Tabs } from "@mui/material"
import { useState } from "react";
import { TabPanel, a11yProps } from "../components/TabPanel";
import { FileCard } from "../components/FileCard";
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { useAuthStore } from "../../../hooks/useAuthStore";
import { useEffect } from "react";
import { useStorageStore } from "../../../hooks/useStorageStore";
import { useActivityStore } from "../../../hooks/useActivityStore";

export const ArchivosUsuario = () => {

    const [value, setValue] = useState(0);
    const [contSubstring, setContSubstring] = useState(0)
    const { user } = useAuthStore();
    const { privados, publicos, startArchivosUsuario } = useStorageStore();
    const { active } = useActivityStore();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setContSubstring((user.id.toString() + "/").length);
        startArchivosUsuario();
    }, [active])
    
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: 0, margin: 0 }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab icon={<PublicIcon />}  iconPosition="start" label="Publicos" {...a11yProps(0)} />
                    <Tab icon={<LockIcon />}  iconPosition="start" label="Privados" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Grid container>
                    {
                        publicos.map(archivo => 
                            (
                                <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                                    <FileCard archivo={archivo} idSbs={contSubstring} autor={user.nombre_usuario} />
                                </Grid>
                            )
                        )
                    }
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container>
                    {
                        privados.map(archivo => 
                            (
                                <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                                    <FileCard archivo={archivo} idSbs={contSubstring} autor={user.nombre_usuario} />
                                </Grid>
                            )
                        )
                    }
                </Grid>
            </TabPanel>
        </>
    )
}
