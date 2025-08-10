// app/payment/success/page.tsx

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentSuccessClient from "./payment-success-client"; // Nayi file ko import karein

// Loading state
const Fallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
    <Loader2 className="h-12 w-12 animate-spin text-green-600" />
  </div>
);

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
