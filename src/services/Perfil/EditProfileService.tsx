export const updateUserProfile = async (formData: {
  name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  license?: string;
  soat?: string;
  vehicleCard?: string;
  vehicleType?: string;
  vehicleWeight?: number;
  roles: string[]; 
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await fetch("http://localhost:10101/usuario/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    console.log("Respuesta del servidor:", response);
    
    const data = await response.json();
    console.log("Datos enviados a backend:", formData, response, data);

    if (!response.ok) {
      throw new Error(data.message || data.error || "Error al actualizar el perfil.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
};
