"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertTriangle, XCircle } from "lucide-react";
import { format, isValid } from "date-fns";

// --- Reusable Detail Row Component ---
const DetailRow = ({
  label,
  value,
  status,
}: {
  label: string;
  value: string | undefined | null;
  status?: "Success" | "Pending" | "Failed" | "Active" | "Blocked" | "Inactive";
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "Success":
      case "Active":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case "Pending":
        return <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />;
      case "Failed":
      case "Blocked":
      case "Inactive":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-700 last:border-b-0">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <div className="flex items-center gap-x-2">
        <span className="text-sm font-semibold text-white">
          {value || "N/A"}
        </span>
        {status && getStatusIcon()}
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function MembershipStatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    userInfo,
    status: authStatus,
    error,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Fetch profile if not already available in the state
    if (!userInfo) {
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  // --- Loading State ---
  if (authStatus === "loading" || !userInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
        <p className="text-gray-600">Loading Your Membership Status...</p>
      </div>
    );
  }

  // --- Error State ---
  if (authStatus === "failed") {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-700 p-4">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold">Failed to load status</h2>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  // Safely format dates
  const verificationDate =
    userInfo.createdAt && isValid(new Date(userInfo.createdAt))
      ? format(new Date(userInfo.createdAt), "dd-MM-yyyy")
      : "N/A";

  const validityDate =
    userInfo.createdAt && isValid(new Date(userInfo.createdAt))
      ? format(
          new Date(
            new Date(userInfo.createdAt).setFullYear(
              new Date(userInfo.createdAt).getFullYear() + 1
            )
          ),
          "dd-MM-yyyy"
        )
      : "N/A";

  // --- Success State ---
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Membership Status</h1>
      <p className="mt-1 text-gray-600">Welcome back, {userInfo.fullName}</p>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="mt-8 max-w-2xl mx-auto"
      >
        <div className="bg-[#2d3748] rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-green-500 text-white text-center py-3">
            <h2 className="font-semibold text-lg">Your Membership Details</h2>
          </div>
          <div className="p-4">
            <DetailRow
              label="Registration No"
              value={userInfo.registrationNo}
            />
            <DetailRow
              label="Account Status"
              value={userInfo.membershipStatus}
              status={userInfo.membershipStatus}
            />
            <DetailRow label="Verification Date" value={verificationDate} />
            <DetailRow label="Validity" value={validityDate} />
            <DetailRow
              label="Membership Fee"
              value={userInfo.paymentStatus}
              status={
                userInfo.paymentStatus === "Paid"
                  ? "Success"
                  : userInfo.paymentStatus
              }
            />
          </div>
        </div>
        <p className="text-center mt-4 text-xs text-gray-500">
          For any queries, please contact us at info@jeevansuraksha.org
        </p>
      </motion.div>
    </div>
  );
}
