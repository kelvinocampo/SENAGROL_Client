import api from "../../config/api";

export const updateUserProfile = async (formData: any, vehicleFiles: File[] = []) => {
  try {
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
    if (vehicleFiles.length > 0) {
      for (const file of vehicleFiles) {
        form.append("imagen", file);
      }
    }

    // Axios set Authorization header automatically via interceptor
    // Axios sets Content-Type to multipart/form-data automatically when body is FormData
    const response = await api.post("/usuario/edit", form);

    return response.data;
  } catch (error: any) {
    console.error("Error en updateUserProfile:", error);
    throw new Error(error.response?.data?.message || error.message || "Error de conexión con el servidor.");
  }
};