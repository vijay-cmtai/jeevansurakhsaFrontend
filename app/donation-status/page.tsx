"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  checkDonationStatus, // Sahi slice se import karein
  resetDonationState, // Sahi slice se import karein
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Home,
  Download,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DonationStatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  // Sahi slice se state select karein: visitorDonation
  const { status, error, currentDonationStatus } = useSelector(
    (state: RootState) => state.visitorDonation
  );

  // Polling state for retrying
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    // Page load hote hi state reset karein
    dispatch(resetDonationState());
  }, [dispatch]);

  // Status check karne ke liye useEffect
  useEffect(() => {
    if (orderId && isPolling) {
      const interval = setInterval(() => {
        dispatch(checkDonationStatus(orderId));
      }, 3000); // Har 3 second mein check karega

      // Clear interval jab status badal jaaye ya 30 seconds ke baad
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsPolling(false);
      }, 30000); // 30 seconds tak try karega

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setIsPolling(false);
    }
  }, [dispatch, orderId, isPolling]);

  // Stop polling once we get a final status
  useEffect(() => {
    if (
      currentDonationStatus?.status === "SUCCESS" ||
      currentDonationStatus?.status === "FAILED"
    ) {
      setIsPolling(false);
    }
  }, [currentDonationStatus]);

  const handleRetry = () => {
    if (orderId) {
      setIsPolling(true); // Retry ke liye polling fir se start karein
      dispatch(checkDonationStatus(orderId));
    }
  };

  const renderContent = () => {
    if (!orderId) {
      return (
        <div className="text-center space-y-4 py-8">
          <XCircle className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="text-xl font-bold text-gray-600">
            No Transaction Found
          </h2>
          <p className="text-gray-500">
            No transaction ID was found in the URL.
          </p>
        </div>
      );
    }

    if (isPolling && !currentDonationStatus) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 font-semibold">
            Verifying your payment, please wait...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center space-y-4 py-8">
          <XCircle className="h-16 w-16 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold text-red-600">
            Verification Failed
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={handleRetry} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      );
    }

    if (currentDonationStatus) {
      switch (currentDonationStatus.status) {
        case "SUCCESS":
          return (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">
                Thank You for your Donation!
              </h2>
              <p className="text-gray-600">
                Your donation of{" "}
                <strong>₹{currentDonationStatus.amount}</strong> was successful.
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-md border text-sm space-y-2 mt-4">
                <p>
                  <strong>Transaction ID:</strong> {orderId}
                </p>
                <p>
                  <strong>Receipt No:</strong>{" "}
                  {currentDonationStatus.receiptNo || "Generating..."}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {format(
                    new Date(currentDonationStatus.createdAt),
                    "dd MMM, yyyy"
                  )}
                </p>
              </div>
            </div>
          );
        case "FAILED":
          return (
            <div className="text-center space-y-4 py-8">
              <XCircle className="h-16 w-16 mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">
                Payment Failed
              </h2>
              <p className="text-gray-600">
                Your transaction could not be completed.
              </p>
            </div>
          );
        case "PENDING":
          return (
            <div className="text-center space-y-4 py-8">
              <AlertTriangle className="h-16 w-16 mx-auto text-orange-500" />
              <h2 className="text-2xl font-bold text-orange-600">
                Payment Pending
              </h2>
              <p className="text-gray-600">
                Your payment is still being processed. We'll update the status
                shortly.
              </p>
              <Button onClick={handleRetry} variant="outline" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" /> Check Status Again
              </Button>
            </div>
          );
      }
    }

    return null; // Default case
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-lg font-semibold text-gray-500">
            Donation Status
          </h1>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        <div className="p-6 border-t bg-gray-50">
          <Button className="w-full" variant="secondary" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
