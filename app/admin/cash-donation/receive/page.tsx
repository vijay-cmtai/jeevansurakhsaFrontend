"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { createCashDonation } from "@/lib/redux/features/donations/cashDonationsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// The form type now includes the optional FileList for the image
type FormInputs = {
  name: string;
  email: string;
  mobile: string;
  address: string;
  amount: number;
  panNumber?: string;
  bankName?: string;
  branchName?: string;
  paymentImage?: FileList;
};

export default function ReceiveCashDonationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { actionStatus } = useSelector(
    (state: RootState) => state.cashDonations
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // Create a FormData object to handle the optional file upload
    const formData = new FormData();

    // Loop through the data and append to FormData
    Object.entries(data).forEach(([key, value]) => {
      // This correctly handles the optional image file
      if (
        key === "paymentImage" &&
        value instanceof FileList &&
        value.length > 0
      ) {
        formData.append(key, value[0]);
      } else if (value) {
        // Append other non-empty fields
        formData.append(key, String(value));
      }
    });

    // Dispatch the thunk with the FormData object
    dispatch(createCashDonation(formData)).then((result) => {
      if (createCashDonation.fulfilled.match(result)) {
        alert("Donation recorded successfully!");
        reset();
        router.push("/admin/cash-donation/receipt");
      } else {
        alert(`Error: ${result.payload || "An unknown error occurred."}`);
      }
    });
  };

  return (
    <div className="flex justify-center items-start pt-10 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-2xl my-10 shadow-lg">
        <CardHeader className="items-center text-center">
          <Image
            src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full mb-4 bg-white p-1"
          />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Cash Donation Receiving Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Required Fields */}
            <div className="space-y-1">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter donor's name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">Name is required.</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="mobile">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                placeholder="Enter mobile number"
                type="tel"
                {...register("mobile", { required: true })}
              />
              {errors.mobile && (
                <p className="text-xs text-red-500">
                  Mobile number is required.
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">
                Enter Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                placeholder="Enter amount in INR"
                type="number"
                {...register("amount", { required: true, valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-xs text-red-500">Amount is required.</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Id</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                {...register("email")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                {...register("address")}
              />
            </div>

            {/* Tax Deduction Fields */}
            <div className="text-center pt-4 mt-4 border-t">
              <p className="font-bold text-gray-700">
                Tax Deduction Fields (Optional)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  placeholder="Enter PAN Number"
                  {...register("panNumber")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter Bank Name"
                  {...register("bankName")}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                placeholder="Enter Bank Branch Name"
                {...register("branchName")}
              />
            </div>

            {/* Image Upload Input is now back */}
            <div className="space-y-1">
              <Label htmlFor="paymentImage">
                Payment Image Upload (Optional)
              </Label>
              <Input
                id="paymentImage"
                type="file"
                {...register("paymentImage")}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Donate Now"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
