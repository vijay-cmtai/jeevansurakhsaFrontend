"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { initiateMemberDonation } from "@/lib/redux/features/payment/memberDonationSlice";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Script from "next/script";

// Cashfree SDK type definition - Correct v3 implementation
declare const Cashfree: (options: { mode: string }) => {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: string;
  }) => Promise<any>;
};

// Define the shape of our form data
type FormData = {
  name: string;
  mobile: string;
  amount: number;
  panNumber?: string;
};

// A helper component for input fields
const InputField = ({ label, name, register, errors, ...props }: any) => (
  <div className="space-y-1.5 text-left">
    <Label htmlFor={name} className="text-sm font-medium text-gray-500">
      {label}
    </Label>
    <Input
      id={name}
      {...register(name)}
      {...props}
      className="bg-white disabled:bg-gray-100 disabled:opacity-70"
    />
    {errors[name] && (
      <p className="text-xs text-red-500">{errors[name].message}</p>
    )}
  </div>
);

export default function MemberDonatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const { userInfo, status: authStatus } = useSelector(
    (state: RootState) => state.auth
  );
  const { initiateStatus, error: donationError } = useSelector(
    (state: RootState) => state.memberDonation
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!userInfo) {
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.fullName,
        mobile: userInfo.phone,
      });
    }
  }, [userInfo, reset]);

  // Function to handle Cashfree checkout - CORRECTED VERSION
  const handleCashfreeCheckout = async (paymentSessionId: string) => {
    try {
      if (typeof Cashfree !== "undefined") {
        console.log("Initializing Cashfree with session ID:", paymentSessionId);

        // Initialize Cashfree with mode (sandbox for testing)
        const cashfree = Cashfree({
          mode: "sandbox", // Change to "production" for live environment
        });

        // Open checkout with modal popup
        const result = await cashfree.checkout({
          paymentSessionId: paymentSessionId,
          redirectTarget: "_modal", // Opens as popup modal
        });

        console.log("Cashfree checkout result:", result);

        // Handle the result (success/failure/close events)
        if (result && result.paymentDetails) {
          // Payment successful
          toast({
            title: "Payment Successful",
            description: "Thank you for your donation!",
          });

          // Redirect to success page or refresh
          router.push("/payment/success");
        }
      } else {
        throw new Error("Cashfree SDK not loaded properly");
      }
    } catch (error) {
      console.error("Cashfree checkout error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to open payment gateway. Please try again.",
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const resultAction = await dispatch(initiateMemberDonation(data));

      if (initiateMemberDonation.fulfilled.match(resultAction)) {
        const { payment_session_id } = resultAction.payload;
        console.log("Payment session ID received:", payment_session_id);

        // Small delay to ensure SDK is ready
        setTimeout(() => {
          handleCashfreeCheckout(payment_session_id);
        }, 200);
      } else {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description:
            (donationError as string) || "Failed to initiate donation.",
        });
      }
    } catch (error) {
      console.error("Donation submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (authStatus === "loading" || !userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Cashfree SDK Script - CORRECTED URL */}
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive" // Load immediately after page is interactive
        onLoad={() => {
          console.log("Cashfree SDK loaded successfully");

          // Test if Cashfree is available
          if (typeof Cashfree !== "undefined") {
            console.log("✅ Cashfree SDK is ready to use");

            // Test initialization
            try {
              const testCashfree = Cashfree({ mode: "sandbox" });
              console.log(
                "✅ Cashfree initialization test successful:",
                testCashfree
              );
            } catch (e) {
              console.error("❌ Cashfree initialization test failed:", e);
            }
          } else {
            console.error("❌ Cashfree SDK not available after load");
          }
        }}
        onError={(e) => {
          console.error("❌ Failed to load Cashfree SDK:", e);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Failed to load payment gateway. Please refresh the page.",
          });
        }}
      />

      <div className="min-h-screen w-full bg-[#34495e] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md bg-[#f4f7f6] rounded-xl shadow-2xl pt-14 pb-8 px-8"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-full bg-white p-2 shadow-lg flex items-center justify-center">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
                alt="Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Member Donation</h2>
            <p className="text-sm text-gray-500">
              Thank you for your support, {userInfo.fullName}!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Name"
              name="name"
              register={register}
              errors={errors}
              readOnly
              disabled
            />
            <InputField
              label="Mobile Number"
              name="mobile"
              type="tel"
              register={register}
              errors={errors}
              readOnly
              disabled
            />
            <InputField
              label="Enter Amount"
              name="amount"
              placeholder="e.g., 500"
              type="number"
              register={register}
              errors={errors}
              required
            />

            <div className="text-center pt-3 mt-4 border-t">
              <p className="font-bold text-sm text-gray-700">
                Tax Deduction (Optional)
              </p>
            </div>

            <InputField
              label="PAN No."
              name="panNumber"
              placeholder="Enter Pan No (Optional)"
              register={register}
              errors={errors}
            />

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={initiateStatus === "loading"}
                className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
              >
                {initiateStatus === "loading" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Donate Now"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-11 border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
