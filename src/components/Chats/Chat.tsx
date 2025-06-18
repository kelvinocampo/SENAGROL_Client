  import { AuthService } from "@/services/AuthService";
  import { MessageService, Message } from "@/services/Chats/MessageService";
  import { useState, useEffect, useRef, useContext, useCallback } from "react";
  import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
  import { useParams, useNavigate } from "react-router-dom";
  import {
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiSend,
    FiCamera,
    FiMic,
    FiUserX,
  } from "react-icons/fi";
  import { ChatsContext } from "@/contexts/Chats";
  import { useSocket } from "@/hooks/UseSocket";

  export const Chat = () => {
    const { id_chat = "" } = useParams<{ id_chat: string }>();
    const { chats, loading: chatsLoading }: any = useContext(ChatsContext);
    const navigate = useNavigate();
    const socket = useSocket("http://localhost:10101");

    /* ─── ConfirmDialog ─────────────────────────────────────────────── */
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const confirmAction = useRef<() => void>(() => {});

    const openConfirmDialog = (
      title: string,
      message: string,
      action: () => void
    ) => {
      setConfirmTitle(title);
      setConfirmMessage(message);
      confirmAction.current = action;
      setConfirmOpen(true);
    };

    /* ─── Estados generales ────────────────────────────────────────── */
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [editing, setEditing] = useState<{ id: number; content: string } | null>(
      null
    );
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [_, setBlockedUserId] = useState<number | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [chatExists, setChatExists] = useState<boolean | null>(null);

    /* ─── Chat y bloqueo ────────────────────────────────────────────── */
    const currentChat =
      chats.find((c: any) => c.id_chat === parseInt(id_chat)) || null;

    const title = (() => {
      if (chatExists === false) return "Chat no encontrado";
      if (!currentChat || !currentUserId) return "Chat";

      const isUser1 = currentChat.id_user1 === currentUserId;
      const nombre = isUser1
        ? currentChat.nombre_user2
        : currentChat.nombre_user1;
      const rol = isUser1 ? currentChat.rol_user2 : currentChat.rol_user1;
      return `${nombre} (${rol})`;
    })();

    const showError = (err: any, msg: string) => {
      console.error(err);
      setError(err instanceof Error ? err.message : msg);
    };

  const verifyBlockStatus = (userId: number, chat: any) => {
    const isUser1 = chat.id_user1 === userId;
    
    // Verificar si yo he bloqueado el chat
    const iBlockedThisChat = isUser1 
      ? chat.bloqueado_user1 === 1 
      : chat.bloqueado_user2 === 1;
    
    // Verificar si el otro usuario ha bloqueado el chat
    const otherUserBlocked = isUser1
      ? chat.bloqueado_user2 === 1
      : chat.bloqueado_user1 === 1;

    // El chat está bloqueado si alguno de los dos lo bloqueó
    const chatIsBlocked = iBlockedThisChat || otherUserBlocked;
    
    setIsBlocked(chatIsBlocked);
    setBlockedUserId(chatIsBlocked ? (isUser1 ? chat.id_user2 : chat.id_user1) : null);
  };
    const getCurrentUserId = useCallback(async () => {
      try {
        const id = await AuthService.getIDUser();
        setCurrentUserId(id);
        if (currentChat) verifyBlockStatus(id, currentChat);
        return id;
      } catch (err) {
        showError(err, "Error al cargar usuario");
        return null;
      }
    }, [currentChat]);

    const checkIfBlocked = () => {
      if (currentChat && currentUserId) verifyBlockStatus(currentUserId, currentChat);
    };

const createTempMessage = (
  content: string,
  type: "texto" | "imagen" | "audio" = "texto"
): Message => {
  // Usa un timestamp más un número aleatorio para evitar colisiones
  const tempId = -Math.floor(Math.random() * 1000000) - Date.now();
  return {
    id_mensaje: tempId,
    contenido: content,
    fecha_envio: new Date().toISOString(),
    id_user: currentUserId!,
    id_chat: parseInt(id_chat),
    tipo: type,
    editado: 0,
  };
};

const sendTextMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isBlocked || !newMessage.trim()) return;

  // Crear mensaje temporal
  const tempMsg = createTempMessage(newMessage);
  setMessages((prev) => [...prev, tempMsg]);
  setNewMessage("");

  try {
    // 1. Enviar mensaje al servidor
    const response = await MessageService.sendTextMessage(newMessage, parseInt(id_chat));
    
    // 2. Verificar la estructura de la respuesta
    console.log("Respuesta completa del servidor:", response);
    
    // 3. Validar que la respuesta tenga la estructura esperada
    if (!response || typeof response.id_mensaje !== 'number') {
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    // 4. Crear el mensaje real con los datos del servidor
    const realMessage: Message = {
      id_mensaje: response.id_mensaje,
      contenido: response.contenido,
      fecha_envio: response.fecha_envio,
      id_user: response.id_user,
      id_chat: response.id_chat,
      tipo: response.tipo,
      editado: response.editado || 0
    };

    // 5. Reemplazar mensaje temporal con el real
    setMessages((prev) =>
      prev.map((msg) => 
        msg.id_mensaje === tempMsg.id_mensaje ? realMessage : msg
      )
    );
    
  } catch (err) {
    // 6. Si falla, eliminar el mensaje temporal
    setMessages((prev) => 
      prev.filter((msg) => msg.id_mensaje !== tempMsg.id_mensaje)
    );
    showError(err, "Error al enviar el mensaje");
  }
};

    /* ─── Mensajes: enviar imagen ──────────────────────────────────── */
 const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (isBlocked) {
    setError("No puedes enviar mensajes a usuarios bloqueados");
    fileInputRef.current && (fileInputRef.current.value = "");
    return;
  }

  const file = e.target.files?.[0];
  if (!file || !file.type.match("image.*")) {
    setError("Solo se permiten imágenes");
    return;
  }

  openConfirmDialog(
    "Enviar imagen",
    "¿Estás seguro de que quieres enviar esta imagen?",
    async () => {
      const userId = currentUserId || (await getCurrentUserId());
      if (!userId) return;

      // Crear mensaje temporal con URL de objeto blob
      const tempMsg = createTempMessage(URL.createObjectURL(file), "imagen");
      setMessages((p) => [...p, tempMsg]);

      try {
        const res = await MessageService.sendImageMessage(file, parseInt(id_chat));
        
        // Verificar la respuesta del servidor
        console.log("Respuesta de imagen:", res);
        
        // Reemplazar mensaje temporal con el real
        setMessages((p) => 
          p.map((m) => 
            m.id_mensaje === tempMsg.id_mensaje 
              ? {
                  ...res,
                  contenido: res.contenido // Asegúrate que esto sea la URL final de la imagen
                } 
              : m
          )
        );
      } catch (err) {
        showError(err, "No se pudo enviar imagen");
        setMessages((p) => p.filter((m) => m.id_mensaje !== tempMsg.id_mensaje));
      } finally {
        fileInputRef.current && (fileInputRef.current.value = "");
      }
    }
  );
};

    /* ─── Grabación de audio ───────────────────────────────────────── */
    const toggleRecording = async () => {
      if (recording) {
        mediaRecorder?.stop();
        setRecording(false);
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          setAudioChunks([]);

          recorder.ondataavailable = (e) => e.data.size > 0 && setAudioChunks((p) => [...p, e.data]);

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            /* TODO: subir audioBlob */
            console.log("Audio grabado:", audioBlob);
            stream.getTracks().forEach((t) => t.stop());
          };

          recorder.start();
          setRecording(true);
        } catch (err) {
          console.error("Error al acceder al micrófono:", err);
        }
      }
    };

    const cancelRecording = () => {
      if (mediaRecorder && recording) {
        mediaRecorder.stop();
        setAudioChunks([]);
        setRecording(false);
        console.log("Grabación cancelada.");
      }
    };

    /* ─── Editar / eliminar mensaje ────────────────────────────────── */
    const editMessage = async () => {
      if (!editing || isBlocked) return;
      try {
        const upd = await MessageService.editMessage(
          editing.id,
          editing.content,
          parseInt(id_chat)
        );
        setMessages((p) => p.map((m) => (m.id_mensaje === editing.id ? upd : m)));
        setEditing(null);
      } catch (err) {
        showError(err, "No se pudo editar mensaje");
      }
    };

    const deleteMessage = async (id: number) => {
      try {
        await MessageService.deleteMessage(id, parseInt(id_chat));
        setMessages((p) => p.filter((m) => m.id_mensaje !== id));
        setOpenMenu(null);
      } catch (err) {
        showError(err, "No se pudo eliminar mensaje");
      }
    };

    /* ─── Carga inicial del chat ───────────────────────────────────── */
    useEffect(() => {
      if (chatsLoading) return;

      const chat = chats.find((c: any) => c.id_chat === parseInt(id_chat));
      if (!chat) {
        setChatExists(false);
        navigate("/404");
        return;
      }

      setChatExists(true);

      (async () => {
        try {
          setLoading(true);
          await getCurrentUserId();
          checkIfBlocked();
          const msgs = await MessageService.getMessages(parseInt(id_chat));
          setMessages(msgs);
        } catch (err) {
          showError(err, "Error al cargar mensajes");
        } finally {
          setLoading(false);
        }
      })();
    }, [id_chat, chats, chatsLoading, navigate, getCurrentUserId]);

    /* ─── Scroll al último mensaje ─────────────────────────────────── */
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ─── Cierre de menú al clic afuera ────────────────────────────── */
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          openMenu !== null &&
          !(
            (e.target as Element).closest(`[data-menu="${openMenu}"]`) ||
            (e.target as Element).closest(`[data-menu-btn="${openMenu}"]`)
          )
        ) {
          setOpenMenu(null);
        }
      };
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }, [openMenu]);

    /* ─── Sockets ──────────────────────────────────────────────────── */
    useEffect(() => {
      if (!socket || !id_chat || currentUserId === null || chatExists !== true) return;

      socket.emit("join_chat", { chatId: id_chat });

      const onNew = (msg: any) => msg.usuario !== currentUserId && setMessages((p) => [...p, msg]);
      const onUpd = (m: { id_mensaje: number; contenido: string }) =>
        setMessages((p) =>
          p.map((msg) => (msg.id_mensaje === m.id_mensaje ? { ...msg, contenido: m.contenido, editado: 1 } : msg))
        );
      const onDel = (id: number) => setMessages((p) => p.filter((msg) => msg.id_mensaje !== id));

      socket.on("new_message", onNew);
      socket.on("update_message", onUpd);
      socket.on("delete_message", onDel);

      return () => {
        socket.emit("leave_chat", { chatId: id_chat });
        socket.off("new_message", onNew);
        socket.off("update_message", onUpd);
        socket.off("delete_message", onDel);
      };
    }, [socket, id_chat, currentUserId, chatExists]);

    /* ─── Render ───────────────────────────────────────────────────── */
    if (chatExists === null || chatsLoading)
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      );
    if (chatExists === false)
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-600">Chat no encontrado. Redirigiendo…</p>
        </div>
      );

    return (
      <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-white shadow rounded">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
            {isBlocked && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center">
                <FiUserX className="mr-1" /> Bloqueado
              </span>
            )}
          </div>
        </header>

        {/* Mensajes */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
          {loading && <p className="text-center text-gray-500">Cargando mensajes…</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && messages.length === 0 && (
            <p className="text-center text-gray-400">No hay mensajes en este chat.</p>
          )}

          {messages.map((msg) => {
            const isMe = msg.id_user === currentUserId;
                 console.log(msg.id_mensaje);
            return (
              <div key={msg.id_mensaje} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative max-w-[85%] sm:max-w-md px-4 sm:px-8 py-3 sm:py-4 rounded-2xl break-words shadow-lg ${
                    isMe ? "bg-green-500 text-white ml-auto" : "bg-white text-gray-800 mr-auto"
                  }`}
                >
                  {/* Contenido */}
                  {msg.tipo === "texto" && <p className="whitespace-pre-wrap">{msg.contenido}</p>}
                  {msg.tipo === "imagen" && (
                    <img
                      src={msg.contenido}
                      alt="Imagen enviada"
                      className="rounded-xl max-w-full h-auto mt-2 cursor-pointer"
                      onClick={() => window.open(msg.contenido, "_blank")}
                    />
                  )}
                  {msg.tipo === "audio" && <audio controls src={msg.contenido} className="mt-2 w-full" />}
                  {msg.editado === 1 && (
                    <span className="absolute bottom-1 right-3 text-xs italic opacity-70">(editado)</span>
                  )}

                  {/* Menú de mi mensaje */}
                  {isMe && (
                    <>
                      <button
                        data-menu-btn={msg.id_mensaje}
                        className="absolute -top-4 right-[-20px] p-2 rounded-full bg-white/10 hover:bg-white/30 transition"
                        onClick={() => setOpenMenu(openMenu === msg.id_mensaje ? null : msg.id_mensaje)}
                        aria-label="Abrir menú de opciones"
                      >
                        <FiMoreVertical  className=" text-black" size={20} />
                      </button>

                      {openMenu === msg.id_mensaje && (
                        <div
                          data-menu={msg.id_mensaje}
                          className="absolute top-10 right-[-20px] w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20 text-black"
                        >
                          {msg.tipo === "texto" && (
                            <button
                              onClick={() => {
                                setEditing({ id: msg.id_mensaje, content: msg.contenido });
                                setOpenMenu(null);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm  rounded-t-md"
                            >
                              <FiEdit2 className="mr-2 text-black" /> Editar
                            </button>
                          )}
                          <button
                            onClick={() =>
                              openConfirmDialog(
                                "Eliminar mensaje",
                                "¿Seguro que deseas eliminar este mensaje? Esta acción no se puede deshacer.",
                                () => deleteMessage(msg.id_mensaje)
                              )
                            }
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

        {/* Edición */}
        {editing && (
          <div className="p-3 sm:p-4 border-t border-gray-300 bg-gray-100 flex flex-col sm:flex-row gap-2">
            <input
              className="flex-grow p-2 border border-gray-300 rounded"
              type="text"
              value={editing.content}
              onChange={(e) =>
                setEditing((p) => (p ? { ...p, content: e.target.value } : null))
              }
              disabled={isBlocked}
            />
            <div className="flex gap-2">
              <button
                onClick={editMessage}
                disabled={!editing.content.trim() || isBlocked}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              >
                Guardar
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Entrada normal */}
      
  {!editing && (
    <form
      onSubmit={sendTextMessage}
      className={`p-3 sm:p-4 border-t border-gray-300 flex items-center gap-2 flex-wrap ${
        isBlocked ? "bg-gray-100" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => !isBlocked && fileInputRef.current?.click()}
        aria-label="Enviar imagen"
        className={`p-2 rounded ${
          isBlocked ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        disabled={isBlocked}
      >
        <FiCamera size={20} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={!isBlocked ? sendImage : undefined}
        disabled={isBlocked}
      />

      <input
        type="text"
        placeholder={isBlocked ? "Chat bloqueado" : "Escribe un mensaje"}
        className={`flex-grow border border-gray-300 rounded px-3 py-2 min-w-[150px] ${
          isBlocked ? "bg-gray-200 cursor-not-allowed" : "focus:ring focus:ring-green-400"
        }`}
        value={newMessage}
        onChange={(e) => !isBlocked && setNewMessage(e.target.value)}
        disabled={isBlocked}
      />

      <button
        type="submit"
        disabled={isBlocked || !newMessage.trim()}
        className={`p-2 rounded ${
          isBlocked ? "bg-gray-300 text-gray-500" : "bg-green-500 text-white"
        }`}
        aria-label="Enviar mensaje"
      >
        <FiSend size={20} />
      </button>

      {/* Audio */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={!isBlocked ? toggleRecording : undefined}
          aria-label={recording ? "Detener grabación" : "Grabar audio"}
          className={`p-2 rounded ${
            isBlocked 
              ? "text-gray-400 cursor-not-allowed" 
              : recording 
                ? "bg-red-500 text-white" 
                : "hover:bg-gray-200"
          }`}
          disabled={isBlocked}
        >
          <FiMic size={20} />
        </button>

        {recording && (
          <button
            type="button"
            onClick={cancelRecording}
            aria-label="Cancelar grabación"
            className="p-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )}

        {/* ConfirmDialog */}
        <ConfirmDialog
      isOpen={confirmOpen}
      onClose={() => {
          setConfirmOpen(false);
          fileInputRef.current && (fileInputRef.current.value = "");
      }}
      onConfirm={() => {
          confirmAction.current();
          setConfirmOpen(false);
      }}
      title={confirmTitle}
      message={confirmMessage}
  />
      </div>
    );
  };
