import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import UserProfileCard from "@components/perfil/UserProfileCard";
import Footer from "@/components/footer";
import { obtenerPerfilUsuario } from "@/services/Perfil/PerfilusuarioServices";
import { updateUserProfile } from "@/services/Perfil/EditProfileService";
import { motion } from "framer-motion";
import {Input} from "@/components/Input"; // Ajusta a la ruta real de tu componente Input

// Variante fadeInUp para animar con Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, ease: "easeOut", duration: 0.6 },
  }),
};

type FormData = {
  id_user: number | string;
  username: string;
  email: string;
  name: string;
  phone: string;
  roles: string;
  license?: string;
  soat?: string;
  vehicleCard?: string;
  vehicleType?: string;
  vehicleWeight?: number;
};

function PerfilUsuarioUnico() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para el manejo de contraseña
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await obtenerPerfilUsuario(token);
        console.log("Datos recibidos desde backend:", data);

        if (data && data[0]) {
          const userObj = data[0] as Record<string, any>;

          setFormData({
            id_user: userObj.id_usuario,
            username: userObj.nombre_usuario,
            email: userObj.correo,
            name: userObj.nombre,
            phone: userObj.telefono,
            roles: (data.roles as string) || "",
            license: userObj.licencia_conduccion || "",
            soat: userObj.soat || "",
            vehicleCard: userObj.tarjeta_propiedad_vehiculo || "",
            vehicleType: userObj.tipo_vehiculo || "",
            vehicleWeight: Number(userObj.peso_vehiculo) || 0,
          });
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (!formData) return;

    // Validar campos obligatorios
    if (!formData.username || !formData.email || !formData.name || !formData.phone) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Validar contraseña si se ingresó alguna
    if (password.trim() !== "") {
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        id_user: formData.id_user,
        username: formData.username,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        roles: formData.roles,
      };

      if (password.trim() !== "") {
        payload.password = password;
      }

      if (formData.roles.toLowerCase().includes("transportador")) {
        payload.license = formData.license || "";
        payload.soat = formData.soat || "";
        payload.vehicleCard = formData.vehicleCard || "";
        payload.vehicleType = formData.vehicleType || "";
        payload.vehicleWeight = formData.vehicleWeight || 0;
      }

      await updateUserProfile(payload);
      alert("Perfil actualizado correctamente.");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      alert(error.message || "Hubo un error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) return <p className="p-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      <Header />

      <main className="flex flex-col lg:flex-row pt-32 px-10 gap-10 bg-[#f4fcf1]">
        {/* Sidebar con la tarjeta de Usuario */}
        <UserProfileCard />

        {/* Formulario de edición */}
        <motion.section
          className="lg:w-2/3 w-full"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold mb-4 text-[#205116]">
              Editar Información de Perfil
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de usuario */}
              <motion.div variants={fadeInUp} custom={0} className="">
                <Input
                  label="Nombre de usuario"
                  type="text"
                  name="username"
                  placeholder="Ingresa tu usuario"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                />
              </motion.div>

              {/* Correo */}
              <motion.div variants={fadeInUp} custom={1} className="">
                <Input
                  label="Correo"
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                />
              </motion.div>

              {/* Nombre completo */}
              <motion.div variants={fadeInUp} custom={2} className="">
                <Input
                  label="Nombre completo"
                  type="text"
                  name="name"
                  placeholder="Ingresa tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                />
              </motion.div>

              {/* Teléfono */}
              <motion.div variants={fadeInUp} custom={3} className="">
                <Input
                  label="Teléfono"
                  type="text"
                  name="phone"
                  placeholder="Ingresa tu teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                />
              </motion.div>

              {/* Contraseña */}
              <motion.div variants={fadeInUp} custom={4} className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              {/* Confirmar Contraseña */}
              <motion.div variants={fadeInUp} custom={5} className="relative">
                <Input
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              {/* Campos adicionales si es transportador */}
              {formData.roles.toLowerCase().includes("transportador") && (
                <>
                  {/* Licencia */}
                  <motion.div variants={fadeInUp} custom={6} className="">
                    <Input
                      label="Licencia"
                      type="text"
                      name="license"
                      placeholder="Ingresa tu licencia"
                      value={formData.license || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                    />
                  </motion.div>

                  {/* SOAT */}
                  <motion.div variants={fadeInUp} custom={7} className="">
                    <Input
                      label="SOAT"
                      type="text"
                      name="soat"
                      placeholder="Ingresa tu SOAT"
                      value={formData.soat || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                    />
                  </motion.div>

                  {/* Tarjeta Vehículo */}
                  <motion.div variants={fadeInUp} custom={8} className="">
                    <Input
                      label="Tarjeta Vehículo"
                      type="text"
                      name="vehicleCard"
                      placeholder="Ingresa tu tarjeta de propiedad"
                      value={formData.vehicleCard || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                    />
                  </motion.div>

                  {/* Tipo Vehículo */}
                  <motion.div variants={fadeInUp} custom={9} className="">
                    <Input
                      label="Tipo Vehículo"
                      type="text"
                      name="vehicleType"
                      placeholder="Ingresa el tipo de vehículo"
                      value={formData.vehicleType || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                    />
                  </motion.div>

                  {/* Peso Vehículo */}
                  <motion.div variants={fadeInUp} custom={10} className="">
                    <Input
                      label="Peso Vehículo"
                      type="number"
                      name="vehicleWeight"
                      placeholder="Ingresa el peso"
                      value={formData.vehicleWeight?.toString() || "0"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleWeight: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300"
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Botones Cancelar / Guardar */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-[#48bd28] hover:bg-[#379e1b] text-white font-semibold py-2 px-6 rounded-full transition-colors disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

export default PerfilUsuarioUnico;
