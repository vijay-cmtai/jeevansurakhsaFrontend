"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  initiateVisitorDonation,
  resetDonationState,
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Cashfree: any;
  }
}

type FormInputs = {
  name: string;
  email?: string;
  mobile: string;
  amount: number;
  address?: string;
  panNumber?: string;
  bankName?: string;
  branchName?: string;
};

export default function DonateUsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const { status, error, paymentSessionId, orderId } = useSelector(
    (state: RootState) => state.visitorDonation
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  // Load Cashfree SDK
  useEffect(() => {
    const loadCashfreeSDK = () => {
      if (document.getElementById("cashfree-sdk")) {
        if (typeof window.Cashfree === "function") {
          setIsSDKLoaded(true);
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;

      script.onload = () => {
        console.log("Cashfree SDK loaded successfully");
        setTimeout(() => {
          if (typeof window.Cashfree === "function") {
            setIsSDKLoaded(true);
          }
        }, 100);
      };

      script.onerror = () => {
        console.error("Failed to load Cashfree SDK");
        alert("Failed to load payment gateway. Please refresh and try again.");
      };

      document.head.appendChild(script);
    };

    loadCashfreeSDK();

    return () => {
      const script = document.getElementById("cashfree-sdk");
      if (script) {
        script.remove();
      }
    };
  }, []);

  // Launch payment when session ID and order ID are ready and SDK is loaded
  useEffect(() => {
    if (paymentSessionId && orderId && isSDKLoaded) {
      const launchCheckout = async () => {
        try {
          console.log("Launching Cashfree checkout:", {
            sessionId: paymentSessionId,
            orderId: orderId,
          });

          if (typeof window.Cashfree !== "function") {
            throw new Error("Cashfree SDK is not available.");
          }

          const cashfree = window.Cashfree({
            mode: "sandbox", // Change to "production" for live
          });

          const checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_modal",
          };

          const result = await cashfree.checkout(checkoutOptions);

          console.log("Payment result:", result);

          if (result.error) {
            console.error("Payment Error:", result.error);
            alert(
              `Payment Error: ${result.error.message || "Unknown error occurred"}`
            );
          } else {
            // Payment flow completed - redirect to status page
            console.log("Payment flow completed, redirecting to status page");
            console.log("Order ID being passed:", orderId);

            if (orderId) {
              const statusUrl = `/donation-status?order_id=${orderId}&t=${Date.now()}`;
              console.log("Redirecting to:", statusUrl);
              window.location.href = statusUrl;
            } else {
              console.error("No order ID available for redirect");
              alert(
                "Payment completed but order ID missing. Please contact support."
              );
            }
          }
        } catch (error: any) {
          console.error("Cashfree checkout error:", error);
          alert(
            `Payment gateway error: ${error.message || "Unknown error"}. Please try again.`
          );
        } finally {
          dispatch(resetDonationState());
        }
      };

      launchCheckout();
    }
  }, [paymentSessionId, orderId, isSDKLoaded, dispatch]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log("Form submitted with data:", data);
    dispatch(initiateVisitorDonation(data));
  };

  // Handle errors
  useEffect(() => {
    if (status === "failed" && error) {
      console.error("Donation initiation failed:", error);
      alert(`Error: ${error}`);
    }
  }, [status, error]);

  return (
    <div className="min-h-screen w-full bg-[#34495e] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <Shield className="h-16 w-16 mx-auto mb-2 text-blue-600 bg-blue-100 rounded-full p-3" />
          <h1 className="text-xl font-bold text-gray-700">
            Welcome To Jeevan Suraksha
          </h1>
        </div>
        <div className="p-8">
          {!isSDKLoaded && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              Loading payment gateway...
            </div>
          )}

          {status === "loading" && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Processing your donation request...
            </div>
          )}

          {status === "failed" && error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="mobile">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                type="tel"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                className="mt-1"
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobile && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">
                Enter Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Amount must be at least ₹1" },
                })}
                className="mt-1"
                placeholder="Minimum ₹1"
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Id (Optional)</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className="mt-1"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Input id="address" {...register("address")} className="mt-1" />
            </div>

            <div className="text-center pt-4 mt-4 border-t">
              <p className="font-bold text-gray-700">
                If You Want To Claim Tax Deduction, Fill Below Fields Or Leave
                Blank
              </p>
            </div>

            <div>
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                {...register("panNumber", {
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message:
                      "Please enter a valid PAN number (e.g., ABCDE1234F)",
                  },
                })}
                className="mt-1"
                placeholder="ABCDE1234F"
                style={{ textTransform: "uppercase" }}
              />
              {errors.panNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.panNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" {...register("bankName")} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                {...register("branchName")}
                className="mt-1"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg font-bold"
                disabled={status === "loading" || !isSDKLoaded}
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </div>
                ) : (
                  "Donate Now"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
