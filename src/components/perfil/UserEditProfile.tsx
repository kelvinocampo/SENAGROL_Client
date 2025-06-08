// ─── Librerías ───────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// ─── Componentes ─────────────────────────────────────────────────────────────
import Header from "@/components/Header";
import Footer from "@/components/footer";
import UserProfileCard from "@components/perfil/UserProfileCard";
import { Input } from "@/components/Input";
import { MessageDialog } from "@components/admin/common/MessageDialog"; // Asegúrate de que la ruta sea correcta

// ─── Servicios ───────────────────────────────────────────────────────────────
import { obtenerPerfilUsuario } from "@/services/Perfil/PerfilusuarioServices";
import { updateUserProfile } from "@/services/Perfil/EditProfileService";

// ─── Animaciones ─────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, ease: "easeOut", duration: 0.6 },
  }),
};

// ─── Tipado ─────────────────────────────────────────────────────────────────
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

// ─── Componente Principal ───────────────────────────────────────────────────
// ─── ...imports omitidos para brevedad ───

function PerfilUsuarioUnico() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dialog, setDialog] = useState<{ open: boolean; type: "success" | "error"; message: string }>({
    open: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const data = await obtenerPerfilUsuario(token);
        const user = data?.[0];

        if (user) {
          setFormData({
            id_user: user.id_usuario,
            username: user.nombre_usuario,
            email: user.correo,
            name: user.nombre,
            phone: user.telefono,
            roles: data.roles || "",
            license: user.licencia_conduccion || "",
            soat: user.soat || "",
            vehicleCard: user.tarjeta_propiedad_vehiculo || "",
            vehicleType: user.tipo_vehiculo || "",
            vehicleWeight: Number(user.peso_vehiculo) || 0,
          });
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
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

    if (!formData.username || !formData.email || !formData.name || !formData.phone) {
      setDialog({
        open: true,
        type: "error",
        message: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setDialog({
          open: true,
          type: "error",
          message: "La contraseña debe tener al menos 6 caracteres.",
        });
        return;
      }
      if (password !== confirmPassword) {
        setDialog({
          open: true,
          type: "error",
          message: "Las contraseñas no coinciden.",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        ...formData,
        ...(password && { password }),
      };

      if (!formData.vehicleWeight || formData.vehicleWeight === 0) {
        delete payload.vehicleWeight;
      }

      await updateUserProfile(payload);

      setDialog({
        open: true,
        type: "success",
        message: "Perfil actualizado correctamente.",
      });

      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      setDialog({
        open: true,
        type: "error",
        message: err.message || "Hubo un error al actualizar el perfil.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="w-20 h-20 border-8 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold text-gray-700">Cargando perfil...</p>
      </div>
    );
  }

  const inputSharedStyles =
    "w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#48bd28] transition-all duration-300";

  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      <Header />
      <main className="flex flex-col lg:flex-row pt-32 px-10 gap-10 bg-white">
        <UserProfileCard />

        <motion.section
          className="lg:w-2/3 w-full"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-[#205116]">Editar Perfil</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campos principales */}
              {[{ label: "Nombre de usuario", name: "username", type: "text", value: formData.username },
                { label: "Correo", name: "email", type: "email", value: formData.email },
                { label: "Nombre completo", name: "name", type: "text", value: formData.name },
                { label: "Teléfono", name: "phone", type: "text", value: formData.phone },
              ].map((field, idx) => (
                <motion.div variants={fadeInUp} custom={idx} key={field.name}>
                  <Input {...field} onChange={handleChange} />
                </motion.div>
              ))}

              {/* Contraseña */}
              <motion.div variants={fadeInUp} custom={4} className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              {/* Confirmar contraseña */}
              <motion.div variants={fadeInUp} custom={5} className="relative">
                <Input
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              {/* Campos de transportador */}
              {formData.roles.toLowerCase().includes("transportador") &&
                [
                  { label: "Licencia", name: "license", placeholder: "Ingresa tu licencia" },
                  { label: "SOAT", name: "soat", placeholder: "Ingresa tu SOAT" },
                  { label: "Tarjeta Vehículo", name: "vehicleCard", placeholder: "Tarjeta de propiedad" },
                  { label: "Tipo Vehículo", name: "vehicleType", placeholder: "Tipo de vehículo" },
                  { label: "Peso Vehículo (kg)", name: "vehicleWeight", placeholder: "Peso en kilogramos" },
                ].map((field, idx) => (
                  <motion.div key={field.name} variants={fadeInUp} custom={6 + idx}>
                    <Input
                      {...field}
                      type={field.name === "vehicleWeight" ? "number" : "text"}
                      value={formData[field.name as keyof FormData] || ""}
                      onChange={handleChange}
                      className={inputSharedStyles}
                    />
                  </motion.div>
                ))}
            </div>

            <div className="pt-6 text-right">
              <button
                onClick={handleUpdate}
                className="bg-[#48bd28] hover:bg-[#379e1b] text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Diálogo de mensaje */}
    <MessageDialog
  isOpen={dialog.open}
  message={dialog.message}
  onClose={() => setDialog({ ...dialog, open: false })}
/>


      <Footer />
    </div>
  );
}



export default PerfilUsuarioUnico;
