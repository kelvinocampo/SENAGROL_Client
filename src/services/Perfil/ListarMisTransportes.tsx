import axios from "axios";


const TransportService = {
  async getTransports(id_user: number) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost/10101/transportador/transports", {
        params: { id_user },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.transports;
    } catch (error) {
      console.error("Error al obtener transportes:", error);
      throw error;
    }
  },
};

export default TransportService;
