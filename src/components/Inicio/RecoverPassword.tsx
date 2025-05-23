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
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ingresa tu correo"
      />
      <button type="submit">Enviar correo</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default RecoverPassword;
