import { createContext, useState } from 'react';
import { InicioService } from '@/services/Perfil/inicioServices';

interface RecoverPasswordContextProps {
  message: string;
  error: string;
  recoverPassword: (email: string) => Promise<void>;
 updatePassword: (token: string, newPassword: string, id_user: number) => Promise<void>; // 👈 incluye id_user
}

export const RecoverPasswordContext = createContext<RecoverPasswordContextProps | undefined>(undefined);

export const RecoverPasswordProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const recoverPassword = async (email: string) => {
    setMessage('');
    setError('');

    try {
      const response = await InicioService.recoverPassword(email);

      if (response.success) {
        setMessage(response.message);
      } else {
        setError(response.message || 'No se pudo enviar el correo.');
      }
    } catch (err) {
      console.error('Error al recuperar la contraseña:', err);
      setError('No se pudo enviar el correo o el correo no existe.');
    }
  };

  const updatePassword = async (token: string, newPassword: string, id_user: number) => {
  setMessage('');
  setError('');

  try {
    const response = await InicioService.updatePassword(token, newPassword, id_user); // ✅ llamada correcta
    setMessage(response.message);
  } catch (err: any) {
    console.error('La nueva contraseña no cumple con los requisitos', err);
    setError(err.message || 'La nueva contraseña no cumple con los requisitos');
  }
};


  return (
    <RecoverPasswordContext.Provider
      value={{
        message,
        error,
        recoverPassword,
        updatePassword,
      }}
    >
      {children}
    </RecoverPasswordContext.Provider>
  );
};
