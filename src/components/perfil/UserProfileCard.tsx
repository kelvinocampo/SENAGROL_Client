// src/components/perfil/UserProfileCard.tsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import perfilImg from "@assets/sin_foto.jpg";
import { obtenerPerfilUsuario } from "@/services/Perfil/PerfilusuarioServices";
import PeticionVendedor from "./PeticionVendedor";

export interface FormDataProfile {
  id_user: number | string;
  username: string;
  roles: string;
}

const UserProfileCard: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<FormDataProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await obtenerPerfilUsuario(token);


        if (data) {
          // Extraemos el rol directamente de data.roles
          const rolReal = (data.roles as string) || "";

          // Extraemos id_usuario y nombre_usuario de data[0]
          const userObj = data[0] as Record<string, any>;

          setProfileData({
            id_user: userObj.id_usuario,
            username: userObj.nombre_usuario,
            roles: rolReal,
          });
        }
      } catch (error) {
        console.error("Error al cargar perfil en UserProfileCard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <motion.aside
        className="lg:w-1/3 w-full bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-500">Cargando perfil...</p>
      </motion.aside>
    );
  }

  // Si no hay datos de perfil
  if (!profileData) {
    return (
      <motion.aside
        className="lg:w-1/3 w-full bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-red-500">No se pudo cargar la información del perfil.</p>
      </motion.aside>
    );
  }

  console.log("profileData en render CARD:", profileData);
  const lowerRole = profileData.roles.toLowerCase();

  return (
    <motion.aside
      className="lg:w-1/3 w-full bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center text-center space-y-6"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={perfilImg}
        alt="Perfil"
        className="rounded-full w-32 h-32 object-cover border-4 border-[#48bd28] shadow-md"
      />

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {profileData.username}
        </h2>
        <p className="text-[#48bd28] font-medium text-sm">
          ID: {profileData.id_user}
        </p>
      </div>

      <div className="text-sm space-y-2 w-full text-center">
        <p className="text-[#48bd28] font-semibold">Rol</p>
        <p className="text-gray-700">{profileData.roles || "—Sin rol—"}</p>
      </div>

      {/* Si NO es transportador, mostramos “Formulario Transportador” */}
      {!lowerRole.includes("transportador") && (
        <button
          onClick={() => navigate("/formulariotransportador")}
          className="mt-2 bg-[#48bd28] text-white py-2 w-full rounded-full font-medium hover:bg-[#379e1b] transition-colors shadow-md"
        >
          Formulario Transportador
        </button>
      )}

      {/* Si NO es vendedor, mostramos “Petición Vendedor” */}
      {!lowerRole.includes("vendedor") && (
        <div className="w-full mt-2">
          <PeticionVendedor />
        </div>
      )}
    </motion.aside>
  );
};

export default UserProfileCard;
