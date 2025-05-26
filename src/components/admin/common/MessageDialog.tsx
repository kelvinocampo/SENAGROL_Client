type MessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

export const MessageDialog = ({ isOpen, onClose, message }: MessageDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mensaje</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
