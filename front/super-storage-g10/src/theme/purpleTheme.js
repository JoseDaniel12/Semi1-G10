import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material";

export const purpleTheme = createTheme({
    palette: {
        primary: {
            main: '#006064' 
        },
        secondary: {
            main: '#543884'
        },
        error: {
            main: red.A400
        }
    }
})