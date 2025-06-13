import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiX } from 'react-icons/fi';
import { AuthService } from '@/services/AuthService';
import { ChatsContext } from '@/contexts/Chats';
import { ChatService } from '@/services/Chats/ChatService';
import { ConfirmDialog } from '@/components/admin/common/ConfirmDialog';   

export const ChatsList = () => {
  const navigate = useNavigate();
  const { chats, fetchChats } = useContext(ChatsContext);

  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [openMenuId, setOpenMenuId]   = useState<number | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const confirmAction = useRef<() => void>(() => {});

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickChat = (id_chat: number) => navigate(`/Chats/${id_chat}`);

  /* ─── Cerrar menú al hacer clic fuera ─────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const menuBtn = document.querySelector(
          `[data-menu-button="${openMenuId}"]`
        );
        if (!menuBtn || !menuBtn.contains(e.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  /* ─── Cargar chats ───────────────────────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const uid = await AuthService.getIDUser();
        setCurrentUserId(uid);
        await fetchChats();
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los chats. Intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fetchChats]);

  /* ─── Helpers ────────────────────────────────────────────────────────── */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getOtherUser = (chat: any) => {
    const isUser1 = chat.id_user1 === currentUserId;
    return {
      name:      isUser1 ? chat.nombre_user2  : chat.nombre_user1,
      isBlocked: isUser1 ? chat.bloqueado_user2 : chat.bloqueado_user1,
      rol:       isUser1 ? chat.rol_user2     : chat.rol_user1,
    };
  };

  const toggleMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  /* ─── Acciones de chat (bloquear / desbloquear / eliminar) ───────────── */
  const performBlockUnblock = useCallback(
    async (chatId: number, isBlocked: boolean) => {
      try {
        if (isBlocked) await ChatService.unblockChat(chatId);
        else           await ChatService.blockChat(chatId);
        await fetchChats();
        setOpenMenuId(null);
      } catch (err) {
        console.error(err);
        setError('No se pudo completar la acción. Intenta de nuevo.');
      }
    },
    [fetchChats]
  );

  const performDelete = useCallback(
    async (chatId: number) => {
      try {
        await ChatService.deleteChat(chatId);
        await fetchChats();
        setOpenMenuId(null);
      } catch (err) {
        console.error(err);
        setError('No se pudo eliminar el chat. Intenta de nuevo.');
      }
    },
    [fetchChats]
  );

  /* ─── Abrir diálogo genérico de confirmación ─────────────────────────── */
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

  return (
    <div className="bg-white shadow-sm rounded-lg flex flex-col m-4 w-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* ────── Título ────── */}
      <div className="p-2 sm:p-4 border-b border-gray-300 bg-white z-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
          Tus Conversaciones
        </h2>
      </div>

      {/* ────── Contenido ────── */}
      {isLoading ? (
        /* Skeletons */
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg animate-pulse border-b border-gray-300">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">{error}</div>
      ) : chats.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">No tienes chats iniciados</div>
      ) : (
        <div className="overflow-y-auto flex-1 max-h-[70vh]">
          {chats.map((chat: any) => {
            const other = getOtherUser(chat);
            const isBlocked = chat.estado === 'Bloqueado';
            const isMenuOpen = openMenuId === chat.id_chat;

            return (
              <div
                key={chat.id_chat}
                className="p-4 border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer relative"
                onClick={() => handleClickChat(chat.id_chat)}
              >
                {/* Info usuario + menú */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                      {other.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{other.rol}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end text-right space-y-1">
                      {isBlocked && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                          Bloqueado
                        </span>
                      )}
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(chat.fecha_reciente)}
                      </span>
                    </div>

                    {/* Botón menú */}
                    <div
                      data-menu-button={chat.id_chat}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        isMenuOpen ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      onClick={(e) => toggleMenu(chat.id_chat, e)}
                    >
                      {isMenuOpen ? (
                        <FiX className="text-gray-700" />
                      ) : (
                        <FiMoreVertical className="text-gray-700" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Menú desplegable */}
                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-4 top-16 z-20 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Bloquear / Desbloquear */}
                    <button
                      onClick={() =>
                        openConfirmDialog(
                          isBlocked ? 'Desbloquear chat' : 'Bloquear chat',
                          `¿Seguro que deseas ${
                            isBlocked ? 'desbloquear' : 'bloquear'
                          } este chat?`,
                          () => performBlockUnblock(chat.id_chat, isBlocked)
                        )
                      }
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {isBlocked ? 'Desbloquear chat' : 'Bloquear chat'}
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() =>
                        openConfirmDialog(
                          'Eliminar chat',
                          '¿Seguro que deseas eliminar este chat? Esta acción es irreversible.',
                          () => performDelete(chat.id_chat)
                        )
                      }
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Eliminar chat
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── ConfirmDialog global ────────────────────────────────────────── */}
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
