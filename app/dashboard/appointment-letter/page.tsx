"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppointmentLetterPage() {
  const dispatch = useDispatch<AppDispatch>();
  // Data ab 'auth' slice se aayega
  const { userInfo, status, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // Agar page refresh hua hai ya user details poore nahi hain, to profile fetch karo
    if (!userInfo?.address) {
      // Check for a field that only exists in the full profile
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    // QR code ke liye current page ka URL use karein
    if (typeof window !== "undefined") {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
        window.location.href
      )}`;
      setQrCodeUrl(url);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Loading State
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-600">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="text-lg font-semibold">Loading Your Letter...</p>
      </div>
    );
  }

  // Error State
  if (status === "failed" || !userInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 bg-red-50 p-4 text-center">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Could not load your details.</p>
        <p className="text-sm">{error || "Please try logging in again."}</p>
      </div>
    );
  }

  // Check if member is active
  if (userInfo.membershipStatus !== "Active") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-orange-600 bg-orange-50 p-4 text-center">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Account Not Active</p>
        <p className="text-sm">
          Your appointment letter is available only after your membership is
          active.
        </p>
      </div>
    );
  }

  // Success State - Render the letter
  return (
    <div className="bg-gray-100 py-10 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto text-center mb-6 print:hidden">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold py-2 px-4 rounded-full border border-green-300">
          <ShieldCheck className="h-5 w-5" />
          This Appointment Letter Is Verified
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-2xl rounded-lg border print:shadow-none print:border-none"
      >
        <header className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <Image
              src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
              alt="Logo"
              width={150}
              height={49}
            />
            <p className="text-sm text-blue-600 mt-1">www.jeevansuraksha.org</p>
          </div>
          {qrCodeUrl && (
            <Image src={qrCodeUrl} alt="QR Code" width={100} height={100} />
          )}
        </header>

        <div className="bg-[#2d3748] text-white text-center py-2.5 my-6">
          <h2 className="font-semibold text-lg uppercase tracking-wider">
            Appointment Letter
          </h2>
        </div>

        <div className="text-sm text-gray-800 space-y-4 leading-relaxed">
          <div className="flex justify-between">
            <p>
              <strong>To,</strong>
              <br />
              {userInfo.fullName}
              <br />
              {`${userInfo.address?.cityVillage}, ${userInfo.address?.pincode}`}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {format(new Date(userInfo.createdAt), "dd MMMM, yyyy")}
            </p>
          </div>
          <p className="pt-4">
            <strong>Subject:</strong> Letter Of Appointment.
          </p>
          <p>
            <strong>Dear {userInfo.fullName},</strong>
          </p>
          <p>
            We are thrilled to extend an invitation to you to become a member of
            our organization. On behalf of our entire team, we warmly welcome
            you to our organization.
          </p>
          <p>
            Your commitment to our cause and your passion for making a
            difference in the community have not gone unnoticed. We believe that
            your involvement will greatly contribute to our efforts in our
            mission.
          </p>
          <p>
            As a member, you will have the opportunity to participate in our
            various initiatives, events, and projects aimed at our organization.
            Your input and contributions will be invaluable in advancing our
            mission and creating positive change.
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Access to members-only events and workshops.</li>
            <li>
              Networking opportunities with like-minded individuals and
              organizations.
            </li>
            <li>
              Regular updates and newsletters on our projects and initiatives.
            </li>
            <li>
              Opportunities for professional development and growth within the
              organization.
            </li>
          </ul>
          <p>
            Once again, welcome to our organization. Together, we can make a
            meaningful impact and create positive change in our community.
          </p>
          <div className="pt-8">
            <p>Yours sincerely,</p>
            <p className="mt-4 font-semibold">Krishnaiah Panuganti</p>
            <p>(Chief Relations Officer)</p>
            <p>Jeevan Suraksha</p>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-xs text-slate-500">
          <p className="font-semibold">Jeevan Suraksha</p>
          <p>
            1-63, Amadabakula, Kothakota, Wanaparty, Telangana, India - 509381
          </p>
          <p>+91 78160 58717 | info@jeevansuraksha.org</p>
        </footer>
      </motion.div>
      <div className="text-center mt-8 print:hidden">
        <Button onClick={handlePrint}>Download as PDF / Print</Button>
      </div>
    </div>
  );
}
