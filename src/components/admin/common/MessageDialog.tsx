import { useEffect } from "react";

type MessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

export const MessageDialog = ({ isOpen, onClose, message }: MessageDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-white/60 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded p-8 shadow-lg max-w-sm mx-4 text-center">
        <h3 className="mb-6 text-lg font-bold">¡{message}</h3>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
