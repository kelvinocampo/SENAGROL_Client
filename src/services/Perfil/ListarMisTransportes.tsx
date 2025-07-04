const API_BASE = "https://senagrol.up.railway.app";

const TransportService = {
  async getTransports(id_user: number) {
    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE}/transportador/transports?id_user=${id_user}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener transportes");
      }

      const data = await response.json();
      return data.transports;
    } catch (error) {
      console.error("Error al obtener transportes (fetch):", error);
      throw error;
    }
  },

  async cancelarCompra(id_compra: number) {
    try {
      const token = localStorage.getItem("token");
      const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
      const url = `${API_BASE}/compra/cancelTransport/${id_compra}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_user }),  // enviar id_user en body
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error en respuesta cancelar compra:", response.status, text);
        throw new Error("Error al cancelar la compra");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cancelar compra:", error);
      throw error;
    }
  },
};

export default TransportService;
