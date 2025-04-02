import { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { IDPHome } from "./pages/IDP";
import { IDPApplication } from "./pages/IDP/Application";
import IDPView from "./pages/IDP/View";
import IDPEdit from "./pages/IDP/Edit";

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
        path: "/idp/view/:id",
        element: (
            <ProtectedRoute>
                <IDPView />
            </ProtectedRoute>
        ),
    },
    {
        path: "/idp/edit/:id",
        element: (
            <ProtectedRoute>
                <IDPEdit />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <h1>Not Found</h1>,
    },
];

export default routes;
