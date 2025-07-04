export const updateUserProfile = async (formData: any, vehicleFiles: File[] = []) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const form = new FormData();

    form.append("id_user", formData.id_user.toString());
    form.append("name", formData.name);
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("phone", formData.phone);

    // Solo añade la contraseña si se ingresó
    if (formData.password && formData.password.trim() !== "") {
      form.append("password", formData.password);
    }

    // Datos de transportador (solo si tienen valor)
    if (formData.license && formData.license.trim().length > 0) {
      form.append("license", formData.license);
    }

    if (formData.soat && formData.soat.trim().length > 0) {
      form.append("soat", formData.soat);
    }

    if (formData.vehicleCard && formData.vehicleCard.trim().length > 0) {
      form.append("vehicleCard", formData.vehicleCard);
    }

    if (formData.vehicleType && formData.vehicleType.trim().length > 0) {
      form.append("vehicleType", formData.vehicleType);
    }

    const weightNumber = Number(formData.vehicleWeight);
    if (!isNaN(weightNumber) && weightNumber >= 500 && weightNumber <= 50000) {
      form.append("vehicleWeight", weightNumber.toString());
    }

    // Archivos del vehículo (⚠️ verifica que el backend espera "fotos_vehiculo[]" como nombre del campo)
    for (const file of vehicleFiles) {
   form.append("imagen", file);
    }

    // Log para depurar el contenido del FormData
    for (const pair of form.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await fetch("http://localhost:10101/usuario/edit", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ No pongas Content-Type cuando usas FormData
      },
      body: form,
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
