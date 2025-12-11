import api from "../../config/api";

export interface Ubicacion {
  latitud_comprador: string;
  longitud_comprador: string;
  latitud: string;
  longitud: string;
}

export interface RespuestaUbicacion {
  success: boolean;
  message: Ubicacion | string;
}

export const obtenerUbicacionCompra = async (
  id_compra: number
): Promise<RespuestaUbicacion> => {
  const response = await api.get(`/compra/getLocation/${id_compra}`);
  return response.data;
};