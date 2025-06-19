// src/pages/producto/PagoWrapper.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Pago from "./pago"; // Asegúrate de que esta ruta sea correcta

const stripePromise = loadStripe("pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"); // reemplaza con tu clave pública

export default function PagoWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Pago />
    </Elements>
  );
}
