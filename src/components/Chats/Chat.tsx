import { AuthService } from "@/services/AuthService";
import { MessageService, Message } from "@/services/Chats/MessageService";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiSend,
  FiCamera,
  FiMic,
} from "react-icons/fi";
import { ChatsContext } from "@/contexts/Chats";
import { useSocket } from "@/hooks/UseSocket";

export const Chat = () => {
  const { id_chat = "" } = useParams<{ id_chat: string }>();
  const { chats, loading: chatsLoading }: any = useContext(ChatsContext);
  const navigate = useNavigate();
  const socket = useSocket("http://localhost:10101");

  // Estados consolidados
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [editing, setEditing] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verificar si el chat existe
  const [chatExists, setChatExists] = useState<boolean | null>(null);

  // Título del chat
  const title = (() => {
    if (chatExists === false) return "Chat no encontrado";

    const chat = chats.find((c: any) => c.id_chat === parseInt(id_chat));
    if (!chat || !currentUserId) return "Chat";

    const isUser1 = chat.id_user1 === currentUserId;
    const nombre = isUser1 ? chat.nombre_user2 : chat.nombre_user1;
    const rol = isUser1 ? chat.rol_user2 : chat.rol_user1;

    return `${nombre} (${rol})`;
  })();

  // Utilidades
  const showError = (err: any, msg: string) => {
    console.error(err);
    setError(err instanceof Error ? err.message : msg);
  };

  const createTempMessage = (
    content: string,
    type: "texto" | "imagen" | "audio" = "texto"
  ): Message => ({
    id_mensaje: Date.now(),
    contenido: content,
    fecha_envio: new Date().toISOString(),
    id_user: currentUserId!,
    id_chat: parseInt(id_chat),
    tipo: type,
    editado: 0,
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

    const userId = currentUserId || (await getCurrentUserId());
    if (!userId) return;

    const tempMsg = createTempMessage(newMessage);
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const response = await MessageService.sendTextMessage(
        newMessage,
        parseInt(id_chat)
      );
      setMessages((prev) =>
        prev.map((m) => (m.id_mensaje === tempMsg.id_mensaje ? response : m))
      );
    } catch (err) {
      showError(err, "No se pudo enviar mensaje");
      setMessages((prev) =>
        prev.filter((m) => m.id_mensaje !== tempMsg.id_mensaje)
      );
    }
  };

  const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.match("image.*")) {
      setError("Solo se permiten imágenes");
      return;
    }

    const userId = currentUserId || (await getCurrentUserId());
    if (!userId) return;

    const tempMsg = createTempMessage(URL.createObjectURL(file), "imagen");
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const response = await MessageService.sendImageMessage(
        file,
        parseInt(id_chat)
      );
      setMessages((prev) =>
        prev.map((m) => (m.id_mensaje === tempMsg.id_mensaje ? response : m))
      );
    } catch (err) {
      showError(err, "No se pudo enviar imagen");
      setMessages((prev) =>
        prev.filter((m) => m.id_mensaje !== tempMsg.id_mensaje)
      );
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder?.stop();
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        const userId = currentUserId || (await getCurrentUserId());
        if (!userId) return;

        const tempMsg = createTempMessage(
          URL.createObjectURL(audioBlob),
          "audio"
        );
        setMessages((prev) => [...prev, tempMsg]);

        try {
          const response = await MessageService.sendAudioMessage(
            audioBlob,
            parseInt(id_chat)
          );
          setMessages((prev) =>
            prev.map((m) =>
              m.id_mensaje === tempMsg.id_mensaje ? response : m
            )
          );
        } catch (err) {
          showError(err, "No se pudo enviar audio");
          setMessages((prev) =>
            prev.filter((m) => m.id_mensaje !== tempMsg.id_mensaje)
          );
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
      const updated = await MessageService.editMessage(
        editing.id,
        editing.content,
        parseInt(id_chat)
      );
      setMessages((prev) =>
        prev.map((m) => (m.id_mensaje === editing.id ? updated : m))
      );
      setEditing(null);
    } catch (err) {
      showError(err, "No se pudo editar mensaje");
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await MessageService.deleteMessage(id, parseInt(id_chat));
      setMessages((prev) => prev.filter((m) => m.id_mensaje !== id));
      setOpenMenu(null);
    } catch (err) {
      showError(err, "No se pudo eliminar mensaje");
    }
  };

  // Effects
  useEffect(() => {
    // Verificar si el chat existe
    if (chatsLoading) return;

    const chat = chats.find((c: any) => c.id_chat === parseInt(id_chat));
    if (!chat) {
      setChatExists(false);
      navigate("/404");
      return;
    }

    setChatExists(true);

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

    init();
  }, [id_chat, chats, chatsLoading, navigate, getCurrentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cerrar menú al hacer clic fuera y animación
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (openMenu === null) return;

      const target = e.target as Element;
      if (
        !target.closest(`[data-menu="${openMenu}"]`) &&
        !target.closest(`[data-menu-btn="${openMenu}"]`)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openMenu]);

  // Socket
  useEffect(() => {
    if (!socket || !id_chat || currentUserId === null || chatExists !== true)
      return;

    socket.emit("join_chat", { chatId: id_chat });

    const handleNewMessage = (msg: any) => {
      if (msg.usuario !== currentUserId) setMessages((prev) => [...prev, msg]);
    };

    const handleUpdatedMessage = (msg: {
      id_mensaje: number;
      contenido: string;
    }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id_mensaje === msg.id_mensaje
            ? { ...m, contenido: msg.contenido, editado: 1 }
            : m
        )
      );
    };

    const handleDeletedMessage = (msgId: number) => {
      setMessages((prev) => prev.filter((m) => m.id_mensaje !== msgId));
    };

    socket.on("new_message", handleNewMessage);
    socket.on("update_message", handleUpdatedMessage);
    socket.on("delete_message", handleDeletedMessage);

    return () => {
      socket.emit("leave_chat", { chatId: id_chat });
      socket.off("new_message", handleNewMessage);
      socket.off("update_message", handleUpdatedMessage);
      socket.off("delete_message", handleDeletedMessage);
    };
  }, [socket, id_chat, currentUserId, chatExists]);

  if (chatExists === null || chatsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-4 text-center text-gray-600">Cargando chat...</div>
      </div>
    );
  }

  if (chatExists === false) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-4 text-center text-red-600">
          Chat no encontrado. Redirigiendo...
        </div>
      </div>
    );
  }

  return (
  <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-white shadow rounded">
  <header className="flex items-center justify-between p-4 border-b border-gray-200">
    <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
  </header>

  <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
    {loading && (
      <p className="text-center text-gray-500">Cargando mensajes...</p>
    )}
    {error && <p className="text-center text-red-500">{error}</p>}
    {!loading && messages.length === 0 && (
      <p className="text-center text-gray-400">No hay mensajes en este chat.</p>
    )}

    {messages.map((msg) => {
      const isMe = msg.id_user === currentUserId;
      return (
        <div
          key={msg.id_mensaje}
          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`relative max-w-[85%] sm:max-w-md px-4 sm:px-8 py-3 sm:py-4 rounded-2xl break-words shadow-lg
              ${
                isMe
                  ? "bg-green-500 text-white ml-auto"
                  : "bg-white text-gray-800 mr-auto"
              }`}
          >
            {msg.tipo === "texto" && (
              <p className="whitespace-pre-wrap text-base leading-relaxed">
                {msg.contenido}
              </p>
            )}
            {msg.tipo === "imagen" && (
              <img
                src={msg.contenido}
                alt="Imagen enviada"
                className="rounded-xl max-w-full h-auto mt-2 cursor-pointer"
                onClick={() => window.open(msg.contenido, "_blank")}
              />
            )}
            {msg.tipo === "audio" && (
              <audio
                controls
                src={msg.contenido}
                className="rounded mt-2 w-full"
              />
            )}
            {msg.editado === 1 && (
              <span className="absolute bottom-1 right-3 text-xs italic opacity-70">
                (editado)
              </span>
            )}

            {isMe && (
              <>
                <button
                  data-menu-btn={msg.id_mensaje}
                  className="absolute -top-4 right-[-20px] p-2 rounded-full bg-white/10 hover:bg-white/30 transition"
                  onClick={() =>
                    setOpenMenu(
                      openMenu === msg.id_mensaje ? null : msg.id_mensaje
                    )
                  }
                  aria-label="Abrir menú de opciones"
                >
                  <FiMoreVertical size={20} color="black" />
                </button>

                {openMenu === msg.id_mensaje && (
                  <div
                    data-menu={msg.id_mensaje}
                    className="absolute top-10 right-[-20px] w-36 bg-white text-black border border-gray-200 rounded-md shadow-lg z-20"
                  >
                    {msg.tipo === "texto" && (
                      <button
                        onClick={() => {
                          setEditing({
                            id: msg.id_mensaje,
                            content: msg.contenido,
                          });
                          setOpenMenu(null);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-t-md"
                      >
                        <FiEdit2 className="mr-2" /> Editar
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id_mensaje)}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-md"
                    >
                      <FiTrash2 className="mr-2" /> Eliminar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    })}

    <div ref={messagesEndRef} />
  </main>

  {editing && (
    <div className="p-3 sm:p-4 border-t border-gray-300 bg-gray-100 flex flex-col sm:flex-row gap-2">
      <input
        className="flex-grow p-2 border border-gray-300 rounded"
        type="text"
        value={editing.content}
        onChange={(e) =>
          setEditing((prev) =>
            prev ? { ...prev, content: e.target.value } : null
          )
        }
      />
      <div className="flex gap-2">
        <button
          onClick={editMessage}
          disabled={!editing.content.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Guardar
        </button>
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  )}

  {!editing && (
    <form
      onSubmit={sendTextMessage}
      className="p-3 sm:p-4 border-t border-gray-300 flex items-center gap-2 flex-wrap"
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Enviar imagen"
        className="p-2 rounded hover:bg-gray-200"
      >
        <FiCamera size={20} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={sendImage}
      />
      <input
        type="text"
        placeholder="Escribe un mensaje"
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-400 min-w-[150px]"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={!newMessage.trim()}
        className="p-2 bg-green-500 text-white rounded disabled:opacity-50"
        aria-label="Enviar mensaje"
      >
        <FiSend size={20} />
      </button>
      <button
        type="button"
        onClick={toggleRecording}
        aria-label={recording ? "Detener grabación" : "Grabar audio"}
        className={`p-2 rounded ${
          recording ? "bg-red-500 text-white" : "hover:bg-gray-200"
        }`}
      >
        <FiMic size={20} />
      </button>
    </form>
  )}
</div>

  );
};
