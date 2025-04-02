import { BrowserRouter, useRoutes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import routes from "./routes";
import Layout from "./components/Layout";

// AppRoutes component to use the useRoutes hook
function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
