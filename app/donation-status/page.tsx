import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DonationStatusClient from "./donation-status-client"; // Importing the client component

// A simple loading component shown while the main component is loading
const Fallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  </div>
);

export default function DonationStatusPage() {
  return (
    // Suspense ensures a smooth loading experience
    <Suspense fallback={<Fallback />}>
      <DonationStatusClient />
    </Suspense>
  );
}
