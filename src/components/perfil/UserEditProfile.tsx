import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/footer";
import UserProfileCard from "@components/perfil/UserProfileCard";
import { Input } from "@/components/Input";
import { MessageDialog } from "@components/admin/common/MessageDialog";
import { ConfirmDialog } from "@components/admin/common/ConfirmDialog";

import { obtenerPerfilUsuario } from "@/services/Perfil/PerfilusuarioServices";
import { updateUserProfile } from "@/services/Perfil/EditProfileService";

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
  vehicleImage?: string;
};

function PerfilUsuarioUnico() {
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

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
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
            license: data.licencia_conduccion || "",
            soat: data.soat || "",
            vehicleCard: data.tarjeta_propiedad_vehiculo || "",
            vehicleType: data.tipo_vehiculo || "",
            vehicleWeight: Number(data.peso_vehiculo) || 0,
            vehicleImage: data.imagen_vehiculo || "",
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

  const performUpdate = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      const payload: any = { ...formData, ...(password && { password }) };
      if (!formData.vehicleWeight || formData.vehicleWeight === 0) {
        delete payload.vehicleWeight;
      }
      await updateUserProfile(payload);
      setDialog({ open: true, type: "success", message: "Perfil actualizado correctamente." });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      setDialog({ open: true, type: "error", message: err.message || "Hubo un error al actualizar el perfil." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (!formData) return;

    if (!formData.username || !formData.email || !formData.name || !formData.phone) {
      setDialog({ open: true, type: "error", message: "Por favor completa todos los campos obligatorios." });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setDialog({ open: true, type: "error", message: "La contraseña debe tener al menos 6 caracteres." });
        return;
      }
      if (password !== confirmPassword) {
        setDialog({ open: true, type: "error", message: "Las contraseñas no coinciden." });
        return;
      }
    }

    setConfirmDialog({
      open: true,
      title: "Confirmar cambios",
      message: "¿Estás seguro de que deseas guardar los cambios?",
      onConfirm: performUpdate,
    });
  };

  if (loading || !formData) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="w-20 h-20 border-8 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold text-gray-700">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4fcf1] to-[#caf5bd]  font-[Fredoka] text-[#111]">
      <Header />
      <main className="flex flex-col h-full lg:flex-row pt-10 py-10 px-10 gap-10 ">
        <UserProfileCard />

        <motion.section className="lg:w-2/3 w-full h-full" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className=" p-8 rounded-2xl  space-y-6">
            <h2 className="text-3xl font-bolder mb-4 text-[#0D141C]">Perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["username", "email", "name", "phone"].map((key, idx) => (
                <motion.div variants={fadeInUp} custom={idx} key={key}>
                  <Input
                    name={key}
                    label={
                      key === "username" ? "Nombre de usuario" :
                      key === "email" ? "Correo" :
                      key === "name" ? "Nombre completo" : "Teléfono"
                    }
                    type="text"
                    value={(formData as any)[key]}
                    onChange={handleChange}
                  />
                </motion.div>
              ))}

              <motion.div variants={fadeInUp} custom={4} className="relative">
                <Input label="Contraseña" type={showPassword ? "text" : "password"} name="password" placeholder="Ingresa tu nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)}  />
                <span className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              <motion.div variants={fadeInUp} custom={5} className="relative">
                <Input label="Confirmar Contraseña" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Repite la nueva contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <span className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>
            </div>

            <div className="pt-6 text-right">
              <button onClick={handleUpdate} className="bg-[#48bd28] hover:bg-[#379e1b] text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {confirmDialog.open && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <ConfirmDialog isOpen={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })} onConfirm={confirmDialog.onConfirm} title={confirmDialog.title} message={confirmDialog.message} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dialog.open && (
          <motion.div key="message" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <MessageDialog isOpen={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} message={dialog.message} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default PerfilUsuarioUnico;
