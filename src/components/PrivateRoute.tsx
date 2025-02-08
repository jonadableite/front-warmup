// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const hasRequiredRole = () => {
    if (!allowedRoles) return true; // Se não houver roles especificadas, permite acesso

    const userRole = getUserRole();
    return userRole && allowedRoles.includes(userRole);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole()) {
    // Redireciona para uma página de acesso negado ou para o dashboard padrão
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
