import { Navigate } from "react-router-dom";

export function PublicRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}
