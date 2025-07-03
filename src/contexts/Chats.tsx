// src/contexts/Chats.tsx

import { createContext, useState, useEffect, useCallback } from 'react';
import { ChatService } from '@/services/Chats/ChatService'; 

export interface Chat {
  id_chat: number;
  id_user1: number;
  id_user2: number;
  nombre_user1: string;
  nombre_user2: string;
  rol_user1: string;
  rol_user2: string;
  fecha_reciente: string;
  bloqueado_user1: number;   // ← number en vez de boolean
  bloqueado_user2: number;   // ← number
  eliminado_user1: number;   // ← number
  eliminado_user2: number;   // ← number
  estado: "Activo" | "Bloqueado";
}

export const ChatsContext = createContext<{
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  fetchChats: () => Promise<void>;
  loading: boolean;
}>({
  chats: [],
  setChats: () => { },
  fetchChats: async () => { },
  loading: false,
});

export const ChatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true); // Inicia carga
      const chatsData = await ChatService.getChats();
      setChats(chatsData);
    } catch (err) {
      console.error("Error al cargar chats:", err);
      throw err;
    } finally {
      setLoading(false); // Finaliza carga, sea éxito o error
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <ChatsContext.Provider value={{ chats, setChats, fetchChats, loading }}>
      {children}
    </ChatsContext.Provider>
  );
};
