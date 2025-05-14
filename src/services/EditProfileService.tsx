// src/services/UserProfile.ts
export const updateUserProfile = async (formData: {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}) => {
  try {
    const response = await fetch("http://localhost:10101/usuario/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Error al actualizar el perfil.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor.");
  }
};
