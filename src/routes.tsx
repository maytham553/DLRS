import { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { IDPHome } from "./pages/IDP";
import { IDPApplication } from "./pages/IDP/Application";
import IDPView from "./pages/IDP/View";
import IDPEdit from "./pages/IDP/Edit";
import VerifyIDP from "./pages/VerifyIDP";
import PublicIDPApplication from "./pages/PublicIDPApplication";
import NotFound from "./pages/NotFound";

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
        path: "/verify-idp",
        element: <VerifyIDP />,
    },
    {
        path: "/public-idp-application",
        element: <PublicIDPApplication />,
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
        element: <NotFound />,
    },
];

export default routes;
