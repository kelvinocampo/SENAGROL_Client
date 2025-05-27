// src/services/LocationService.ts
import axios from "axios";

export type Location = { lat: number; lng: number; };

export interface RouteData {
  origin: Location;
  destination: Location;
}

const API_URL = "https://senagrol.vercel.app/transportador";

export default {
  async getRoute(id_compra: number): Promise<RouteData> {
    const res = await axios.get<RouteData>(`${API_URL}/route/${id_compra}`);
    return res.data;
  },
};
