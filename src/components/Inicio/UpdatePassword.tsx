import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RecoverPasswordContext } from '@/contexts/User/UserManagement';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackToHome } from "@components/admin/common/BackToHome";
import senagrol from "@assets/senagrol.png";
import ImageFija from '@assets/login.png'; // Imagen de fondo fija (como en la imagen)

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  };

  return (
    <div className="w-full h-screen flex items-center justify-center ">
        <div className="absolute top-5 left-5 z-10">
                <BackToHome />
              </div>
      
      <div className="w-full flex flex-col md:flex-row">
        {/* Formulario izquierdo */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 sm:px-10 py-12 ">
          <motion.div
            className="w-full max-w-[420px]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={senagrol}
                alt="Senagrol"
                className="w-20 h-20 rounded-full shadow-md"
              />
            </div>

            <h2 className="text-xl font-semibold text-center mb-4 text-black">
              Cambiar contraseña
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
              {/* Nueva contraseña */}
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                  required
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* Confirmar contraseña */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* Mensajes */}
              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              {/* Botón */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#48BD28] text-white py-2 rounded-lg font-bold hover:bg-[#379e1b] transition"
              >
                Cambiar contraseña
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Imagen derecha fija */}
        <div className="hidden md:block md:w-1/2 h-screen">
          <img
            src={ImageFija}
            alt="Decoración"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
