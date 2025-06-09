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

    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== undefined && v !== "")
    );

    const response = await fetch("http://localhost:10101/usuario/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanedData),
    });

    const data = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log("Datos enviados a backend:", cleanedData);
      console.log("Respuesta del servidor:", response, data);
    }

    if (!response.ok) {
      throw new Error(`${response.status} - ${data.message || data.error || "Error al actualizar el perfil."}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
};
