import { MessageService } from "@/services/Chats/MessageService";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

interface Message {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
  id_user: number;
  tipo: 'texto' | 'imagen' | 'audio';
}

export const Chat = () => {
    const { id_chat = "" } = useParams<{ id_chat: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId] = useState<number>(2); // Cambiar por el ID real del usuario
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendTextMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputElement = document.querySelector<HTMLInputElement>('input[type="text"]');
        
        if (inputElement && inputElement.value.trim() !== "") {
            try {
                const sendDate = new Date().toISOString();
                await MessageService.sendTextMessage(inputElement.value, parseInt(id_chat));
                setMessages([...messages, { 
                    contenido: inputElement.value, 
                    fecha_envio: sendDate, 
                    id_user: currentUserId, 
                    tipo: 'texto',
                    id_mensaje: Date.now() // ID temporal hasta la respuesta del servidor
                }]);
                inputElement.value = "";
            } catch (error) {
                console.error("Error sending message:", error);
                setError("No se pudo enviar el mensaje");
            }
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const result = await MessageService.getMessages(parseInt(id_chat));
                setMessages(result);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError("Error al cargar los mensajes");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [id_chat]);

    useEffect(() => {
        // Auto-scroll al final cuando hay nuevos mensajes
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const renderMessageContent = (message: Message) => {
        const isCurrentUser = message.id_user === currentUserId;

        switch (message.tipo) {
            case 'imagen':
                return (
                    <div className={`max-w-xs ${isCurrentUser ? 'ml-auto' : ''}`}>
                        <img
                            src={message.contenido}
                            alt="Imagen enviada"
                            className="rounded-lg object-cover max-h-60"
                        />
                    </div>
                );
            case 'audio':
                return (
                    <div className={`flex items-center ${isCurrentUser ? 'justify-end' : ''}`}>
                        <audio controls className="w-64">
                            <source src={message.contenido} type="audio/mpeg" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                );
            default: // texto
                return (
                    <p className={`${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                        {message.contenido}
                    </p>
                );
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-1 flex-col w-full bg-white shadow-sm rounded-lg">
            {/* Cabecera del chat */}
            <div className="bg-white p-4 border-b shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Nombre del Chat</h1>
                    <span className="text-sm text-gray-500">En línea</span>
                </div>
            </div>

            {/* Área de mensajes con scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <p>Cargando mensajes...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full text-red-500">
                        <p>{error}</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <p>No hay mensajes aún</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isCurrentUser = message.id_user === currentUserId;

                        return (
                            <div
                                key={message.id_mensaje || index}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {renderMessageContent(message)}
                                    <div className={`text-xs mt-1 flex justify-end ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatTime(message.fecha_envio)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Área de entrada */}
            <div className="bg-white border-t p-4">
                <form className="flex items-center gap-2" onSubmit={handleSendTextMessage}>
                    <button 
                        type="button" 
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};