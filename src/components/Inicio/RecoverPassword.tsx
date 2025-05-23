import React, { useState, useContext } from 'react';
import { RecoverPasswordContext } from '@/contexts/User/UserManagement';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');

  const context = useContext(RecoverPasswordContext);

  if (!context) {
    throw new Error("RecoverPassword debe usarse dentro de un RecoverPasswordProvider");
  }

  const { recoverPassword, message, error } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recoverPassword(email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4fcf1] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full space-y-6"
      >
        <h2 className="text-2xl font-semibold text-[#205116] text-center">Recuperar contraseña</h2>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#48BD28] text-white py-2 px-4 rounded-lg hover:bg-[#379e1b] transition"
        >
          Enviar correo
        </button>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default RecoverPassword;
