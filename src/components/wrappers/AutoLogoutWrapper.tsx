import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AutoLogoutWrapperProps {
  children: React.ReactNode;
}

export function AutoLogoutWrapper({ children }: AutoLogoutWrapperProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const INACTIVITY_MS = 60 * 60 * 1000; // 1 hora
    let timeoutId: ReturnType<typeof setTimeout>;

    const cerrarSesion = () => {
      localStorage.clear();
      navigate("/");
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cerrarSesion, INACTIVITY_MS);
    };

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    eventos.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return <>{children}</>;
}
