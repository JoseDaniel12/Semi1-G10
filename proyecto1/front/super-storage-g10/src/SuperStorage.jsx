import { AppRouter } from "./router/AppRouter"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { AppTheme } from "./theme/AppTheme"

export const SuperStorage = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppTheme>
                    <AppRouter />
                </AppTheme>
            </BrowserRouter>
        </Provider>
    )
}
