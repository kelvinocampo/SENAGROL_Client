// services/Perfil/EditProfileService.ts

export const updateUserProfile = async (formData: any, vehicleFiles: File[]) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const form = new FormData();

    // Asegúrate de enviar los campos EXACTOS que espera el backend
    form.append("id_user", formData.id_user);
    form.append("name", formData.name);
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    if (formData.password) form.append("password", formData.password);

    form.append("license", formData.license || "");
    form.append("soat", formData.soat || "");
    form.append("vehicleCard", formData.vehicleCard || "");
    form.append("vehicleType", formData.vehicleType || "");
    form.append("vehicleWeight", formData.vehicleWeight?.toString() || "0");

    // Agrega imágenes
    for (const file of vehicleFiles) {
      form.append("imagen", file); // este campo debe llamarse igual que en el backend
    }

    const response = await fetch("http://localhost:10101/usuario/edit", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ NO pongas Content-Type si estás usando FormData
      },
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${response.status} - ${data.message || data.error || "Error al actualizar el perfil."}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
};
