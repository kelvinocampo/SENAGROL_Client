import { AuthService } from "@/services/AuthService";
import { MessageService, Message } from "@/services/Chats/MessageService";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { useParams, useNavigate } from "react-router-dom";
import { FiUserX } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { IoIosMore, IoMdSend } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { ChatsContext } from "@/contexts/Chats";
import { useSocket } from "@/hooks/UseSocket";

interface Chat {
  id_chat: number;
  id_user1: number;
  id_user2: number;
  nombre_user1: string;
  nombre_user2: string;
  rol_user1: string;
  rol_user2: string;
  bloqueado_user1: number;
  bloqueado_user2: number;
}

const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Error al acceder a localStorage:", e);
  }
};

export const Chat = () => {
  /* ─── Hooks / Context ─────────────────────────────────────────── */
  const { id_chat = "" } = useParams<{ id_chat: string }>();
  const { chats, loading: chatsLoading } = useContext(ChatsContext);
  const navigate = useNavigate();
  const socket = useSocket("http://localhost:10101");

  /* ─── ConfirmDialog ───────────────────────────────────────────── */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmAction = useRef<() => void>(() => { });

  const openConfirmDialog = (
    title: string,
    message: string,
    action: () => void,
  ) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    confirmAction.current = action;
    setConfirmOpen(true);
  };

  const getSupportedMimeType = (): string => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
      "audio/wav"
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return ""; // fallback
  };

  /* ─── Estados generales ───────────────────────────────────────── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [editing, setEditing] = useState<{ id: number; content: string } | null>(
    null,
  );
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUserId, setBlockedUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatExists, setChatExists] = useState<boolean | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ─── Chat & bloqueo ──────────────────────────────────────────── */
  const chatIdParsed = parseInt(id_chat);
  const currentChat: Chat | null = !isNaN(chatIdParsed)
    ? chats.find((c) => c.id_chat === chatIdParsed) || null
    : null;

  const showError = (err: unknown, fallback: string) => {
    console.error(err);
    setError(err instanceof Error ? err.message : fallback);
  };

  /* ─── Bloqueo helpers ─────────────────────────────────────────── */
  const verifyBlockStatus = useCallback((userId: number, chat: Chat) => {
    if (!chat) return;

    const isUser1 = chat.id_user1 === userId;
    const iBlocked = isUser1 ? chat.bloqueado_user1 === 1 : chat.bloqueado_user2 === 1;
    const otherBlocked = isUser1 ? chat.bloqueado_user2 === 1 : chat.bloqueado_user1 === 1;

    const blocked = iBlocked || otherBlocked;
    setIsBlocked(blocked);
    setBlockedUserId(blocked ? (isUser1 ? chat.id_user2 : chat.id_user1) : null);
  }, []);

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
  }, [currentChat, verifyBlockStatus]);

  const checkIfBlocked = useCallback(() => {
    if (currentChat && currentUserId) verifyBlockStatus(currentUserId, currentChat);
  }, [currentChat, currentUserId, verifyBlockStatus]);

  /* ─── Utilidades de mensajes ──────────────────────────────────── */
  const createTempMessage = (
    content: string,
    type: "texto" | "imagen" | "audio" = "texto",
  ): Message => {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    return {
      id_mensaje: -Math.floor(Math.random() * 1_000_000) - Date.now(),
      contenido: content,
      fecha_envio: new Date().toISOString(),
      id_user: currentUserId!,
      id_chat: chatIdParsed,
      tipo: type,
      editado: 0,
      estado: "enviando",
      tempId,
    } as Message;
  };

  /* ─── Envío de texto ──────────────────────────────────────────── */
  const sendTextMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    if (isBlocked && blockedUserId !== currentUserId) {
      setError("No puedes enviar mensajes a este usuario porque te ha bloqueado.");
      return;
    }

    const tempMsg = createTempMessage(newMessage);
    setMessages((p) => [...p, tempMsg]);
    setNewMessage("");

    try {
      const response = await MessageService.sendTextMessage(newMessage, chatIdParsed);

      const realMessage: Message = {
        id_mensaje: response.id_mensaje,
        contenido: response.contenido,
        fecha_envio: response.fecha_envio,
        id_user: response.id_user,
        id_chat: response.id_chat,
        tipo: response.tipo,
        editado: response.editado ? 1 : 0,
      };

      setMessages((prev) => prev.map((m) => (m.tempId === tempMsg.tempId ? realMessage : m)));
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.tempId !== tempMsg.tempId));
      showError(err, "Error al enviar el mensaje");
    }
  };

  /* ─── Envío de imagen ─────────────────────────────────────────── */
  const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isBlocked) {
      setError("No puedes enviar mensajes a usuarios bloqueados");
      fileInputRef.current && (fileInputRef.current.value = "");
      return;
    }

    const file = e.target.files?.[0];
    if (!file || !file.type.match("image.*")) {
      setError("Solo se permiten imágenes");
      fileInputRef.current && (fileInputRef.current.value = "");
      return;
    }

    openConfirmDialog("Enviar imagen", "¿Estás seguro de enviar esta imagen?", async () => {
      try {
        await MessageService.sendImageMessage(file, chatIdParsed);
      } catch (err) {
        showError(err, "No se pudo enviar imagen");
      } finally {
        fileInputRef.current && (fileInputRef.current.value = "");
      }
    });
  };

  /* ─── Grabación y envío de audio ──────────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = async () => {
        if (audioChunks.length === 0) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        const blob = new Blob(audioChunks, { type: mimeType || "audio/webm" });
        const tempMsg = createTempMessage(URL.createObjectURL(blob), "audio");
        setMessages(p => [...p, tempMsg]);

        try {
          await MessageService.sendAudioMessage(blob, chatIdParsed);
        } catch (err) {
          showError(err, "Error al enviar audio");
          setMessages(p => p.filter(m => (m as any).tempId !== tempMsg.tempId));
        } finally {
          stream.getTracks().forEach(t => t.stop());
          setAudioChunks([]);
        }
      };

      recorder.start(100); // Collect data every 100ms
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingSeconds(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      setError("No se pudo acceder al micrófono");
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setAudioChunks([]);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  /* ─── Editar / eliminar ───────────────────────────────────────── */
  const editMessage = async () => {
    if (!editing || isBlocked) return;
    try {
      const updated = await MessageService.editMessage(editing.id, editing.content, chatIdParsed);
      setMessages((p) => p.map((m) => (m.id_mensaje === editing.id ? updated : m)));
      setEditing(null);
    } catch (err) {
      showError(err, "No se pudo editar mensaje");
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await MessageService.deleteMessage(id, chatIdParsed);
      setMessages((p) => p.filter((m) => m.id_mensaje !== id));
      setOpenMenu(null);
    } catch (err) {
      showError(err, "No se pudo eliminar mensaje");
    }
  };
  
  const isUser1 = currentChat?.id_user1 === currentUserId;
  const nombreUsuario = currentChat
    ? isUser1
      ? currentChat.nombre_user2
      : currentChat.nombre_user1
    : "";

  const rolUsuario = currentChat
    ? (isUser1
      ? currentChat.rol_user2
      : currentChat.rol_user1
    ).split(",").map(r => r.trim())
    : [];

  /* ─── Socket listeners ────────────────────────────────────────── */
  useEffect(() => {
    if (!socket || currentUserId == null || chatExists !== true) return;

    socket.emit("join_chat", { chatId: id_chat });

    const onNew = (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id_mensaje === msg.id_mensaje)) return prev;
        const idx = prev.findIndex(
          (m) => m.estado === "enviando" && m.id_user === msg.id_user && m.tipo === msg.tipo,
        );
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...msg, estado: "enviado" } as Message;
          return copy;
        }
        return [...prev, msg];
      });
    };

    socket.on("new_message", onNew);

    return () => {
      socket.emit("leave_chat", { chatId: id_chat });
      socket.off("new_message", onNew);
    };
  }, [socket, id_chat, currentUserId, chatExists]);

  /* ─── Carga inicial y actualizaciones ─────────────────────────── */
  useEffect(() => {
    // Cleanup recording interval on unmount
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Cargar último chat visitado al inicio
    try {
      const lastChatId = localStorage.getItem("lastChatId");
      if (lastChatId && !id_chat) {
        navigate(`chat/${lastChatId}`);
      }
    } catch (e) {
      console.error("Error al leer localStorage:", e);
    }
  }, [id_chat, navigate]);

  useEffect(() => {
    if (chatsLoading) return; // Espera a que termine de cargar

    const chat = chats.find((c: any) => c.id_chat === parseInt(id_chat));

    if (!chat) {
      setChatExists(false);
      return;
    }

    setChatExists(true);

    const loadData = async () => {
      try {
        setLoading(true);
        const userId = await getCurrentUserId();
        if (!userId) return;

        checkIfBlocked();

        const msgs = await MessageService.getMessages(parseInt(id_chat));
        const uniqueMessages = Array.from(
          new Map(msgs.map((m) => [m.id_mensaje, m])).values()
        );
        setMessages(uniqueMessages);
      } catch (err) {
        showError(err, "Error al cargar mensajes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id_chat, chats, chatsLoading, navigate, getCurrentUserId, checkIfBlocked]);

  // Guardar el último chat visitado
  useEffect(() => {
    if (chatExists === true && chatIdParsed && !isNaN(chatIdParsed)) {
      safeSetLocalStorage("lastChatId", String(chatIdParsed));
    }
  }, [chatExists, chatIdParsed]);

  /* ─── Scroll al final ─────────────────────────────────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ─── Cierre menú fuera de click ─────────────────────────────── */
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

  if (chatExists === false) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">Chat no encontrado. Redirigiendo…</p>
      </div>
    );
  }

  return (
    <div className=" flex flex-col h-150 w-full font-[Fredoka]">
      {/* ╭─ Header ────────────────────────────────────────────╮ */}
      <header className="px-4 py-3 border-b border-black/10">
        <div className="flex items-center justify-between">
          <div>
            {/* Nombre */}
            <h2 className="font-semibold text-sm sm:text-base truncate">
              {nombreUsuario}
            </h2>

            {/* Roles */}
            <div className="text-xs text-gray-600 mt-0.5">
              {rolUsuario.join(", ")}
            </div>
          </div>

          {/* Estado bloqueado */}
          {isBlocked && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-600 px-2 py-[2px] rounded-full">
              <FiUserX /> Bloqueado
            </span>
          )}
        </div>
      </header>
      {/* ╭─ Lista de mensajes ────────────────────────────────╮ */}
      <main className="flex-1 min-h-0 overflow-auto px-4 py-5 space-y-6">
        {loading && <p className="text-center text-gray-500">Cargando…</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-500">No hay mensajes.</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.id_user === currentUserId;
          const bubble = isMe
            ? "bg-[#D9D9D9] text-black"
            : "bg-[#D9D9D9] text-black";
          const align = isMe ? "justify-end" : "justify-start";
          const pending = msg.estado === "enviando";

          // Si estamos editando este mensaje, mostramos el formulario de edición
          if (editing?.id === msg.id_mensaje) {
            return (
              <div key={`edit-${msg.id_mensaje}`} className={`flex ${align} gap-2`}>
                {!isMe && (
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black mt-[4px]">
                    <FaCircleUser size={60} className="text-[#48BD28]" />
                  </div>
                )}

                <div className="relative group max-w-[70%]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      editMessage();
                    }}
                    className="bg-[#D9D9D9] rounded-2xl px-4 py-2 shadow"
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        title="Cancelar edición"
                        className="text-black hover:text-red-800 mr-2"
                      >
                        <IoClose size={18} />
                      </button>
                      
                      <input
                        type="text"
                        className="flex-grow bg-transparent text-sm outline-none"
                        value={editing.content}
                        onChange={(e) =>
                          setEditing({ ...editing, content: e.target.value })
                        }
                        autoFocus
                      />
                      
                      <button
                        type="submit"
                        title="Guardar cambios"
                        className="text-green-800 hover:text-green-900 ml-2"
                      >
                        <IoMdSend size={20} />
                      </button>
                    </div>
                  </form>
                </div>

                {isMe && (
                  <div className="flex items-center justify-center w-7 h-7 mt-[4px]">
                    <FaCircleUser size={60} className="text-[#1B7D00]" />
                  </div>
                )}
              </div>
            );
          }

          // Mensaje normal (no en edición)
          return (
            <div key={msg.id_mensaje} className={`flex ${align} gap-2`}>
              {!isMe && (
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black mt-[4px]">
                  <FaCircleUser size={60} className="text-[#48BD28]" />
                </div>
              )}

              {/* Contenedor del mensaje + menú */}
              <div className="relative group max-w-[70%]">
                {/* Botón del menú (3 puntos) */}
                {isMe && (
                  <button
                    data-menu-btn={msg.id_mensaje}
                    onClick={() =>
                      setOpenMenu(openMenu === msg.id_mensaje ? null : msg.id_mensaje)
                    }
                    className={`absolute -left-10 ${msg.tipo === "imagen" ? "top-1/2 -translate-y-1/2" : "top-3"
                      } p-1.5 text-black`}
                  >
                    <IoIosMore />
                  </button>
                )}

                {/* Burbuja o contenido directamente */}
                {msg.tipo === "imagen" ? (
                  <img
                    src={msg.contenido}
                    alt="img"
                    className="rounded-xl max-w-xs cursor-pointer shadow-none bg-transparent"
                    onClick={() => window.open(msg.contenido, "_blank")}
                  />
                ) : (
                  <div
                    className={`rounded-2xl px-4 py-2 shadow ${bubble} ${pending ? "opacity-60" : ""
                      }`}
                  >
                    {/* Contenido de texto o audio */}
                    {msg.tipo === "texto" && (
                      <p className="whitespace-pre-wrap">{msg.contenido}</p>
                    )}

                    {msg.tipo === "audio" && (
                      <audio controls src={msg.contenido} className="w-48" />
                    )}

                    {/* Etiquetas */}
                    <div className="flex justify-end text-[10px] gap-2 mt-1">
                      {msg.editado === 1 && (
                        <span className="italic opacity-70">(editado)</span>
                      )}
                      {pending && <span className="animate-pulse">Enviando…</span>}
                    </div>
                  </div>
                )}

                {/* Menú desplegable */}
                {openMenu === msg.id_mensaje && isMe && (
                  <div
                    data-menu={msg.id_mensaje}
                    className="absolute right-30 top-5 w-40 bg-[#48BD28] rounded z-20 overflow-hidden"
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
                        className="flex items-center w-38 m-1 rounded-lg px-3 py-2 text-white hover:bg-white hover:text-black"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() =>
                        openConfirmDialog(
                          "Eliminar mensaje",
                          "¿Seguro que deseas eliminar este mensaje? Esta acción no se puede deshacer.",
                          () => deleteMessage(msg.id_mensaje),
                        )
                      }
                      className="flex items-center w-38 m-1 rounded-lg px-3 py-2 text-white hover:bg-white hover:text-black"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar propio */}
              {isMe && (
                <div className="flex items-center justify-center w-7 h-7 mt-[4px]">
                  <FaCircleUser size={60} className="text-[#1B7D00]" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* ╭─ Formulario de envío de mensajes ────────────────────────╮ */}
      
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (recording) {
              mediaRecorder?.stop();
              setRecording(false);
            } else {
              sendTextMessage(e);
            }
          }}
          className="flex items-center gap-3 border-t border-black/10 px-4 py-3 bg-white"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={sendImage}
          />
          <button
            type="button"
            onClick={() => !isBlocked && fileInputRef.current?.click()}
            className={`${isBlocked ? "text-gray-300" : "text-[#1B7D00] hover:text-[#2e7c19]"
              }`}
            disabled={isBlocked}
          >
            <MdPhotoSizeSelectActual size={24} />
          </button>

          {recording ? (
            <div className="flex-grow w-full bg-green-100 border border-black rounded-lg px-4 py-2 shadow-sm flex items-center gap-3">
              {/* Tiempo */}
              <span className="text-xs font-semibold w-10">
                00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </span>
              <div className="flex flex-grow gap-[3px] items-end h-6 overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[19px] bg-green-700 rounded-sm"
                    style={{
                      height: `${30 + Math.random() * 50}%`,
                      animation: `bounce 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                title="Enviar audio"
                className="text-[#1B7D00] hover:text-[#2e7c19] p-2 rounded-full"
              >
                <IoMdSend size={22} />
              </button>
              <button
                type="button"
                title="Cancelar grabación"
                onClick={cancelRecording}
                className="text-[#1B7D00] p-2 rounded-full"
              >
                <IoClose size={22} />
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Escribe tu mensaje…"
                className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                value={newMessage}
                onChange={(e) => !isBlocked && setNewMessage(e.target.value)}
                disabled={isBlocked}
              />

              <button
                type="submit"
                disabled={isBlocked || !newMessage.trim()}
                className={`${isBlocked ? "text-gray-300" : "text-[#1B7D00] hover:text-[#2e7c19]"
                  }`}
              >
                <IoMdSend size={24} />
              </button>

              <button
                type="button"
                onClick={!isBlocked ? toggleRecording : undefined}
                className={`${isBlocked ? "text-gray-300" : "text-[#1B7D00] hover:text-[#2e7c19]"
                  }`}
                disabled={isBlocked}
              >
                <FaMicrophone size={24} />
              </button>
            </>
          )}
        </form>
      

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
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