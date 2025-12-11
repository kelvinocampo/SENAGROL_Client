import api from "../../config/api";

export async function requestTransporter(
  formData: {
    license: string;
    soat: string;
    vehicleCard: string;
    vehicleType: string;
    vehicleWeight: string;
  },
  images: File[]
) {
  const formDataToSend = new FormData()
  formDataToSend.append("license", formData.license)
  formDataToSend.append("soat", formData.soat)
  formDataToSend.append("vehicleCard", formData.vehicleCard)
  formDataToSend.append("vehicleType", formData.vehicleType)
  formDataToSend.append("vehicleWeight", formData.vehicleWeight)

  // 🔑 Usa EL MISMO nombre que espera Multer en el backend:
  images.forEach((file) => {
    formDataToSend.append("imagen", file)
  })

  // api instance handles base URL and Authorization header (if token in localstorage)
  // axios handles multipart/form-data automatically
  try {
    const response = await api.post("/transportador/requestTransporter", formDataToSend);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al enviar el formulario");
  }
}
