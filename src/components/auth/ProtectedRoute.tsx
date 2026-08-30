import { RootState } from "@/store/store";
import { TRole } from "@/types";
import cookieService from "@/utils/cookieService";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface IProps {
  requiredRole?: TRole | TRole[];
  children: ReactNode;
}

const ProtectedRoute = ({ children, requiredRole }: IProps) => {
  const token = cookieService.getToken();
  const role = cookieService.getRole();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
