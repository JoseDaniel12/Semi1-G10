import { Alert, AlertTitle } from "@mui/material"

export const NoFiles = ({message}) => {
    return (
        <Alert severity="warning">
            <AlertTitle>Alerta:</AlertTitle>
            {message}
        </Alert>
    )
}
