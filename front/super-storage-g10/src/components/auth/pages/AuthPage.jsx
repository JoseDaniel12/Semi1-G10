import { ButtonGroup, TextField, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../../../hooks/useAuthStore"
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export const AuthPage = () => {
    
    const { status, user, startLogin } = useAuthStore();
    const [viewForm, setViewForm] = useState('login')

    return (
        <>       
            <Grid
                container spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                className="bg-workspace"
                sx={{ minHeight: '100vh', padding: 4 }}
            >
                <Grid item
                    xs={3}
                    sx={{ 
                        width: {md: '60vh'},
                        backgroundColor: 'white', 
                        padding: 3, 
                        borderRadius: 2,
                        }}
                    >
                    
                    <Typography variant="h4"><strong><i>SuperStorage<small>-G9</small></i></strong></Typography>
                    <br/>

                    <ButtonGroup
                        disableElevation
                        aria-label="Disabled elevation buttons"
                        >

                        <Button variant={(viewForm == 'login') ? 'contained' : 'outlined'} onClick={() => setViewForm('login')}>Login</Button>
                        <Button variant={(viewForm == 'register') ? 'contained' : 'outlined'} onClick={() => setViewForm('register')}>Registrarse</Button>
                    </ButtonGroup>
                    
                    {
                        (viewForm == 'login')
                            ? <LoginForm />
                            : <RegisterForm />
                    }
                </Grid>
            </Grid>
                
        </>
    )
}
