import { ChatService } from "@services/Chats/ChatService";
import { useState, useEffect } from "react";
import { Avatar, List, Typography, Tag, Skeleton, Empty, Badge } from "antd";
import Header from "@/components/Header";

const { Text } = Typography;

interface Chat {
  id_chat: number;
  id_user1: number;
  id_user2: number;
  ultimo_mensaje: string;
  fecha_reciente: string;
  bloqueado_user1: boolean;
  bloqueado_user2: boolean;
  eliminado_user1: boolean;
  eliminado_user2: boolean;
  estado: "Activo" | "Bloqueado";
  unread_count: number;
  other_user_name: string;
  other_user_avatar: string;
}

export const ChatsList = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const currentUserId = 2;

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const response = await ChatService.getChats();
                setChats(response);
                setError(null);
            } catch (error) {
                console.error('Error fetching chats:', error);
                setError("Failed to load chats. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const getChatStatus = (chat: Chat) => {
        return chat.estado === "Bloqueado" 
            ? <Tag color="red">Bloqueado</Tag>
            : <Tag color="green">Activo</Tag>;
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `hace ${interval} año${interval === 1 ? '' : 's'}`;

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `hace ${interval} mes${interval === 1 ? '' : 'es'}`;

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `hace ${interval} día${interval === 1 ? '' : 's'}`;

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `hace ${interval} hora${interval === 1 ? '' : 's'}`;

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `hace ${interval} minuto${interval === 1 ? '' : 's'}`;

        return `hace unos segundos`;
    };

    const renderLastMessage = (chat: Chat) => {
        if (!chat.ultimo_mensaje) {
            return <Text type="secondary">No hay mensajes</Text>;
        }

        return (
            <div className="flex flex-col">
                <p className="truncate max-w-[200px] text-gray-800 dark:text-gray-200">
                    {chat.ultimo_mensaje}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(chat.fecha_reciente)}
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3">
                        <Skeleton.Avatar active size="large" />
                        <Skeleton.Input active style={{ width: 200 }} />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <Empty description={error} />
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Empty
                    description="No tienes chats iniciados"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <List
                    itemLayout="horizontal"
                    dataSource={chats}
                    renderItem={(chat) => (
                        <List.Item
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                                chat.unread_count > 0 ? 'bg-blue-50 dark:bg-gray-800' : ''
                            }`}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Badge
                                        count={chat.unread_count > 0 ? chat.unread_count : 0}
                                        offset={[-10, 10]}
                                        className="custom-badge"
                                    >
                                        <Avatar
                                            src={chat.other_user_avatar}
                                            size="large"
                                            className="border-2 border-white dark:border-gray-800"
                                        />
                                    </Badge>
                                }
                                title={
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {chat.other_user_name}
                                        </span>
                                        {getChatStatus(chat)}
                                    </div>
                                }
                                description={renderLastMessage(chat)}
                                className="items-center"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};