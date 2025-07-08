import { createContext, useEffect, useState, ReactNode } from 'react';

interface HistoryItem {
  type: "user" | "ia";
  message: string;
  timestamp?: string;
}

interface IAContextType {
  message: string;
  setMessage: (msg: string) => void;
  history: HistoryItem[];
  setHistory: (h: HistoryItem[]) => void;
  clearHistory: () => void;
  isAuthenticated: boolean;
}

export const IAContext = createContext<IAContextType | undefined>(undefined);

export const IAProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>(
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
        isAuthenticated,
      }}
    >
      {children}
    </IAContext.Provider>
  );
};
