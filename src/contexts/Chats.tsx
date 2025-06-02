import { createContext, useState, useEffect, useCallback } from 'react';
import { ChatService } from '@/services/Chats/ChatService';

export const ChatsContext = createContext<{
  chats: any[];
  setChats: (chats: any[]) => void;
  fetchChats: () => Promise<void>;
}>({
  chats: [],
  setChats: () => { },
  fetchChats: async () => { },
});

export interface Chat {
  id_chat: number;
  id_user1: number;
  id_user2: number;
  nombre_user1: string;
  nombre_user2: string;
  rol_user1: string;
  rol_user2: string;
  fecha_reciente: string;
  bloqueado_user1: boolean;
  bloqueado_user2: boolean;
  eliminado_user1: boolean;
  eliminado_user2: boolean;
  estado: "Activo" | "Bloqueado";
}

export const ChatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchChats = useCallback(async () => {
    try {
      const chatsData = await ChatService.getChats();
      setChats(chatsData);
    } catch (err) {
      console.error("Error al cargar chats:", err);
      throw err; // Re-lanzamos el error para que los componentes puedan manejarlo
    }
  }, []);

  // Cargar chats al montar el provider
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <ChatsContext.Provider
      value={{ chats, setChats, fetchChats }}
    >
      {children}
    </ChatsContext.Provider>
  );
};