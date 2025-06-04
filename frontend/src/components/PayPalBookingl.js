// src/components/PayPalBooking.js
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PayPalBooking({ amount, onPaymentSuccess }) {
  const [showPayPal, setShowPayPal] = useState(false);

  return (
    <PayPalScriptProvider options={{ "client-id": "AbjvcJJ1B-VQqqlMvk-m55Tnp-D5F4kAO2HxmjBqoKvI6NUkYWhWozZ3GcNlw4rfEIFKJIE8hkgxCm80" }}> {/* Replace "test" with your actual client-id */}
      {!showPayPal ? (
        <button
          style={{
            backgroundColor: "#4f46e5",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => setShowPayPal(true)}
        >
          Book
        </button>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: amount } }],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(details => {
                onPaymentSuccess();
              });
            }}
          />
        </div>
      )}
    </PayPalScriptProvider>
  );
}
