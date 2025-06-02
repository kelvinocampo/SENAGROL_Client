import { AuthService } from "@/services/AuthService";
import { MessageService, Message } from "@/services/Chats/MessageService";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMoreVertical, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { ChatsContext } from "@/contexts/Chats";
import { useSocket } from "@/hooks/UseSocket";

export const Chat = () => {
    const { id_chat = "" } = useParams<{ id_chat: string }>();
    const { chats }: any = useContext(ChatsContext);
    const navigate = useNavigate();
    const socket = useSocket("http://localhost:10101");

    // Estados consolidados
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [editing, setEditing] = useState<{ id: number, content: string } | null>(null);
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Verificar si el chat existe
    const chatExists = chats.find((c: any) => c.id_chat === parseInt(id_chat));

    // Título del chat
    const title = (() => {
        const chat = chats.find((c: any) => c.id_chat === parseInt(id_chat));
        if (!chat || !currentUserId) return "Chat";
        const isUser1 = chat.id_user1 === currentUserId;
        return isUser1 ? chat.nombre_user2 : chat.nombre_user1;
    })();

    // Utilidades
    const showError = (err: any, msg: string) => {
        console.error(err);
        setError(err instanceof Error ? err.message : msg);
    };

    const createTempMessage = (content: string, type: "texto" | "imagen" | "audio" = 'texto'): Message => ({
        id_mensaje: Date.now(),
        contenido: content,
        fecha_envio: new Date().toISOString(),
        id_user: currentUserId!,
        id_chat: parseInt(id_chat),
        tipo: type,
        editado: 0
    });

    const getCurrentUserId = useCallback(async () => {
        try {
            const id = await AuthService.getIDUser();
            setCurrentUserId(id);
            return id;
        } catch (err) {
            showError(err, "Error al cargar usuario");
            return null;
        }
    }, []);

    // Handlers
    const sendTextMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userId = currentUserId || await getCurrentUserId();
        if (!userId) return;

        const tempMsg = createTempMessage(newMessage);
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage("");

        try {
            const response = await MessageService.sendTextMessage(newMessage, parseInt(id_chat));
            setMessages(prev => prev.map(m => m.id_mensaje === tempMsg.id_mensaje ? response : m));
        } catch (err) {
            showError(err, "No se pudo enviar mensaje");
            setMessages(prev => prev.filter(m => m.id_mensaje !== tempMsg.id_mensaje));
        }
    };

    const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.match('image.*')) {
            setError("Solo se permiten imágenes");
            return;
        }

        const userId = currentUserId || await getCurrentUserId();
        if (!userId) return;

        const tempMsg = createTempMessage(URL.createObjectURL(file), 'imagen');
        setMessages(prev => [...prev, tempMsg]);

        try {
            const response = await MessageService.sendImageMessage(file, parseInt(id_chat));
            setMessages(prev => prev.map(m => m.id_mensaje === tempMsg.id_mensaje ? response : m));
        } catch (err) {
            showError(err, "No se pudo enviar imagen");
            setMessages(prev => prev.filter(m => m.id_mensaje !== tempMsg.id_mensaje));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const toggleRecording = async () => {
        if (recording) {
            mediaRecorder?.stop();
            mediaRecorder?.stream.getTracks().forEach(track => track.stop());
            setRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
                const userId = currentUserId || await getCurrentUserId();
                if (!userId) return;

                const tempMsg = createTempMessage(URL.createObjectURL(audioBlob), 'audio');
                setMessages(prev => [...prev, tempMsg]);

                try {
                    const response = await MessageService.sendAudioMessage(audioBlob, parseInt(id_chat));
                    setMessages(prev => prev.map(m => m.id_mensaje === tempMsg.id_mensaje ? response : m));
                } catch (err) {
                    showError(err, "No se pudo enviar audio");
                    setMessages(prev => prev.filter(m => m.id_mensaje !== tempMsg.id_mensaje));
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setRecording(true);
        } catch (err) {
            showError(err, "No se pudo acceder al micrófono");
        }
    };

    const editMessage = async () => {
        if (!editing) return;
        try {
            const updated = await MessageService.editMessage(editing.id, editing.content, parseInt(id_chat));
            setMessages(prev => prev.map(m => m.id_mensaje === editing.id ? updated : m));
            setEditing(null);
        } catch (err) {
            showError(err, "No se pudo editar mensaje");
        }
    };

    const deleteMessage = async (id: number) => {
        try {
            await MessageService.deleteMessage(id, parseInt(id_chat));
            setMessages(prev => prev.filter(m => m.id_mensaje !== id));
            setOpenMenu(null);
        } catch (err) {
            showError(err, "No se pudo eliminar mensaje");
        }
    };

    // Effects
    useEffect(() => {
        // Verificar si el chat existe una vez que los chats estén cargados
        if (chats.length > 0 && !chatExists) {
            navigate('/404');
            return;
        }

        const init = async () => {
            try {
                setLoading(true);
                await getCurrentUserId();
                const msgs = await MessageService.getMessages(parseInt(id_chat));
                setMessages(msgs);
            } catch (err) {
                showError(err, "Error al cargar mensajes");
            } finally {
                setLoading(false);
            }
        };

        // Solo iniciar si el chat existe
        if (chatExists) {
            init();
        }
    }, [id_chat, chats, chatExists, navigate, getCurrentUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!e.target || openMenu === null) return;
            const target = e.target as Element;
            if (!target.closest(`[data-menu="${openMenu}"]`)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [openMenu]);

    // Socket
    useEffect(() => {
        if (!socket || !id_chat || currentUserId === null || !chatExists) return;

        socket.emit("join_chat", { chatId: id_chat });

        const handleNewMessage = (msg: any) => {
            if (msg.usuario !== currentUserId) setMessages(prev => [...prev, msg]);
        };

        const handleUpdatedMessage = (msg: { id_mensaje: number, contenido: string }) => {
            setMessages(prev => prev.map(m =>
                m.id_mensaje === msg.id_mensaje ? { ...m, contenido: msg.contenido, editado: 1 } : m
            ));
        };

        const handleDeletedMessage = ({ id_mensaje }: { id_mensaje: number }) => {
            setMessages(prev => prev.filter(m => m.id_mensaje !== id_mensaje));
        };

        socket.on("new_message", handleNewMessage);
        socket.on("updated_message", handleUpdatedMessage);
        socket.on("deleted_message", handleDeletedMessage);

        return () => {
            socket.emit("leave_chat", { chatId: id_chat });
            socket.off("new_message", handleNewMessage);
            socket.off("updated_message", handleUpdatedMessage);
            socket.off("deleted_message", handleDeletedMessage);
        };
    }, [socket, id_chat, currentUserId, chatExists]);

    // Si no hay chats cargados aún, mostrar loading
    if (chats.length === 0) {
        return (
            <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md items-center justify-center">
                <p className="text-center">Cargando chats...</p>
            </div>
        );
    }

    // Si el chat no existe, no renderizar nada (ya se redirigió)
    if (!chatExists) {
        return null;
    }

    const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const renderMessage = (msg: Message) => {
        const isMe = msg.id_user === currentUserId;
        const isEditing = editing?.id === msg.id_mensaje;
        const menuOpen = openMenu === msg.id_mensaje;

        return (
            <div key={msg.id_mensaje} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative p-3 rounded-lg max-w-xs ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    {isEditing && msg.tipo === 'texto' ? (
                        <div>
                            <textarea
                                value={editing.content}
                                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                                className="w-full p-2 text-black rounded"
                                rows={3}
                                autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setEditing(null)} className="px-2 py-1 text-sm bg-gray-300 rounded">
                                    Cancelar
                                </button>
                                <button onClick={editMessage} className="px-2 py-1 text-sm bg-blue-600 text-white rounded">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ) : msg.tipo === 'imagen' ? (
                        <img src={msg.contenido} alt="Imagen" className="rounded-lg max-h-60" />
                    ) : msg.tipo === 'audio' ? (
                        <audio controls className="w-64">
                            <source src={msg.contenido} type="audio/mpeg" />
                        </audio>
                    ) : (
                        <div>
                            <p>{msg.contenido}</p>
                            {msg.editado === 1 && <span className="text-xs opacity-70">(editado)</span>}
                        </div>
                    )}

                    <div className="text-xs text-right mt-1 opacity-70">
                        {formatTime(msg.fecha_envio)}
                    </div>

                    {isMe && (
                        <div className="absolute -top-2 -right-2" data-menu={msg.id_mensaje}>
                            <button
                                onClick={() => setOpenMenu(menuOpen ? null : msg.id_mensaje)}
                                className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs"
                            >
                                {menuOpen ? <FiX /> : <FiMoreVertical />}
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-1 w-32 bg-white rounded shadow-lg py-1 z-20">
                                    {msg.tipo === 'texto' && (
                                        <button
                                            onClick={() => {
                                                setEditing({ id: msg.id_mensaje, content: msg.contenido });
                                                setOpenMenu(null);
                                            }}
                                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <FiEdit2 className="mr-2" size={14} />
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(msg.id_mensaje)}
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
    };

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">{title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <p className="text-center">Cargando...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400">No hay mensajes</p>
                ) : (
                    messages.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendTextMessage} className="p-4 border-t flex items-center gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={sendImage} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded">
                    🖼️
                </button>
                <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-2 rounded ${recording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'}`}
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Enviar
                </button>
            </form>
        </div>
    );
};