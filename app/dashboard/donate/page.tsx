"use client";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { initiateMemberDonation } from "@/lib/redux/features/payment/memberDonationSlice";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Script from "next/script";

declare const Cashfree: any;
type FormData = { amount: number; panNumber?: string };

export default function MemberDonatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { initiateStatus, error } = useSelector(
    (state: RootState) => state.memberDonation
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!userInfo) {
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  const handleCashfreeCheckout = async (
    paymentSessionId: string,
    orderId: string
  ) => {
    try {
      if (typeof Cashfree === "undefined")
        throw new Error("Cashfree SDK not loaded.");
      const cashfree = Cashfree({ mode: "sandbox" });
      await cashfree.checkout({ paymentSessionId, redirectTarget: "_modal" });
      router.push(`/payment-status?order_id=${orderId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Gateway Error",
        description: "Could not open payment window.",
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await dispatch(initiateMemberDonation(data));
    if (initiateMemberDonation.fulfilled.match(result)) {
      const { payment_session_id, order_id } = result.payload;
      await handleCashfreeCheckout(payment_session_id, order_id);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as string) || "Failed to initiate payment.",
      });
    }
  };

  if (!userInfo)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Make a Donation</h2>
            <p className="text-gray-500">Welcome, {userInfo.fullName}!</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="amount">Amount (INR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 500"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="panNumber">PAN Number (Optional)</Label>
              <Input
                id="panNumber"
                placeholder="For tax receipt"
                {...register("panNumber")}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={initiateStatus === "loading"}
            >
              {initiateStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Proceed to Pay"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
