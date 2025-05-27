import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RecoverPasswordContext } from '@/contexts/User/UserManagement';
import { useNavigate } from 'react-router-dom';

import Logo from '@assets/senagrol.jpeg';
import Image1 from '@assets/LoginImg.jpg';
import Image2 from '@assets/Travel.jpg';
import Image3 from '@assets/co.jpg';

const images = [Image1, Image2, Image3];

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id_user = parseInt(searchParams.get('id_user') || '0');

  const context = useContext(RecoverPasswordContext);
  if (!context) {
    throw new Error('UpdatePassword debe usarse dentro de un RecoverPasswordProvider');
  }

  const { updatePassword, message, error } = context;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


const navigate = useNavigate();

useEffect(() => {
  if (message === 'Contraseña actualizada con éxito') {
    navigate('/login');
  }
}, [message]);

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
    <div className="w-full h-screen flex items-center justify-center bg-[#48BD28]">
      <div className="flex w-full h-full bg-white shadow-lg overflow-hidden">
        <div className="relative w-full md:w-1/2 p-10 pt-16 text-white flex items-center justify-center">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1">
            <img src={Logo} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col gap-6 text-black">
            <h2 className="text-xl font-semibold text-center">Actualizar contraseña</h2>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
              required
            />

            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
              required
            />

            <button
              type="submit"
              className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-[#379e1b] transition"
            >
              Cambiar contraseña
            </button>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </form>
        </div>

        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={images[currentImage]}
            alt="Decoración contraseña"
            className="w-full h-full object-cover transition-all duration-1000"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
