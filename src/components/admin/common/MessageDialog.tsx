type MessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

export const MessageDialog = ({ isOpen, onClose, message }: MessageDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <button onClick={onClose} className="btn-primary">Cerrar</button>
      </div>
    </div>
  );
};
