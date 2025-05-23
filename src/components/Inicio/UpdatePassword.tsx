import React, { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RecoverPasswordContext } from '@/contexts/User/UserManagement';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id_user = parseInt(searchParams.get('id_user') || '0');

  const context = useContext(RecoverPasswordContext);

  if (!context) {
    throw new Error('UpdatePassword debe usarse dentro de un RecoverPasswordProvider');
  }

  const { updatePassword, message, error } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Token inválido o faltante');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

   await updatePassword(token, newPassword, id_user);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Actualizar contraseña</h2>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Confirmar nueva contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Cambiar contraseña
      </button>

      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default UpdatePassword;
