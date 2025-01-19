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
      {/* Public Routes */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register-new-account" element={<RegisterEmployee new_account={true} set_password={false} />} />
      <Route path="/set-password/:id" element={<RegisterEmployee new_account={false} set_password={true} />} />

      {/* Protected Routes */}
      <Route path="/register-employee" element={<RegisterEmployee new_account={false} set_password={false} />} />
      <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} />
      {/* <Route path="/projects/create" element={<ProtectedRoute Component={CreateProject} />} /> */}
      <Route path="/projects/:project_id" element={<ProtectedRoute Component={ProjectDisplay} />} />
    </Routes>
  );
};


export const ProtectedRoute = ({ Component, redirectTo = "/login" }) => {
  const { isLoggedIn } = useAuth();

  console.log("isLoggedIn:", isLoggedIn);
  return isLoggedIn ? <Component /> : <Navigate to={redirectTo} />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;