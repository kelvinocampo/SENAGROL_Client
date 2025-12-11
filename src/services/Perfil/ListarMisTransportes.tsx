import api from "../../config/api";

const TransportService = {
  async getTransports(id_user: number) {
    try {
      const response = await api.get(`/transportador/transports`, {
        params: { id_user }
      });
      return response.data.transports;
    } catch (error) {
      console.error("Error al obtener transportes:", error);
      throw error;
    }
  },

  async cancelarCompra(id_compra: number) {
    try {
      const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
      const response = await api.patch(`/compra/cancelTransport/${id_compra}`, { id_user });
      return response.data;
    } catch (error: any) {
      console.error("Error al cancelar compra:", error);
      throw new Error(error.response?.data?.message || "Error al cancelar la compra");
    }
  },
};

export default TransportService;
