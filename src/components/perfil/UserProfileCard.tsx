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

  if (loading) {
    return (
      <motion.aside
        className="lg:w-1/3 w-full bg-white rounded-xl p-8 shadow-xl flex flex-col items-center text-center"
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
        className="lg:w-1/3 w-full bg-white rounded-xl p-8 shadow-xl flex flex-col items-center text-center"
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
      className="lg:w-110 w-full bg-white h-full rounded-xl p-8 shadow-xg flex flex-col items-center text-center "
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={perfilImg}
        alt="Foto de perfil"
        className="rounded-full w-24 h-24 object-cover"
      />
      <h2 className="text-xl font-semibold mt-2">{profileData.username}</h2>
      
      <div className="w-full mt-4 space-y-1 text-sm text-left">
        <div className="flex justify-between text-[#2E7C19] font-medium">
          <span>Nombre</span>
          <span className="text-black">{profileData.name || "—"}</span>
        </div>
        <div className="flex justify-between text-[#2E7C19] font-medium">
          <span>Correo</span>
          <span className="text-black">{profileData.email || "—"}</span>
        </div>
        <div className="flex justify-between text-[#2E7C19] font-medium">
          <span>Teléfono</span>
          <span className="text-black">{profileData.phone || "—"}</span>
        </div>
        <div className="flex justify-between text-[#2E7C19] font-medium">
          <span>Rol</span>
          <span className="text-black">{profileData.roles || "—"}</span>
        </div>
      </div>

      {/* Si es transportador, mostrar detalles del vehículo */}
      {lowerRole.includes("transportador") && (
        <>
          <hr className="my-4 w-full border-gray-300" />
          <div className="w-full space-y-1 text-sm text-left">
            <div className="flex justify-between text-[#2E7C19] font-medium">
              <span>Tipo de Vehículo</span>
              <span className="text-black">{profileData.tipoVehiculo || "—"}</span>
            </div>
            <div className="flex justify-between text-[#2E7C19] font-medium">
              <span>Placa</span>
              <span className="text-black">{profileData.tarjetaPropiedad || "—"}</span>
            </div>
            <div className="flex justify-between text-[#2E7C19] font-medium">
              <span>Licencia de Conducción</span>
              <span className="text-black">{profileData.licenciaConduccion || "—"}</span>
            </div>
            <div className="flex justify-between text-[#2E7C19] font-medium">
              <span>SOAT</span>
              <span className="text-black">{profileData.soat || "—"}</span>
            </div>
            <div className="flex justify-between text-[#2E7C19] font-medium">
              <span>Peso del vehículo</span>
              <span className="text-black">{profileData.pesoVehiculo || "—"}</span>
            </div>
          </div>

          {/* Carrusel simple de imagen */}
          {profileData.fotosVehiculo && (
            <div className="mt-4">
              <Slider
                fotos={profileData.fotosVehiculo.split(",").map((f) => f.trim())}
                nombre={profileData.name}
              />
            </div>
          )}
        </>
      )}

      {/* Botones si no es transportador o vendedor */}
      <div className="w-full mt-4 space-y-2">
        {!lowerRole.includes("transportador") && (
          <button
            onClick={() => navigate("/formulariotransportador")}
            className="w-60 bg-[#28A745] text-white py-2 rounded-xl font-semibold hover:bg-[#379e1b] transition-colors"
          >
            Formulario para transportador
          </button>
        )}

        {!lowerRole.includes("vendedor") && <PeticionVendedor />}
      </div>
    </motion.aside>
  );
};

export default UserProfileCard;

// Carrusel de fotos del vehículo
function Slider({ fotos, nombre }: { fotos: string[]; nombre: string }) {
  const [index, setIndex] = useState(0);

  const siguiente = () => setIndex((prev) => (prev + 1) % fotos.length);
  const anterior = () => setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);

  return (
    <div className="relative w-44 h-28 rounded overflow-hidden shadow bg-white mx-auto">
      <img
        src={fotos[index]}
        alt={`Foto ${index + 1} de ${nombre}`}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = "/img/default-car.png")}
      />
      {fotos.length > 1 && (
        <>
          <button
            onClick={anterior}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black/50 px-2 rounded"
          >
            ‹
          </button>
          <button
            onClick={siguiente}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black/50 px-2 rounded"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
