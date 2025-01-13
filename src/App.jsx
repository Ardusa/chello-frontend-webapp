import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthService";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RegisterEmployee from "./components/RegisterEmployee";
import CreateProject from "./components/CreateProject";
import ProjectDisplay from "./components/ProjectDisplay";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterEmployee />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/projects/create" element={isLoggedIn ? <CreateProject /> : <Navigate to="/" />} />
      <Route path="/projects/:project_id" element={isLoggedIn ? <ProjectDisplay /> : <Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;