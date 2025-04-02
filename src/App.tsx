import { BrowserRouter, useRoutes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import routes from "./routes";

// AppRoutes component to use the useRoutes hook
function AppRoutes() {
    const element = useRoutes(routes);
    return element;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
