import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import FallingLeaves from "@/components/FallingLeaf";
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
  const [vehicleFiles, setVehicleFiles] = useState<File[]>([]);

  const [dialog, setDialog] = useState({ open: false, type: "success", message: "" });
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
      const payload: any = {
        ...formData,
        ...(password.trim() !== "" ? { password: password.trim() } : {}),
      };
      await updateUserProfile(payload, vehicleFiles);
      setDialog({ open: true, type: "success", message: "Perfil actualizado correctamente." });
      setPassword("");
      setConfirmPassword("");
      setVehicleFiles([]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    if (!formData) return;
    if (!formData.username || !formData.email || !formData.name || !formData.phone) {
      setDialog({ open: true, type: "error", message: "Por favor completa todos los campos." });
      return;
    }
    if (password || confirmPassword) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    if (fileArray.length > 3) {
      alert("Solo puedes subir hasta 3 imágenes.");
      return;
    }
    setVehicleFiles(fileArray);
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
    <div className="flex flex-col min-h-screen font-[Fredoka] text-[#111]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>
      <Header />
      <main className="relative flex-1 flex flex-col lg:flex-row pt-6 pb-10 px-4 sm:px-6 md:px-10 gap-10">
        <div className=" flex justify-center">
<UserProfileCard />
        </div>
        <motion.section
          className="lg:w-2/3 w-full h-full p-6 "
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-6 w-full">
            <h2 className="text-3xl font-bolder mb-4 text-[#0D141C]">Perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {["username", "email", "name", "phone"].map((key, idx) => (
                <motion.div variants={fadeInUp} custom={idx} key={key} className="w-full">
                  <Input
                    name={key}
                    label={
                      key === "username"
                        ? "Nombre de usuario"
                        : key === "email"
                        ? "Correo"
                        : key === "name"
                        ? "Nombre completo"
                        : "Teléfono"
                    }
                    type="text"
                    value={(formData as any)[key]}
                    onChange={handleChange}
                  />
                </motion.div>
              ))}

              <motion.div variants={fadeInUp} custom={4} className="relative w-full">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresa tu nueva contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-black transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </motion.div>

              <motion.div variants={fadeInUp} custom={5} className="relative w-full">
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

              {formData.roles?.toLowerCase().includes("transportador") && (
                <>
                  <Input name="license" label="Licencia de conducción" type="text" value={formData.license || ""} onChange={handleChange} />
                  <Input name="soat" label="SOAT vigente" type="text" value={formData.soat || ""} onChange={handleChange} />
                  <Input name="vehicleCard" label="Tarjeta de propiedad del vehículo" type="text" value={formData.vehicleCard || ""} onChange={handleChange} />
                  <Input name="vehicleType" label="Tipo de vehículo" type="text" value={formData.vehicleType || ""} onChange={handleChange} />
                  <Input name="vehicleWeight" label="Peso del vehículo (kg)" type="number" value={formData.vehicleWeight || 0} onChange={handleChange} />
                  <div className="col-span-1 md:col-span-2">
                    <label className="block mb-2 text-sm font-medium">Imágenes del vehículo (máx. 3 imágenes)</label>
                    <label className="flex items-center justify-center w-full px-4 py-6 text-green-700 uppercase border border-green-300 rounded-lg cursor-pointer bg-white hover:bg-green-50">
                      <UploadCloud className="mr-2" /> Elegir archivos
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {vehicleFiles.map((file, idx) => (
                        <img key={idx} src={URL.createObjectURL(file)} alt={`img-${idx}`} className="h-24 w-full object-cover rounded-lg border border-gray-300" />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 text-center md:text-right">
              <button
                onClick={handleUpdate}
                className="bg-[#48bd28] hover:bg-[#379e1b] text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-300"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {confirmDialog.open && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <ConfirmDialog
              isOpen={confirmDialog.open}
              onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
              onConfirm={confirmDialog.onConfirm}
              title={confirmDialog.title}
              message={confirmDialog.message}
            />
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
