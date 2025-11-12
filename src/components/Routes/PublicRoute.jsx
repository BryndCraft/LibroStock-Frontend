import { Navigate } from "react-router-dom";

export function PublicRoute({ children }) {
  const isAuthenticated = !!sessionStorage.getItem("token");
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}