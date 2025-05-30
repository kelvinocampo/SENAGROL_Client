import { AuthService } from "@/services/AuthService";
import { MessageService, Message } from "@/services/Chats/MessageService";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiMoreVertical, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

export const Chat = () => {
    const { id_chat = "" } = useParams<{ id_chat: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editedMessageContent, setEditedMessageContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId !== null) {
                const menuButton = document.querySelector(`[data-menu-button="${openMenuId}"]`);
                const menu = menuRefs.current[openMenuId];

                if (menu && !menu.contains(event.target as Node) &&
                    (!menuButton || !menuButton.contains(event.target as Node))) {
                    setOpenMenuId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const toggleMenu = (messageId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(prevId => prevId === messageId ? null : messageId);
    };

    const handleEditMessage = (message: Message) => {
        setEditingMessageId(message.id_mensaje);
        setEditedMessageContent(message.contenido);
        setOpenMenuId(null);
    };

    const handleSaveEdit = async () => {
        if (!editingMessageId || !editedMessageContent.trim()) return;

        try {
            const updatedMessage = await MessageService.editMessage(
                editingMessageId,
                editedMessageContent,
                parseInt(id_chat)
            );

            setMessages(prev => prev.map(m =>
                m.id_mensaje === editingMessageId ? updatedMessage : m
            ));
            setEditingMessageId(null);
        } catch (error) {
            console.error("Error editing message:", error);
            setError(error instanceof Error ? error.message : "No se pudo editar el mensaje");
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            await MessageService.deleteMessage(messageId, parseInt(id_chat));
            setMessages(prev => prev.filter(m => m.id_mensaje !== messageId));
            setOpenMenuId(null);
        } catch (error) {
            console.error("Error deleting message:", error);
            setError(error instanceof Error ? error.message : "No se pudo eliminar el mensaje");
        }
    };

    const handleSendTextMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const sendDate = new Date().toISOString();
        const tempMessage: Message = {
            id_mensaje: Date.now(),
            contenido: newMessage,
            fecha_envio: sendDate,
            id_user: currentUserId,
            id_chat: parseInt(id_chat),
            tipo: 'texto',
            editado: 0
        };

        try {
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage("");
            const response = await MessageService.sendTextMessage(newMessage, parseInt(id_chat));
            setMessages(prev => prev.map(m =>
                m.id_mensaje === tempMessage.id_mensaje ? response : m
            ));
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error instanceof Error ? error.message : "No se pudo enviar el mensaje");
            setMessages(prev => prev.filter(m => m.id_mensaje !== tempMessage.id_mensaje));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.match('image.*')) {
            setError("Por favor sube solo imágenes");
            return;
        }

        const tempMessage: Message = {
            id_mensaje: Date.now(),
            contenido: URL.createObjectURL(file),
            fecha_envio: new Date().toISOString(),
            id_user: currentUserId,
            id_chat: parseInt(id_chat),
            tipo: 'imagen',
            editado: 0
        };

        try {
            setMessages(prev => [...prev, tempMessage]);
            const response = await MessageService.sendImageMessage(file, parseInt(id_chat));
            setMessages(prev => prev.map(m =>
                m.id_mensaje === tempMessage.id_mensaje ? response : m
            ));
        } catch (error) {
            console.error("Error uploading image:", error);
            setError(error instanceof Error ? error.message : "No se pudo enviar la imagen");
            setMessages(prev => prev.filter(m => m.id_mensaje !== tempMessage.id_mensaje));
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);

                const tempMessage: Message = {
                    id_mensaje: Date.now(),
                    contenido: audioUrl,
                    fecha_envio: new Date().toISOString(),
                    id_user: currentUserId,
                    id_chat: parseInt(id_chat),
                    tipo: 'audio',
                    editado: 0
                };

                setMessages(prev => [...prev, tempMessage]);

                try {
                    const response = await MessageService.sendAudioMessage(audioBlob, parseInt(id_chat));
                    setMessages(prev => prev.map(m =>
                        m.id_mensaje === tempMessage.id_mensaje ? response : m
                    ));
                } catch (error) {
                    console.error("Error sending audio:", error);
                    setError(error instanceof Error ? error.message : "No se pudo enviar el audio");
                    setMessages(prev => prev.filter(m => m.id_mensaje !== tempMessage.id_mensaje));
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
            setError(error instanceof Error ? error.message : "No se pudo acceder al micrófono");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await MessageService.getMessages(parseInt(id_chat));
                setMessages(result);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setError(error instanceof Error ? error.message : "Error al cargar los mensajes");
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCurrentUserId = async () => {
            try {
                const id = await AuthService.getIDUser();
                setCurrentUserId(id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
                setError(error instanceof Error ? error.message : "Error al cargar el ID del usuario");
            }
        };

        fetchCurrentUserId();
        fetchMessages();
    }, [id_chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (mediaRecorder) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaRecorder]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg">Chat #{id_chat}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <p className="text-center">Cargando mensajes...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400">No hay mensajes aún</p>
                ) : (
                    messages.map((message) => {
                        const isCurrentUser = message.id_user === currentUserId;
                        const isTextMessage = message.tipo === 'texto';
                        const isMenuOpen = openMenuId === message.id_mensaje;

                        return (
                            <div key={message.id_mensaje} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`relative p-3 rounded-lg max-w-xs ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}>
                                    {editingMessageId === message.id_mensaje && isTextMessage ? (
                                        <div className="flex flex-col">
                                            <textarea
                                                value={editedMessageContent}
                                                onChange={(e) => setEditedMessageContent(e.target.value)}
                                                className="w-full p-2 text-black rounded border"
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={() => setEditingMessageId(null)}
                                                    className="px-2 py-1 text-sm bg-gray-300 rounded"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                                                >
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                    ) : message.tipo === 'imagen' ? (
                                        <img
                                            src={message.contenido}
                                            alt="Imagen enviada"
                                            className="rounded-lg object-cover max-h-60"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.png';
                                                target.alt = 'Imagen no disponible';
                                            }}
                                        />
                                    ) : message.tipo === 'audio' ? (
                                        <audio controls className="w-64">
                                            <source src={message.contenido} type="audio/mpeg" />
                                            Tu navegador no soporta el elemento de audio.
                                        </audio>
                                    ) : (
                                        <div>
                                            <p>{message.contenido}</p>
                                            {message.editado === 1 && (
                                                <span className="text-xs text-gray-400">(editado)</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="text-xs text-right mt-1">
                                        {formatTime(message.fecha_envio)}
                                    </div>

                                    {isCurrentUser && (
                                        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                            <button
                                                data-menu-button={message.id_mensaje}
                                                onClick={(e) => toggleMenu(message.id_mensaje, e)}
                                                className={`w-6 h-6 flex items-center justify-center rounded-full ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-300'} hover:bg-opacity-90`}
                                            >
                                                {isMenuOpen ? (
                                                    <FiX size={14} />
                                                ) : (
                                                    <FiMoreVertical size={14} />
                                                )}
                                            </button>

                                            {isMenuOpen && (
                                                <div
                                                    ref={(el: any) => menuRefs.current[message.id_mensaje] = el}
                                                    className="absolute right-0 z-20 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                                                >
                                                    {isTextMessage && (
                                                        <button
                                                            onClick={() => handleEditMessage(message)}
                                                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEdit2 className="mr-2" size={14} />
                                                            Editar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteMessage(message.id_mensaje)}
                                                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                    >
                                                        <FiTrash2 className="mr-2" size={14} />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendTextMessage} className="p-4 border-t flex items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    title="Enviar imagen"
                >
                    🖼️
                </button>
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    title={isRecording ? 'Detener grabación' : 'Grabar audio'}
                >
                    🎙️
                </button>
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
};