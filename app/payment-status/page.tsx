import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentStatusClient from "./payment-status-client";

const Fallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  </div>
);

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <PaymentStatusClient />
    </Suspense>
  );
}
