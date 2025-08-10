"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { initiateMemberPayment } from "@/lib/redux/features/payment/memberPaymentSlice";
import { Member } from "@/lib/redux/features/members/membersSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import {
  Loader2,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Download,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Cashfree SDK type definition
declare const Cashfree: any;

// --- A single container for the card frame to ensure consistent size ---
const IDCardFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[320px] h-[512px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
    {children}
  </div>
);

// --- Redesigned ID Card Front Component ---
const IDCardFront = ({ member }: { member: Member }) => {
  // Array for details to ensure perfect alignment using grid
  const details = [
    { label: "ID No", value: member.registrationNo || "N/A" },
    { label: "Mob No", value: member.phone },
    { label: "Email", value: member.email },
    { label: "City", value: member.address?.cityVillage },
  ];

  return (
    <IDCardFrame>
      <div className="flex-grow p-4 bg-white relative">
        {/* Subtle background shape */}
        <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
          <div className="absolute w-[500px] h-[500px] bg-gray-50 rounded-full -top-40 -left-40"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center">
            <div className="inline-block p-1 border-2 border-gray-300 rounded-full">
              <Image
                src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
                alt="Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mt-1">
              Jeevan Suraksha
            </h2>
            <p className="text-[10px] font-semibold text-gray-600 leading-tight">
              A Social Security Collective, An Initiative of Health Guard
              Foundation.
            </p>
            <p className="text-xs font-semibold mt-1 text-blue-600">
              www.jeevansuraksha.org
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 my-3">
            <div className="w-[88px] h-[88px] p-0.5 border-2 border-gray-400">
              {member.profileImageUrl ? (
                <Image
                  src={member.profileImageUrl}
                  alt="Profile"
                  width={88}
                  height={88}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=88x88&data=${member._id}`}
                alt="QR Code"
                width={88}
                height={88}
              />
              <span className="text-[10px] font-semibold text-gray-500 transform -rotate-90 whitespace-nowrap -ml-2">
                Scan To Verify
              </span>
            </div>
          </div>

          <div className="bg-red-600 text-white text-center py-1 rounded">
            <p className="font-bold text-base uppercase">{member.fullName}</p>
            <p className="text-[10px]">
              {member.employment?.contributionPlan || "1 Crore Plan"} - Jeevan
              Suraksha Collective
            </p>
          </div>

          {/* NEW: Grid layout for perfect alignment */}
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs mt-2 flex-grow">
            {details.map((item) => (
              <>
                <strong className="text-left">{item.label}</strong>
                <span>: {item.value}</span>
              </>
            ))}
          </div>

          <div className="text-right">
            <p className="text-xs font-bold">Krishnaiah Panuganti</p>
            <p className="text-[10px] text-gray-600">
              (Chief Relations Officer)
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#37475a] text-white p-2 text-[10px]">
        <p className="text-center font-semibold mb-1">Contact Us</p>
        <div className="flex items-center gap-1">
          <Phone size={10} /> +91 78160 58717
        </div>
        <div className="flex items-center gap-1">
          <Mail size={10} /> info@jeevansuraksha.org
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={10} /> 1-63, Amadabakula, Kothakota, Wanaparty,
          Telangana - 509381
        </div>
      </div>
    </IDCardFrame>
  );
};

// --- Redesigned ID Card Back Component ---
const IDCardBack = ({ member }: { member: Member }) => (
  <IDCardFrame>
    <div className="flex-grow p-4 bg-white relative">
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute w-[500px] h-[500px] bg-gray-50 rounded-full -top-40 -left-40"></div>
      </div>
      <div className="relative z-10 flex flex-col h-full text-center">
        <div className="inline-block p-1 border-2 border-gray-300 rounded-full mx-auto">
          <Image
            src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mt-1">
          Jeevan Suraksha
        </h2>
        <p className="text-[10px] font-semibold text-gray-600 leading-tight">
          A Social Security Collective, An Initiative of Health Guard
          Foundation.
        </p>
        <p className="text-xs font-semibold mt-1 text-blue-600">
          www.jeevansuraksha.org
        </p>

        <div className="flex-grow flex flex-col justify-center items-center mt-4">
          <h3 className="font-bold text-lg text-gray-800">
            TERMS & CONDITIONS
          </h3>
          <div className="text-xs mt-3 text-gray-700 text-left space-y-3">
            <p>
              <strong>Identification:</strong> Carry the ID card at all times
              during working hours for identification purposes.
            </p>
            <p>
              <strong>Authorized Use:</strong> The ID card is strictly for
              official use and should not be shared or used for unauthorized
              purposes.
            </p>
          </div>
        </div>

        <div className="font-semibold text-xs text-gray-800">
          <p>
            Joining Date: {format(new Date(member.createdAt), "dd-MM-yyyy")}
          </p>
          <p>
            Validity:{" "}
            {format(
              new Date(
                new Date(member.createdAt).setFullYear(
                  new Date(member.createdAt).getFullYear() + 1
                )
              ),
              "dd-MM-yyyy"
            )}
          </p>
        </div>
      </div>
    </div>
    <div className="bg-[#37475a] text-white p-2 text-[10px]">
      <p className="text-center font-semibold mb-1">Contact Us</p>
      <div className="flex items-center gap-1">
        <Phone size={10} /> +91 78160 58717
      </div>
      <div className="flex items-center gap-1">
        <Mail size={10} /> info@jeevansuraksha.org
      </div>
      <div className="flex items-center gap-1">
        <MapPin size={10} /> 1-63, Amadabakula, Kothakota, Wanaparty, Telangana
        - 509381
      </div>
    </div>
  </IDCardFrame>
);

// --- Payment Prompt Component (No changes) ---
const PaymentPrompt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector(
    (state: RootState) => state.memberPayment
  );
  const handlePayment = async () => {
    const resultAction = await dispatch(initiateMemberPayment());
    if (initiateMemberPayment.fulfilled.match(resultAction)) {
      const { payment_session_id } = resultAction.payload;
      if (typeof Cashfree !== "undefined") {
        const cashfree = new Cashfree(payment_session_id);
        cashfree.checkout();
      } else {
        alert("Payment gateway failed to load.");
      }
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-xl shadow-2xl border max-w-md"
      >
        <AlertTriangle className="h-16 w-16 mx-auto text-amber-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Payment Pending
        </h2>
        <p className="mt-2 text-gray-600">
          Your ID card will be generated once your membership fee is paid.
        </p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <Button
          onClick={handlePayment}
          disabled={status === "loading"}
          className="mt-6 w-full bg-green-600 hover:bg-green-700"
        >
          {status === "loading" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          Pay Membership Fee Now
        </Button>
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---
export default function GenerateIDCardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, status: authStatus } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!userInfo?.paymentStatus) {
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  if (authStatus === "loading" || authStatus === "idle") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (userInfo) {
    return userInfo.paymentStatus === "Paid" ? (
      <div className="bg-gray-100 min-h-screen py-10 px-4 flex flex-col items-center">
        <div className="bg-[#37475a] text-white font-bold py-2 px-6 rounded-md mb-8 shadow-lg">
          This ID Card Is Verified
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-center items-center gap-8"
        >
          <IDCardFront member={userInfo} />
          <IDCardBack member={userInfo} />
        </motion.div>
        <div className="text-center mt-8">
          <Button
            className="bg-[#37475a] hover:bg-[#2c3a4a] shadow-lg"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    ) : (
      <PaymentPrompt />
    );
  }

  return (
    <div className="flex justify-center items-center h-screen text-center p-4">
      <p className="text-red-500">
        Could not load your information. Please try logging in again.
      </p>
    </div>
  );
}
