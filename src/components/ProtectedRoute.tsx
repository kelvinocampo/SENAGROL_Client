import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../services/authService";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await getUserRole(); // Supone que devuelve un string
        setRole(userRole);
      } catch (error) {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/Error404" />;
  }

  return <>{children}</>;
};
