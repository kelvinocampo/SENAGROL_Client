import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RecoverPasswordContext } from '@/contexts/User/UserManagement';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import senagrol from "@assets/senagrol.png";
import Image1 from '@assets/LoginImg.jpg';
import Image2 from '@assets/Travel.jpg';
import Image3 from '@assets/co.jpg';

const images = [Image1, Image2, Image3];

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id_user = parseInt(searchParams.get('id_user') || '0');

  const context = useContext(RecoverPasswordContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (message === 'Contraseña actualizada con éxito') {
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [message, navigate]);

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
  //  navigate("/login"); 
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#48BD28]">
      <div className="flex w-full h-full bg-white shadow-lg overflow-hidden">
        <motion.div
          className="relative w-full md:w-1/2 p-10 pt-16 text-white flex items-center justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border-4 border-[#48BD28] rounded-full p-1">
            <img src={senagrol} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col gap-6 text-black">
            <h2 className="text-xl font-semibold text-center">Actualizar contraseña</h2>

            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                required
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#48BD28] text-white py-2 rounded-lg hover:bg-[#379e1b] transition"
            >
              Cambiar contraseña
            </motion.button>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </form>
        </motion.div>

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
