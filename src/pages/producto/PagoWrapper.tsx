// src/pages/producto/PagoWrapper.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Pago from "./pago"; // Asegúrate de que "pago" esté bien escrito y exportado

const stripePromise = loadStripe("pk_test_51abc123..."); // ✅ Usa tu clave pública real de Stripe

export default function PagoWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Pago />
    </Elements>
  );
}
