import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import perfilImg from "@assets/sin_foto.jpg";
import { obtenerPerfilUsuario } from "@/services/Perfil/PerfilusuarioServices";
import PeticionVendedor from "./PeticionVendedor";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IAContext } from "@/contexts/IA";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog"; 


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
  fotosVehiculo?: string; // Coma separadas: "url1,url2,url3"
}

const UserProfileCard: React.FC = () => {
  const navigate = useNavigate();
  const ia = useContext(IAContext);
  if (!ia) throw new Error("IAContext no disponible");
  const { clearHistory } = ia;

  const [profileData, setProfileData] = useState<FormDataProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [confirmOpen, setConfirmOpen] = useState(false);
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

 const baseClasses = `
  w-full max-w-xs sm:max-w-sm lg:max-w-sm
  bg-white rounded-xl p-6 
  shadow-xl flex flex-col items-center text-center
  mx-auto
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
  const imageList = profileData.fotosVehiculo
    ? profileData.fotosVehiculo.split(",").map((url) => url.trim())
    : [];

  return (
    <motion.aside
      className={baseClasses}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <img
        src={perfilImg}
        alt="Foto de perfil"
        className="rounded-full w-24 h-24 object-cover"
      />
      <h2 className="text-xl font-semibold mt-4">{profileData.username}</h2>

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

          {/* Carrusel de imágenes del vehículo */}
          {imageList.length > 0 && (
            <div className="w-full mt-6">
              <h3 className="text-[#2E7C19] text-sm font-bold mb-2">
                Fotos del vehículo
              </h3>
              <Carousel
                autoPlay
                infiniteLoop
                interval={5000}
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                swipeable
                emulateTouch
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black rounded-full p-2 shadow hover:scale-105 transition"
                    >
                      <FaChevronLeft className="text-white" />
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                  hasNext && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black rounded-full p-2 shadow hover:scale-105 transition"
                    >
                      <FaChevronRight className="text-white" />
                    </button>
                  )
                }
              >
                {imageList.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Vehículo ${idx + 1}`}
                      className="h-48 w-full object-cover rounded-xl"
                      onError={(e) => ((e.target as HTMLImageElement).src = "")}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </>
      )}

      <div className="w-full mt-6 flex flex-col items-center gap-3">
        {!lowerRole.includes("transportador") && (
          <button
            onClick={() => navigate("/formulariotransportador")}
            className="w-full sm:w-60 bg-[#28A745] text-white py-2 rounded-xl font-semibold hover:bg-[#379e1b] transition-colors"
          >
            Formulario para transportador
          </button>
        )}

        {!lowerRole.includes("vendedor") && <PeticionVendedor />}

        <button
    onClick={() => setConfirmOpen(true)}
    className="w-full sm:w-60 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
  >
    Cerrar sesión
  </button>
      </div>
      <ConfirmDialog
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={() => {
    localStorage.clear();
    clearHistory();
    navigate("/");
  }}
  title="¿Cerrar sesión?"
  message="¿Estás seguro de que deseas cerrar sesión?"
/>
    </motion.aside>
    
  );
};

export default UserProfileCard;
