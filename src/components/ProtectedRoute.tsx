import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "@/services/Perfil/authService";

interface ProtectedRouteProps {
  allowedRoles: string[];   // roles que pueden entrar (ej. ["vendedor"])
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleStr = await getUserRole();           // "vendedor administrador"
        const rolesArr = roleStr ? roleStr.split(/\s+/).filter(Boolean) : [];
        setRoles(rolesArr);
      } catch {
        setRoles([]); // sin rol → no autorizado
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <div>Cargando...</div>;

  /* ¿Algún rol del usuario coincide con los permitidos? */
  const autorizado = roles.some((r) => allowedRoles.includes(r));

  return autorizado ? <>{children}</> : <Navigate to="/404" replace />;
};
