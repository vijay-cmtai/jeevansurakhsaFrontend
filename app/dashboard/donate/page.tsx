"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useForm,
  SubmitHandler,
  Path,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { initiateMemberDonation } from "@/lib/redux/features/payment/memberDonationSlice";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Script from "next/script";

declare const Cashfree: any;

// The shape of our form data
type FormData = {
  name: string;
  mobile: string;
  amount: number;
  panNumber?: string;
};

// A generic, type-safe InputField component
interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: { [key: string]: any };
  [key: string]: any;
}
const InputField = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  ...props
}: InputFieldProps<T>) => (
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
      reset({ name: userInfo.fullName, mobile: userInfo.phone });
    }
  }, [userInfo, reset]);

  const handleCashfreeCheckout = async (
    paymentSessionId: string,
    orderId: string
  ) => {
    try {
      if (typeof Cashfree === "undefined")
        throw new Error("Cashfree SDK not loaded.");
      const cashfree = Cashfree({ mode: "sandbox" }); // Use "production" for live
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
    try {
      const resultAction = await dispatch(
        initiateMemberDonation({
          amount: data.amount,
          panNumber: data.panNumber,
        })
      );
      if (initiateMemberDonation.fulfilled.match(resultAction)) {
        const { payment_session_id, order_id } = resultAction.payload;
        await handleCashfreeCheckout(payment_session_id, order_id);
      } else {
        // This will now show the specific error from the backend, like the missing phone number message
        toast({
          variant: "destructive",
          title: "Initiation Failed",
          description:
            (resultAction.payload as string) ||
            "Could not start the donation process.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
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
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="lazyOnload"
      />
      <div className="min-h-screen w-full bg-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md bg-slate-50 rounded-xl shadow-2xl pt-16 pb-8 px-8"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full bg-white p-2 shadow-lg flex items-center justify-center">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Member Donation
            </h2>
            <p className="text-sm text-gray-500">
              Thank you for your support, {userInfo.fullName}!
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField<FormData>
              label="Name"
              name="name"
              register={register}
              errors={errors}
              readOnly
              disabled
            />
            <InputField<FormData>
              label="Mobile Number"
              name="mobile"
              type="tel"
              register={register}
              errors={errors}
              readOnly
              disabled
            />
            <InputField<FormData>
              label="Enter Amount (INR)"
              name="amount"
              placeholder="e.g., 500"
              type="number"
              register={register}
              errors={errors}
            />
            <div className="text-center pt-4 mt-4 border-t">
              <p className="font-semibold text-sm text-gray-600">
                For Tax Deduction (Optional)
              </p>
            </div>
            <InputField<FormData>
              label="PAN No."
              name="panNumber"
              placeholder="Enter PAN No. to claim tax benefits"
              register={register}
              errors={errors}
            />
            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={initiateStatus === "loading"}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md"
              >
                {initiateStatus === "loading" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Donate Now"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="w-full h-11"
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
