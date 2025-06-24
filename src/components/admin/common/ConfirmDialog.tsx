import React from 'react';
import { Dialog } from '@headlessui/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmación',
  message = '¿Estás seguro de continuar?',
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className=" font-[Fredoka] fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-white opacity-30" />
      <div className="bg-white p-6 rounded-xl shadow-lg z-50 w-130 space-y-4">
        <Dialog.Title className="text-lg font-semibold ">{title}</Dialog.Title>
         <p className='text-[#483333] font-bolder'>{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-2xl bg-[#48BD28] text-white hover:bg-green-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </Dialog>
  );
};
