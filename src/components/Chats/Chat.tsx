import { AuthService } from "@/services/AuthService";
import { MessageService, Message } from "@/services/Chats/MessageService";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2, FiMic, FiSend, FiCamera, FiTrash2, FiUserX, FiMoreVertical, FiX } from "react-icons/fi";

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
const { chats, loading: chatsLoading} = useContext(ChatsContext);
  const navigate = useNavigate();
  const socket = useSocket("http://localhost:10101");

  /* ─── ConfirmDialog ───────────────────────────────────────────── */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmAction = useRef<() => void>(() => {});

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
  const [editing, setEditing] = useState<{ id: number; content: string } | null>(
    null,
  );
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUserId, setBlockedUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatExists, setChatExists] = useState<boolean | null>(null);

  /* ─── Chat & bloqueo ──────────────────────────────────────────── */
  const chatIdParsed = parseInt(id_chat);
  const currentChat: Chat | null = !isNaN(chatIdParsed)
    ? chats.find((c) => c.id_chat === chatIdParsed) || null
    : null;

  const title = (() => {
    if (chatExists === false) return "Chat no encontrado";
    if (!currentChat || !currentUserId) return "Cargando chat…";

    const isUser1 = currentChat.id_user1 === currentUserId;
    const nombre = isUser1 ? currentChat.nombre_user2 : currentChat.nombre_user1;
    const rol = isUser1 ? currentChat.rol_user2 : currentChat.rol_user1;
    return `${nombre} (${rol})`;
  })();

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
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder?.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (chunks.length === 0) return;

        const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
        const tempMsg = createTempMessage(URL.createObjectURL(blob), "audio");
        setMessages(p => [...p, tempMsg]);

        try {
          await MessageService.sendAudioMessage(blob, chatIdParsed);
        } catch (err) {
          showError(err, "Error al enviar audio");
          setMessages(p => p.filter(m => (m as any).tempId !== tempMsg.tempId));
        } finally {
          stream.getTracks().forEach(t => t.stop());
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      setError("No se pudo acceder al micrófono");
      setRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
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

  /* ------------------------- RETURN ------------------------ */
return (
  <div className="flex flex-col h-screen w-full bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] font-[Fredoka]">
    {/* ╭─ Header ────────────────────────────────────────────╮ */}
    <header className="flex items-center justify-between px-4 py-3 border-b border-black/10">
      <h2 className="font-semibold text-sm sm:text-base truncate">{title}</h2>

      {isBlocked && (
        <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-600 px-2 py-[2px] rounded-full">
          <FiUserX /> Bloqueado
        </span>
      )}
    </header>

    {/* ╭─ Lista de mensajes ────────────────────────────────╮ */}
    <main className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
      {loading && <p className="text-center text-gray-500">Cargando…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-500">No hay mensajes.</p>
      )}

      {messages.map((msg) => {
        const isMe = msg.id_user === currentUserId;
        const bubble = isMe
          ? "bg-[#48BD28] text-white"
          : "bg-[#F3F4F6] text-black";
        const align = isMe ? "justify-end" : "justify-start";
        const pending = msg.estado === "enviando";

        return (
          <div key={msg.id_mensaje} className={`flex ${align} gap-2`}>
            {/* Avatar */}
            {!isMe && (
              <FiUserX size={28} className="text-black shrink-0" />
            )}

            {/* Burbuja + menú */}
            <div className="relative group max-w-[70%]">
              {isMe && (
                <button
                  data-menu-btn={msg.id_mensaje}
                  onClick={() =>
                    setOpenMenu(
                      openMenu === msg.id_mensaje ? null : msg.id_mensaje,
                    )
                  }
                  className="absolute -right-6 top-1 p-1 hidden group-hover:block text-black/60 hover:text-black"
                >
                  {openMenu === msg.id_mensaje ? <FiX /> : <FiMoreVertical />}
                </button>
              )}

              <div
                className={`rounded-2xl px-4 py-2 shadow ${bubble} ${
                  pending && "opacity-60"
                }`}
              >
                {/* Contenidos por tipo */}
                {msg.tipo === "texto" && (
                  <p className="whitespace-pre-wrap">{msg.contenido}</p>
                )}

                {msg.tipo === "imagen" && (
                  <img
                    src={msg.contenido}
                    alt="img"
                    className="rounded-xl max-w-xs cursor-pointer"
                    onClick={() => window.open(msg.contenido, "_blank")}
                  />
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

              {/* Menú desplegable */}
              {openMenu === msg.id_mensaje && isMe && (
                <div
                  data-menu={msg.id_mensaje}
                  className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded shadow-lg z-20 overflow-hidden"
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
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <FiEdit2 className="mr-2" /> Editar
                    </button>
                  )}
                  <button
                    onClick={() =>
                      openConfirmDialog(
                        "Eliminar mensaje",
                        "¿Seguro que deseas eliminar este mensaje?",
                        () => deleteMessage(msg.id_mensaje),
                      )
                    }
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiTrash2 className="mr-2" /> Eliminar
                  </button>
                </div>
              )}
            </div>

            {/* Avatar propio */}
            {isMe && <FiUserX size={28} className="text-[#48BD28] shrink-0" />}
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </main>

    {/* ╭─ Modo edición ──────────────────────────────────────╮ */}
    {editing && (
      <div className="border-t border-black/10 bg-gray-100 px-4 py-3 flex gap-2">
        <input
          className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm"
          value={editing.content}
          onChange={(e) =>
            setEditing({ ...editing, content: e.target.value })
          }
        />
        <button
          onClick={editMessage}
          className="bg-[#48BD28] text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
        <button
          onClick={() => setEditing(null)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    )}

    {/* ╭─ Input de mensaje ──────────────────────────────────╮ */}
    {!editing && (
      <form
        onSubmit={sendTextMessage}
        className="flex items-center gap-3 border-t border-black/10 px-4 py-3 bg-white"
      >
        {/* Imagen */}
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
          className={`${
            isBlocked ? "text-gray-300" : "text-[#48BD28] hover:text-[#2e7c19]"
          }`}
          disabled={isBlocked}
        >
          <FiCamera size={24} />
        </button>

        {/* Texto */}
        <input
          type="text"
          placeholder="Escribe tu mensaje…"
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
          value={newMessage}
          onChange={(e) => !isBlocked && setNewMessage(e.target.value)}
          disabled={isBlocked}
        />

        {/* Enviar */}
        <button
          type="submit"
          disabled={isBlocked || !newMessage.trim()}
          className={`${
            isBlocked ? "text-gray-300" : "text-[#48BD28] hover:text-[#2e7c19]"
          }`}
        >
          <FiSend size={24} />
        </button>

        {/* Grabación de audio */}
        {!recording ? (
          <button
            type="button"
            onClick={!isBlocked ? toggleRecording : undefined}
            className={`${
              isBlocked
                ? "text-gray-300"
                : "text-[#48BD28] hover:text-[#2e7c19]"
            }`}
            disabled={isBlocked}
          >
            <FiMic size={24} />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full border border-green-400 shadow-sm">
            {/* Ondas */}
            <div className="flex gap-[2px] items-end h-6">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-green-600"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `bounce ${
                      0.8 + Math.random()
                    }s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>

            {/* Cancelar */}
            <button
              type="button"
              onClick={cancelRecording}
              className="ml-2 px-2 py-1 text-[11px] bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    )}

    {/* ╭─ ConfirmDialog global ─────────────────────────────╮ */}
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