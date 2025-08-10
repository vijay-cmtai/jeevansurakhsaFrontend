// app/donation-status/page.tsx

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DonationStatusClient from "./donation-status-client"; // Nayi file ko import karein

// Loading state
const Fallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  </div>
);

export default function DonationStatusPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <DonationStatusClient />
    </Suspense>
  );
}
