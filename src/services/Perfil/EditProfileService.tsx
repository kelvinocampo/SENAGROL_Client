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

    // Datos de transportador
    form.append("license", formData.license || "");
    form.append("soat", formData.soat || "");
    form.append("vehicleCard", formData.vehicleCard || "");
    form.append("vehicleType", formData.vehicleType || "");
  form.append("vehicleWeight", String(Number(formData.vehicleWeight) || 0));

    // ⚠️ Este nombre debe coincidir con req.files.imagen
    for (const file of vehicleFiles) {
      form.append("imagen", file);
    }
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
