import { useEffect, useState, useContext, useRef } from "react";
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
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  // ConfirmDialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmAction = useRef<() => Promise<void>>(async () => {});

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
      role: isUser1 ? chat.rol_user2 : chat.rol_user1,
    };
  };

  const showConfirmDialog = (title: string, message: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    confirmAction.current = action;
    setConfirmOpen(true);
  };

  const handleBlockUnblock = async (chat: any) => {
    const other = getOtherUser(chat);
    const title = other.blocked ? "Desbloquear chat" : "Bloquear chat";
    const message = `¿Estás seguro de que deseas ${other.blocked ? "desbloquear" : "bloquear"} este chat con ${other.name}?`;

    showConfirmDialog(title, message, async () => {
      if (other.blocked) {
        await ChatService.unblockChat(chat.id_chat);
      } else {
        await ChatService.blockChat(chat.id_chat);
      }
      await fetchChats();
      setOpenMenuId(null);
      setMenuPosition(null);
    });
  };

  const handleDelete = async (chat: any) => {
    const other = getOtherUser(chat);
    const title = "Eliminar chat";
    const message = `¿Estás seguro de que deseas eliminar el chat con ${other.name}? Esta acción no se puede deshacer.`;

    showConfirmDialog(title, message, async () => {
      await ChatService.deleteChat(chat.id_chat);
      await fetchChats();
      setOpenMenuId(null);
      setMenuPosition(null);
    });
  };

  const itemBase =
    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors";
  const activeStyle = "bg-[#48BD28] text-white";
  const inactiveStyle = "bg-white text-black hover:bg-[#d9f7c6]";

  return (
    <div className="relative">
      <div className="flex flex-col gap-1 pb-2 pr-1">
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
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-sm truncate">{other.name}</span>
                    <span className="text-xs text-gray-500">{other.role}</span>
                  </div>

                  {other.blocked && (
                    <span className="text-[10px] text-white bg-red-500 px-2 py-[2px] rounded-full mx-2 whitespace-nowrap">
                      Bloqueado
                    </span>
                  )}

                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuPosition({
                        top: rect.top + window.scrollY - 150,
                        left: rect.right - 40,
                      });
                      setOpenMenuId((prev) =>
                        prev === chat.id_chat ? null : chat.id_chat
                      );
                    }}
                  >
                    {isMenuOpen ? <FiX /> : <FiMoreVertical />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Menú flotante */}
      {openMenuId !== null && menuPosition && (
        <div
          className="fixed z-[9999] overflow-visible w-44 bg-[#E2E2E2] border border-gray-200 rounded-lg shadow-xl"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button
            className="w-full text-left px-4 m-1 py-2 text-sm rounded-lg hover:bg-[#B4B4B4]"
            onClick={() => {
              const chat = chats.find((c: any) => c.id_chat === openMenuId);
              if (chat) handleBlockUnblock(chat);
            }}
          >
            {getOtherUser(chats.find((c: any) => c.id_chat === openMenuId))?.blocked
              ? "Desbloquear chat"
              : "Bloquear chat"}
          </button>

          <button
            className="w-full text-left px-4 m-1 py-2 text-sm rounded-lg hover:bg-[#B4B4B4]"
            onClick={() => {
              const chat = chats.find((c: any) => c.id_chat === openMenuId);
              if (chat) handleDelete(chat);
            }}
          >
            Eliminar chat
          </button>
        </div>
      )}

      {/* Confirmación */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await confirmAction.current();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default ChatsList;
