export async function requestTransporter(
  formData: {
    license: string;
    soat: string;
    vehicleCard: string;
    vehicleType: string;
    vehicleWeight: string;
  },
  images: File[],
  token: string
) {
  const formDataToSend = new FormData();
  formDataToSend.append("license", formData.license);
  formDataToSend.append("soat", formData.soat);
  formDataToSend.append("vehicleCard", formData.vehicleCard);
  formDataToSend.append("vehicleType", formData.vehicleType);
  formDataToSend.append("vehicleWeight", formData.vehicleWeight);

  images.forEach((file) => {
    formDataToSend.append("imagen", file);
  });

  const response = await fetch(
    "http://localhost:10101/transportador/requestTransporter",
    {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formDataToSend,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al enviar el formulario");
  }

  return data;
}
