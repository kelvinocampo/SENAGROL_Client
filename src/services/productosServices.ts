// src/services/productosServices.ts

//const API_URL = "http://localhost:10101"; // PUERTO CORRECTO

//export const getProductos = async () => {
  //const response = await axios.get(`${API_URL}/productos`);
  //return response.data;
//
// Importación directa de imágenes
import OrganicRedApples from "../assets/SliderProductos/OrganicRedApples.png";
import FreeRangeEggs from "../assets/SliderProductos/FreeRangeEggs.png";
import GrassFedBeef from "../assets/SliderProductos/GrassFedBeef.png";
import FreshStrawberries from "../assets/SliderProductos/FreshStrawberries.png";
import WildCaughtSalmon from "../assets/SliderProductos/WildCaughtSalmon.png";
import ArtisanalCheese from "../assets/SliderProductos/ArtisanalCheese.png";
import HeirloomTomatoes from "../assets/SliderProductos/HeirloomTomatoes.png";
import LocalHoney from "../assets/SliderProductos/LocalHoney.png";
import HomemadeBread from "../assets/SliderProductos/HomemadeBread.png";


// Objeto de imágenes mapeadas
export const imagenes: Record<string, string> = {
  "OrganicRedApples.png": OrganicRedApples,
  "FreeRangeEggs.png": FreeRangeEggs,
  "GrassFedBeef.png": GrassFedBeef,
  "FreshStrawberries.png": FreshStrawberries,
  "WildCaughtSalmon.png": WildCaughtSalmon,
  "ArtisanalCheese.png": ArtisanalCheese,
  "HeirloomTomatoes.png": HeirloomTomatoes,
  "LocalHoney.png": LocalHoney,
  "HomemadeBread.png": HomemadeBread,
};

// Mock de productos actualizado
export const getProductosMock = async () => {
  return [
    { nombre: "Manzanas Rojas Orgánicas", precio: "$1.99/lb", imagen: "OrganicRedApples.png" },
    { nombre: "Huevos de Gallinas Libres", precio: "$4.99/docena", imagen: "FreeRangeEggs.png" },
    { nombre: "Carne de Res Alimentada con Pasto", precio: "$12.99/lb", imagen: "GrassFedBeef.png" },
    { nombre: "Fresas Frescas", precio: "$3.99/lb", imagen: "FreshStrawberries.png" },
    { nombre: "Salmón Salvaje", precio: "$18.75/lb", imagen: "WildCaughtSalmon.png" },
    { nombre: "Queso Artesanal", precio: "$7.99/lb", imagen: "ArtisanalCheese.png" },
    { nombre: "Tomates Heirloom", precio: "$2.45/lb", imagen: "HeirloomTomatoes.png" },
    { nombre: "Miel Local", precio: "$6.75/frasco", imagen: "LocalHoney.png" },
    { nombre: "Pan Casero", precio: "$3.75/pieza", imagen: "HomemadeBread.png" },
  ];
};


