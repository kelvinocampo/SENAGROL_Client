export const updateUserProfile = async (formData: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await fetch("http://localhost:10101/usuario/edit", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: formData.id_user,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || "",

        license: formData.license || "",
        soat: formData.soat || "",
        vehicleCard: formData.vehicleCard || "",
        vehicleType: formData.vehicleType || "",
        vehicleWeight: formData.vehicleWeight || 0,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${response.status} - ${data.message || data.error || "Error al actualizar el perfil."}`);
    }

    return data;
  } catch (error: any) {
    console.error("Error en updateUserProfile:", error);
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
};
