import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthService";
import Login from "./components/Login";
import AccountDashboard from "./components/AccountDashboard";
import RegisterEmployee from "./components/RegisterEmployee";
import ProjectDisplay from "./components/ProjectDisplay";
import Settings from "./components/Settings";
import FrontPage from "./components/FrontPage";
import RegisterAccount from "./components/RegisterAccount";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<FrontPage />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard/projects" /> : <Login />} />
      <Route path="/register" element={<RegisterAccount />} />
      <Route path="/register-company" element={<RegisterAccount company={true} />} />
      <Route path="/set-password/:id" element={<RegisterEmployee new_account={false} set_password={true} />} />

      {/* Protected Routes */}
      <Route path="/dashboard/:section" element={<ProtectedRoute Component={AccountDashboard} />} />
      <Route path="/settings" element={<ProtectedRoute Component={Settings} />} />
      <Route path="/projects/:project_id/:section" element={<ProtectedRoute Component={ProjectDisplay} />} />
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