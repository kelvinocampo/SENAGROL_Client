import { createContext, useEffect, useState } from 'react';

export const IAContext: any = createContext<any>(undefined);

export const IAProvider = ({ children }: any) => {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<any[]>(
    sessionStorage.getItem("history")
      ? JSON.parse(sessionStorage.getItem("history") || "")
      : []
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    sessionStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const clearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem("history");
  };

  return (
    <IAContext.Provider
      value={{
        message,
        setMessage,
        history,
        setHistory,
        clearHistory,
        isAuthenticated, // ✅ Ahora disponible en cualquier componente
      }}
    >
      {children}
    </IAContext.Provider>
  );
};
