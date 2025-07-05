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
        const user = data?.[0];
        if (user) {
          setProfileData({
            id_user: user.id_usuario,
            name: user.nombre,
            username: user.nombre_usuario,
            email: user.correo,
            phone: user.telefono,
            roles: data.roles || "",
            tipoVehiculo: data.tipo_vehiculo || "",
            tarjetaPropiedad: data.tarjeta_propiedad_vehiculo || "",
            licenciaConduccion: data.licencia_conduccion || "",
            soat: data.soat || "",
            pesoVehiculo: data.peso_vehiculo || "",
            fotosVehiculo: data.fotos_vehiculo || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const containerVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // estilos compartidos para el aside
  const baseClasses = `
    w-full max-w-xs lg:max-w-sm
    bg-white rounded-xl p-6
    shadow-xl flex flex-col items-center text-center
  `;

  if (loading) {
    return (
      <motion.aside
        className={baseClasses}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <p className="text-gray-500">Cargando perfil...</p>
      </motion.aside>
    );
  }

  if (!profileData) {
    return (
      <motion.aside
        className={baseClasses}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <p className="text-red-500">No se pudo cargar la información del perfil.</p>
      </motion.aside>
    );
  }

  const lowerRole = profileData.roles.toLowerCase();

  return (
    <motion.aside
      className={baseClasses}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Foto y nombre */}
      <img
        src={perfilImg}
        alt="Foto de perfil"
        className="rounded-full w-24 h-24 object-cover"
      />
      <h2 className="text-xl font-semibold mt-4">{profileData.username}</h2>

      {/* Datos básicos */}
      <div className="w-full mt-6 space-y-2 text-sm text-left">
        {[
          ["Nombre", profileData.name],
          ["Correo", profileData.email],
          ["Teléfono", profileData.phone],
          ["Rol", profileData.roles],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-[#2E7C19] font-medium">
            <span>{label}</span>
            <span className="text-black">{value || "—"}</span>
          </div>
        ))}
      </div>

      {/* Sección de transportador */}
      {lowerRole.includes("transportador") && (
        <>
          <hr className="my-4 w-full border-gray-300" />
          <div className="w-full space-y-2 text-sm text-left">
            {[
              ["Tipo de Vehículo", profileData.tipoVehiculo],
              ["Tarjeta Propiedad", profileData.tarjetaPropiedad],
              ["Licencia de Conducción", profileData.licenciaConduccion],
              ["SOAT", profileData.soat],
              ["Peso del Vehículo", profileData.pesoVehiculo],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-[#2E7C19] font-medium">
                <span>{label}</span>
                <span className="text-black">{value || "—"}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Botones de acción */}
      <div className="w-full mt-6 flex flex-col gap-3">
        {/* Formulario transportador */}
        {!lowerRole.includes("transportador") && (
          <button
            onClick={() => navigate("/formulariotransportador")}
            className="w-full bg-[#28A745] text-white py-2 rounded-xl font-semibold hover:bg-[#379e1b] transition-colors"
          >
            Formulario para transportador
          </button>
        )}

        {/* Petición vendedor */}
        {!lowerRole.includes("vendedor") && <PeticionVendedor />}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </motion.aside>
  );
};

export default UserProfileCard;
