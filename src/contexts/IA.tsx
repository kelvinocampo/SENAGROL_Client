import { createContext, useEffect, useState } from 'react';

export const IAContext: any = createContext<any>(undefined);

export const IAProvider = ({ children }: any) => {
    const [message, setMessage] = useState<any>("");
    const [history, setHistory] = useState<any[]>(sessionStorage.getItem("history") ? JSON.parse(sessionStorage.getItem("history") || "") : []);

    useEffect(() => {
        sessionStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    return (
        <IAContext.Provider value={{ message, setMessage, history, setHistory }}>
            {children}
        </IAContext.Provider>
    );
};