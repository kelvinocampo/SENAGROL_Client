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
  name: string;
  email: string;
  phone: string;
  roles: string;
  tipoVehiculo?: string;
  tarjetaPropiedad?: string;
  licenciaConduccion?: string;
  soat?: string;
  pesoVehiculo?: string;
  fotosVehiculo?: string;
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
  const userObj = data;

  setProfileData({
    id_user: userObj[0]?.id_usuario || "",
    name: userObj[0]?.nombre || "",
    username: userObj[0]?.nombre_usuario || "",
    email: userObj[0]?.correo || "",
    phone: userObj[0]?.telefono || "",
    roles: userObj.roles || "",
    tipoVehiculo: userObj.tipo_vehiculo || "",
    tarjetaPropiedad: userObj.tarjeta_propiedad_vehiculo || "",
    licenciaConduccion: userObj.licencia_conduccion || "",
    soat: userObj.soat || "",
    pesoVehiculo: userObj.peso_vehiculo || "",
    fotosVehiculo: userObj.fotos_vehiculo || "",
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
      </div>

      <div className="text-sm space-y-2 w-full text-center">
        <p className="text-[#48bd28] font-semibold">Nombre Completo</p>
        <p className="text-gray-700">{profileData.name || "—Sin nombre—"}</p>
        <p className="text-[#48bd28] font-semibold">Correo</p>
        <p className="text-gray-700">{profileData.email || "—Sin Correo—"}</p>
        <p className="text-[#48bd28] font-semibold">Teléfono</p>
        <p className="text-gray-700">{profileData.phone || "—Sin teléfono—"}</p>
        <p className="text-[#48bd28] font-semibold">Rol</p>
        <p className="text-gray-700">{profileData.roles || "—Sin rol—"}</p>
      </div>

      {lowerRole.includes("transportador") && (
        <div className="text-sm space-y-2 w-full text-center">
          <p className="text-[#48bd28] font-semibold">Tipo de Vehículo</p>
          <p className="text-gray-700">{profileData.tipoVehiculo || "—Sin tipo—"}</p>

          <p className="text-[#48bd28] font-semibold">Placa / Tarjeta de Propiedad</p>
          <p className="text-gray-700">{profileData.tarjetaPropiedad || "—Sin tarjeta—"}</p>

          <p className="text-[#48bd28] font-semibold">Licencia de Conducción</p>
          <p className="text-gray-700">{profileData.licenciaConduccion || "—Sin licencia—"}</p>

          <p className="text-[#48bd28] font-semibold">SOAT</p>
          <p className="text-gray-700">{profileData.soat || "—Sin SOAT—"}</p>

          <p className="text-[#48bd28] font-semibold">Peso del Vehículo</p>
          <p className="text-gray-700">{profileData.pesoVehiculo || "—Sin peso—"}</p>

          {profileData.fotosVehiculo && (
            <>
              <p className="text-[#48bd28] font-semibold">Foto del Vehículo</p>
              <img
                src={profileData.fotosVehiculo}
                alt="Foto del vehículo"
                className="w-48 h-auto mx-auto rounded-lg shadow-lg border border-gray-300"
              />
            </>
          )}
        </div>
      )}

      {!lowerRole.includes("transportador") && (
        <button
          onClick={() => navigate("/formulariotransportador")}
          className="mt-2 bg-[#48bd28] text-white py-2 w-full rounded-full font-medium hover:bg-[#379e1b] transition-colors shadow-md"
        >
          Formulario Transportador
        </button>
      )}

      {!lowerRole.includes("vendedor") && (
        <div className="w-full mt-2">
          <PeticionVendedor />
        </div>
      )}

      {lowerRole.includes("cliente") && (
        <button
          onClick={() => navigate("/perfil/editar")}
          className="mt-2 bg-blue-600 text-white py-2 w-full rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md"
        >
          Editar Perfil
        </button>
      )}
    </motion.aside>
  );
};

export default UserProfileCard;
