import { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { IDPHome } from "./pages/IDP";
import { IDPApplication } from "./pages/IDP/Application";
const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/idp",
        element: (
            <ProtectedRoute>
                <IDPHome />
            </ProtectedRoute>
        ),
    },
    {
        path: "/idp/application",
        element: (
            <ProtectedRoute>
                <IDPApplication />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <h1>Not Found</h1>,
    },
];

export default routes;
