// src/pages/producto/PagoWrapper.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Pago from "./pago"; // Asegúrate de que "pago" esté bien escrito y exportado

const stripePromise = loadStripe("pk_test_51RYEL6GdDclfDB049Tw1AeQpaNo5thhc1odbufJ88oyQypnS6j0hFzvZ76GQKC9MedhR5rGGmau8oe1AQ0cqH9pG00s7PNPn90"); // ✅ Usa tu clave pública real de Stripe

export default function PagoWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Pago />
    </Elements>
  );
}
