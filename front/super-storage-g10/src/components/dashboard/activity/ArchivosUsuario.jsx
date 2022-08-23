import { Box, Grid, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react";
import { TabPanel, a11yProps } from "../components/TabPanel";
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { FileCard } from "../components/FileCard";

export const ArchivosUsuario = () => {

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                        <FileCard />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                        <FileCard />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                        <FileCard />
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container>
                    <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                        <FileCard />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                        <FileCard />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, p: 2 }}>
                        <FileCard />
                    </Grid>
                </Grid>
            </TabPanel>
        </>
    )
}
