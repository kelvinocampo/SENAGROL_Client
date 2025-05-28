import { useState, useEffect, useRef } from 'react';
import { ChatService } from '@services/Chats/ChatService';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiX } from 'react-icons/fi';

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
    const navigate = useNavigate();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickChat = (id_chat: number) => {
        navigate(`/chat/${id_chat}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                const menuButton = document.querySelector(`[data-menu-button="${openMenuId}"]`);
                if (!menuButton || !menuButton.contains(event.target as Node)) {
                    setOpenMenuId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
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

    const toggleMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setOpenMenuId(prevId => prevId === id ? null : id);
    };

    const handleBlockChat = async (chatId: number, isBlocked: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isBlocked) {
                await ChatService.unblockChat(chatId);
            }
            else {
                await ChatService.blockChat(chatId);
            }
            setChats(chats.map(chat =>
                chat.id_chat === chatId
                    ? { ...chat, estado: chat.estado === "Activo" ? "Bloqueado" : "Activo" }
                    : chat
            ));
            setOpenMenuId(null);
        } catch (err) {
            console.error("Error al bloquear/desbloquear chat:", err);
            setError("Error al realizar la acción");
        }
    };

    const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await ChatService.deleteChat(chatId);
            setChats(chats.filter(chat => chat.id_chat !== chatId));
            setOpenMenuId(null);
        } catch (err) {
            console.error("Error al eliminar chat:", err);
            setError("Error al eliminar el chat");
        }
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
        <div className="min-h-screen flex-1 flex justify-center bg-gray-50">
            <div className="bg-white shadow-sm rounded-lg flex flex-col m-4 w-full p-4">
                <div className="p-4 border-b bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Tus Conversaciones</h2>
                </div>

                <div className="overflow-y-auto flex-1">
                    {chats.map(chat => {
                        const otherUser = getOtherUser(chat);
                        const isBlocked = chat.estado === "Bloqueado";
                        const isMenuOpen = openMenuId === chat.id_chat;

                        return (
                            <div
                                key={chat.id_chat}
                                onClick={() => handleClickChat(chat.id_chat)}
                                className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer relative"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {otherUser.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {otherUser.rol}
                                        </p>
                                    </div>

                                    <div className='flex gap-4'>
                                        <div className="flex flex-col items-end space-y-1">
                                            {isBlocked && (
                                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full whitespace-nowrap">
                                                    Bloqueado
                                                </span>
                                            )}
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(chat.fecha_reciente)}
                                            </span>
                                        </div>
                                        <div
                                            data-menu-button={chat.id_chat}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-300 transition-colors ${isMenuOpen ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            onClick={(e) => toggleMenu(chat.id_chat, e)}
                                        >
                                            {isMenuOpen ? (
                                                <FiX className="text-gray-700" />
                                            ) : (
                                                <FiMoreVertical className="text-gray-700" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isMenuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-4 top-16 z-20 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                                    >
                                        <button
                                            onClick={(e) => handleBlockChat(chat.id_chat, isBlocked, e)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {isBlocked ? 'Desbloquear chat' : 'Bloquear chat'}
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteChat(chat.id_chat, e)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Eliminar chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};