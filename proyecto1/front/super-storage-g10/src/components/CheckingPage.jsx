import { ButtonGroup, TextField, Button, Grid, Typography, CircularProgress } from "@mui/material";

export const CheckingPage = () => {
    return (
        <>       
            <Grid
                container spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                sx={{ minHeight: '100vh', padding: 4, backgroundColor: 'primary.main' }}
            >
                <Grid item
                    xs={3}
                    sx={{ 
                        width: {md: '60vh'},
                        padding: 3, 
                        borderRadius: 2,
                        }}
                    >
                    
                    <CircularProgress color="inherit" />
                </Grid>
            </Grid>        
        </>
    )
}
