import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Header from "@/components/Header";
import PeticionVendedor from "@components/perfil/PeticionVendedor";
import perfilImg from "@assets/sin_foto.jpg";
import Footer from "@components/footer";
import { obtenerPerfilUsuario } from "@/services/Perfil/PerfilusuarioServices";
import { updateUserProfile } from "@/services/Perfil/EditProfileService";

type FormData = {
  id_user: number | string;
  username: string;
  email: string;
  name: string;
  phone: string;
  password?: string;
  roles: string;

  // Campos transportador opcionales
  license?: string;
  soat?: string;
  vehicleCard?: string;
  vehicleType?: string;
  vehicleWeight?: number;
};

function PerfilUsuarioUnico() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const fetchPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await obtenerPerfilUsuario(token);
      console.log("Datos recibidos desde backend:", data); // <---- Aquí

      if (data && data[0]) {
       setFormData({
  id_user: data["0"].id_usuario,
  username: data["0"].nombre_usuario,
  email: data["0"].correo,
  name: data["0"].nombre,
  phone: data["0"].telefono,
  roles: data.roles || "",

  license: data.licencia_conduccion || "",
  soat: data.soat || "",
  vehicleCard: data.tarjeta_propiedad_vehiculo || "",
  vehicleType: data.tipo_vehiculo || "",
  vehicleWeight: Number(data.peso_vehiculo) || 0,
});

      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  fetchPerfil();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => setIsEditing(false);

  const handleUpdate = async () => {
    try {
      if (!formData) return;

      if (!formData.username || !formData.email || !formData.name || !formData.phone) {
        alert("Por favor completa todos los campos.");
        return;
      }

      setLoading(true);

      // Construir el objeto para enviar
      const payload: any = {
        id_user: formData.id_user,
        username: formData.username,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        roles: formData.roles,
      };

   
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

     
      if (
        typeof formData.roles === "string" &&
        formData.roles.toLowerCase().includes("transportador")
      ) {
        payload.license = formData.license || "";
        payload.soat = formData.soat || "";
        payload.vehicleCard = formData.vehicleCard || "";
        payload.vehicleType = formData.vehicleType || "";
        payload.vehicleWeight = formData.vehicleWeight || 0;
      }

      await updateUserProfile(payload);

      alert("Perfil actualizado correctamente.");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      alert(error.message || "Hubo un error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p className="p-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-white font-[Fredoka] text-[#111]">
      <Header />
      <main className="flex pt-32 px-10 gap-10">
        <aside className="w-1/3 flex flex-col items-center border-r border-gray-200 pr-6">
          <img src={perfilImg} alt="Perfil" className="rounded-full w-28 h-28 object-cover mb-4" />
          <h2 className="text-lg font-medium">{formData.name}</h2>
          <p className="text-[#48BD28]">{formData.username}</p>
          <FaEdit
            className="cursor-pointer hover:text-green-700 mb-4 mt-1"
            onClick={() => setIsEditing(true)}
          />

          <div className="text-sm space-y-4 w-full">
            <div>
              <p className="text-[#48BD28] font-medium">Correo</p>
              <p>{formData.email}</p>
            </div>
            <div>
              <p className="text-[#48BD28] font-medium">Teléfono</p>
              <p>{formData.phone}</p>
            </div>
            <div>
              <p className="text-[#48BD28] font-medium">Rol</p>
              <p>{formData.roles}</p>
            </div>

            {/* Mostrar datos transportador solo si es transportador */}
            {formData.roles.toLowerCase().includes("transportador") && (
              <>
                <div>
                  <p className="text-[#48BD28] font-medium">Licencia</p>
                  <p>{formData.license}</p>
                </div>
                <div>
                  <p className="text-[#48BD28] font-medium">SOAT</p>
                  <p>{formData.soat}</p>
                </div>
                <div>
                  <p className="text-[#48BD28] font-medium">Tarjeta Vehículo</p>
                  <p>{formData.vehicleCard}</p>
                </div>
                <div>
                  <p className="text-[#48BD28] font-medium">Tipo Vehículo</p>
                  <p>{formData.vehicleType}</p>
                </div>
                <div>
                  <p className="text-[#48BD28] font-medium">Peso Vehículo</p>
                  <p>{formData.vehicleWeight}</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 w-full">
            <PeticionVendedor />
            <button
              onClick={() => navigate("/formulariotransportador")}
              className="bg-[#F5F0E5] text-black py-2 rounded-full"
            >
              Formulario Transportador
            </button>
          </div>
        </aside>

        <section className="w-2/3">
          {isEditing && (
            <>
              <h1 className="text-2xl font-bold mb-6">Editar Información de Perfil</h1>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium mb-1">Nombre de usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Correo</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Mostrar inputs de transportador solo si es transportador */}
                {formData.roles.toLowerCase().includes("transportador") && (
                  <>
                    <div>
                      <label className="block font-medium mb-1">Licencia</label>
                      <input
                        type="text"
                        name="license"
                        value={formData.license}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">SOAT</label>
                      <input
                        type="text"
                        name="soat"
                        value={formData.soat}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Tarjeta Vehículo</label>
                      <input
                        type="text"
                        name="vehicleCard"
                        value={formData.vehicleCard}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Tipo Vehículo</label>
                      <input
                        type="text"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Peso Vehículo</label>
                      <input
                        type="number"
                        name="vehicleWeight"
                        value={formData.vehicleWeight}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-medium mb-1">Contraseña (dejar en blanco para no cambiar)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-[#48BD28] text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PerfilUsuarioUnico;
