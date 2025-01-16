import { Navigate } from "react-router-dom";
import { getAccessToken } from "../services/AuthService";

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    console.warn("User not authenticated. Redirecting...");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;