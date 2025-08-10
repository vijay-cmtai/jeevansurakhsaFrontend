import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RegistrationStatusClient from "./registration-status-client"; 

const Fallback = () => (
  <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p className="text-slate-600 font-semibold">Loading Page...</p>
    </div>
  </div>
);

export default function RegistrationSuccessPage() {
  return (
    // Suspense boundary yahan wrap karega.
    // Jab tak RegistrationStatusClient load nahi hota, Fallback component dikhega.
    <Suspense fallback={<Fallback />}>
      <RegistrationStatusClient />
    </Suspense>
  );
}
