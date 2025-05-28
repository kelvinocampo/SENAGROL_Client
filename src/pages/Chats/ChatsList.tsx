import { useState, useEffect } from 'react';
import { ChatService } from '@services/Chats/ChatService';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface Chat {
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

export const ChatsList = () => {
    const navigate = useNavigate()
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number>(0); // Inicializar con 0 o obtener del auth

    const handleClickChat = (id_chat: number) => {
        navigate(`/chat/${id_chat}`)
    }
    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                // En una app real, obtendrías el ID del usuario autenticado
                // const userId = await AuthService.getCurrentUserId();
                const userId = 2; // Ejemplo - reemplazar con el ID real
                setCurrentUserId(userId);

                const chatsData = await ChatService.getChats();
                setChats(chatsData);
            } catch (err) {
                setError("Error al cargar los chats");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Ahora";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} d`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getOtherUser = (chat: Chat) => {
        const isUser1 = chat.id_user1 === currentUserId;
        return {
            name: isUser1 ? chat.nombre_user1 : chat.nombre_user2,
            isBlocked: isUser1 ? chat.bloqueado_user1 : chat.bloqueado_user2,
            rol: isUser1 ? chat.rol_user1 : chat.rol_user2
        };
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto p-4 text-red-600 bg-red-50 rounded-lg">
                {error}
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="max-w-md mx-auto p-4 text-center text-gray-500">
                No tienes chats iniciados
            </div>
        );
    }

    return (
        <>
            <div className="w-full bg-white shadow-sm rounded-lg overflow-hidden p-4 m-4">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Tus Conversaciones</h2>
                </div>

                <div className="">
                    {chats.map(chat => {
                        const otherUser = getOtherUser(chat);

                        return (
                            <div
                                key={chat.id_chat}
                                onClick={() => handleClickChat(chat.id_chat)}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                        {otherUser.name}
                                    </h3>
                                    {chat.estado === "Bloqueado" && (
                                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                                            Bloqueado
                                        </span>
                                    )}

                                    <span>{otherUser.rol}</span>

                                    <span className="text-sm text-gray-500 whitespace-nowrap">
                                        {formatDate(chat.fecha_reciente)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};