import { createContext, useEffect, useState } from 'react';

export const IAContext: any = createContext<any>(undefined);

export const IAProvider = ({ children }: any) => {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<any[]>(
    sessionStorage.getItem("history")
      ? JSON.parse(sessionStorage.getItem("history") || "")
      : []
  );

  useEffect(() => {
    sessionStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const clearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem("history");
  };

  return (
    <IAContext.Provider
      value={{ message, setMessage, history, setHistory, clearHistory }}
    >
      {children}
    </IAContext.Provider>
  );
};
