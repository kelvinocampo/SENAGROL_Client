export const requestTransporter = async (
    license: string,
    soat: string,
    vehicleCard: string,
    vehicleType: string,
    vehicleWeight: string,
    token?: string 
  ) => {
    try {
      const response = await fetch("http://localhost:10101/transportador/requestTransporter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }) 
        },
        body: JSON.stringify({ license, soat, vehicleCard, vehicleType, vehicleWeight }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || data.error || "Algo salió mal en la solicitud.");
      }
  
      return data;
    } catch (error: any) {
      console.error("Error al enviar el formulario de transportador:", error.message);
      throw error;
    }
  };
  