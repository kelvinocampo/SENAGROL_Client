import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical, FiX } from "react-icons/fi";
import { AuthService } from "@/services/AuthService";
import { ChatsContext } from "@/contexts/Chats";
import { ChatService } from "@/services/Chats/ChatService";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";

export const ChatsList = () => {
  const navigate = useNavigate();
  const { id_chat: currentChatId } = useParams();
  const { chats, fetchChats } = useContext(ChatsContext);

  const [currentUserId, setCurrentUserId] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmAction = useRef<() => void>(() => {});
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const uid = await AuthService.getIDUser();
      setCurrentUserId(uid);
      await fetchChats();
    })();
  }, [fetchChats]);

  const getOtherUser = (chat: any) => {
    const isUser1 = chat.id_user1 === currentUserId;
    return {
      name: isUser1 ? chat.nombre_user2 : chat.nombre_user1,
      blocked: chat.estado === "Bloqueado",
      role: "Vendedor", // Se muestra siempre como Vendedor
    };
  };

  const openConfirm = (title: string, msg: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(msg);
    confirmAction.current = action;
    setConfirmOpen(true);
  };

  const performBlockUnblock = useCallback(
    async (cid: number, blocked: boolean) => {
      blocked ? await ChatService.unblockChat(cid) : await ChatService.blockChat(cid);
      await fetchChats();
      setOpenMenuId(null);
    },
    [fetchChats]
  );

  const performDelete = useCallback(
    async (cid: number) => {
      await ChatService.deleteChat(cid);
      await fetchChats();
      setOpenMenuId(null);
    },
    [fetchChats]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const wrapperCls = "flex flex-col gap-1 overflow-y-auto max-h-[300px] pb-2";
  const itemBase =
    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors";
  const activeStyle = "bg-[#48BD28] text-white";
  const inactiveStyle = "bg-white text-black hover:bg-[#d9f7c6]";

  return (
    <div className={wrapperCls}>
      {chats.length === 0 ? (
        <p className="text-center text-gray-500 py-4 text-sm">No hay chats</p>
      ) : (
        chats.map((chat: any) => {
          const other = getOtherUser(chat);
          const isActive = String(chat.id_chat) === currentChatId;
          const isMenuOpen = openMenuId === chat.id_chat;

          return (
            <div key={chat.id_chat} className="relative">
              <div
                className={`${itemBase} ${isActive ? activeStyle : inactiveStyle}`}
                onClick={() => navigate(`/chats/chat/${chat.id_chat}`)}
              >
                {/* Nombre y rol */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {other.name}
                  </span>
                  <span className="text-xs text-gray-500">{other.role}</span>
                </div>

                {/* Etiqueta "Bloqueado" */}
                {other.blocked && (
                  <span className="text-[10px] text-white bg-red-500 px-2 py-[2px] rounded-full mx-2 whitespace-nowrap">
                    Bloqueado
                  </span>
                )}

                {/* Botón menú */}
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((prev) =>
                      prev === chat.id_chat ? null : chat.id_chat
                    );
                  }}
                >
                  {isMenuOpen ? <FiX /> : <FiMoreVertical />}
                </button>
              </div>

              {/* Menú desplegable */}
              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-10 bg-white border border-gray-200 rounded shadow-lg z-20 overflow-hidden"
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() =>
                      openConfirm(
                        other.blocked ? "Desbloquear chat" : "Bloquear chat",
                        `¿Seguro que deseas ${
                          other.blocked ? "desbloquear" : "bloquear"
                        } este chat?`,
                        () => performBlockUnblock(chat.id_chat, other.blocked)
                      )
                    }
                  >
                    {other.blocked ? "Desbloquear" : "Bloquear"}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() =>
                      openConfirm(
                        "Eliminar chat",
                        "¿Seguro que deseas eliminar este chat? Esta acción es irreversible.",
                        () => performDelete(chat.id_chat)
                      )
                    }
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Diálogo de confirmación */}
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
