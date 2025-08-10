"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  verifyMemberPayment,
  resetDonationState,
} from "@/lib/redux/features/payment/memberDonationSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Home,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function PaymentStatusClient() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { verifyStatus, error, currentDonation } = useSelector(
    (state: RootState) => state.memberDonation
  );

  // ✅ State to control polling
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    // Reset state on component mount
    dispatch(resetDonationState());
  }, [dispatch]);

  // ✅ Polling Logic
  useEffect(() => {
    if (orderId && isPolling) {
      // Start polling
      const interval = setInterval(() => {
        console.log("Polling for status for order:", orderId);
        dispatch(verifyMemberPayment(orderId));
      }, 3000); // Har 3 second mein check karega

      // Stop polling after 30 seconds to avoid infinite loops
      const timeout = setTimeout(() => {
        console.log("Polling timed out.");
        setIsPolling(false);
        clearInterval(interval);
      }, 30000);

      // Cleanup function to clear interval and timeout on component unmount
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [dispatch, orderId, isPolling]);

  // ✅ Stop polling if a final status (SUCCESS/FAILED) is received
  useEffect(() => {
    if (
      currentDonation?.status === "SUCCESS" ||
      currentDonation?.status === "FAILED"
    ) {
      console.log("Final status received, stopping polling.");
      setIsPolling(false);
    }
  }, [currentDonation]);

  const renderContent = () => {
    // Loading state, especially on the first check
    if (verifyStatus === "loading" && !currentDonation) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="font-semibold">Verifying your payment...</p>
          <p className="text-sm text-gray-500">
            Please wait, this may take a moment.
          </p>
        </div>
      );
    }

    // SUCCESS state
    if (currentDonation?.status === "SUCCESS") {
      return (
        <div className="text-center space-y-4 py-8">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          <h2 className="text-2xl font-bold text-green-600">
            Payment Successful!
          </h2>
          <p>
            Thank you, {currentDonation.member.fullName}, for your donation of{" "}
            <strong>₹{currentDonation.amount}</strong>.
          </p>
        </div>
      );
    }

    // FAILED state
    if (currentDonation?.status === "FAILED" || verifyStatus === "failed") {
      return (
        <div className="text-center space-y-4 py-8">
          <XCircle className="h-16 w-16 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
          <p className="text-gray-600">
            {error || "The transaction could not be completed."}
          </p>
        </div>
      );
    }

    // PENDING state (or if polling is still active)
    return (
      <div className="text-center space-y-4 py-8">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <h2 className="text-2xl font-bold text-orange-600">
          Payment is Processing...
        </h2>
        <p className="text-gray-600">
          Awaiting final confirmation from the bank. We are checking for
          updates.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h1 className="text-lg font-semibold text-center">
            Transaction Status
          </h1>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/dashboard/receipt/donation">View All Receipts</Link>
          </Button>
          <Button className="w-full" variant="secondary" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
