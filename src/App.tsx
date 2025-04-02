import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
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
        <ChakraProvider value={defaultSystem}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;
