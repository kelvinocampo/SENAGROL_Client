import { ChatService } from "@services/Chats/ChatService";
import { useState, useEffect } from "react";
import { Avatar, List, Typography, Tag, Skeleton, Empty, Badge } from "antd";

const { Text } = Typography;

export const ChatsList = () => {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const currentUserId = parseInt(localStorage.getItem('userId') || '0');

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

    const getOtherUser = (chat: any, currentUserId: number) => {
        return chat.id_user1 === currentUserId ? chat.user2 : chat.user1;
    };

    const getChatStatus = (chat: any) => {
        if (chat.estado === "Bloqueado") {
            return <Tag color="red">Bloqueado</Tag>;
        }
        return <Tag color="green">Activo</Tag>;
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

    const renderLastMessage = (chat: any) => {
        if (!chat.ultimo_mensaje) {
            return <Text type="secondary">No hay mensajes</Text>;
        }
        
        return (
            <>
                <Text ellipsis style={{ maxWidth: '200px', display: 'block' }}>
                    {chat.ultimo_mensaje}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    {formatTimeAgo(chat.fecha_reciente)}
                </Text>
            </>
        );
    };

    if (loading) {
        return (
            <div className="chats-list">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="chat-item-skeleton">
                        <Skeleton avatar active paragraph={{ rows: 1 }} />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="chats-list-error">
                <Empty description={error} />
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="no-chats">
                <Empty 
                    description="No tienes chats iniciados"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div className="chats-list">
            <List
                itemLayout="horizontal"
                dataSource={chats}
                renderItem={(chat) => (
                    <List.Item
                        className={`chat-item ${chat.unread_count > 0 ? 'unread' : ''}`}
                        // onClick={() => handleChatClick(chat.id_chat)}
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge 
                                    count={chat.unread_count > 0 ? chat.unread_count : 0}
                                    offset={[-10, 10]}
                                >
                                    <Avatar 
                                        src={getOtherUser(chat, currentUserId).avatar} 
                                        size="large"
                                    />
                                </Badge>
                            }
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong>{getOtherUser(chat, currentUserId).name}</Text>
                                    {getChatStatus(chat)}
                                </div>
                            }
                            description={renderLastMessage(chat)}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};