import api from "../../config/api";

export const requestSeller = async () => {
  try {
    const response = await api.post("/vendedor/requestSeller", {});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || "Error al solicitar ser vendedor.");
  }
};