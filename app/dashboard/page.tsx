"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import {
  fetchMyNotices,
  MyNotice,
} from "@/lib/redux/features/notices/noticesSlice";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

// Helper component for stat cards
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  delay,
  href,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
  href: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Link href={href} className="block">
      <div
        className={`rounded-xl p-6 text-white shadow-lg ${color} transition-transform hover:scale-105`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium opacity-80 uppercase">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Helper component for the single notice board
const NoticeBoard = ({
  title,
  notices,
  color,
}: {
  title: string;
  notices: MyNotice[];
  color: string;
}) => (
  <div className="border-2 rounded-lg mt-8" style={{ borderColor: color }}>
    <h3
      className="font-semibold text-white px-6 py-2 rounded-t-md"
      style={{ backgroundColor: color }}
    >
      {title}
    </h3>
    <div className="p-4 space-y-3 bg-white">
      {notices.length > 0 ? (
        notices.map((notice) => (
          <div
            key={notice._id}
            className="text-sm text-gray-700 border-b last:border-b-0 pb-3"
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold text-base">{notice.title}</p>
              {notice.recipientType === "Single" && (
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Personal
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{notice.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {format(new Date(notice.createdAt), "dd MMM, yyyy 'at' hh:mm a")}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 py-4 text-center">
          No new notices found.
        </p>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { myNotices } = useSelector((state: RootState) => state.notices);

  useEffect(() => {
    if (!userInfo) {
      dispatch(getMemberProfile());
    }
    dispatch(fetchMyNotices());
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  const paymentInfo = (() => {
    switch (userInfo.paymentStatus) {
      case "Paid":
        return {
          value: "Paid",
          icon: CheckCircle,
          color: "bg-gradient-to-r from-green-500 to-emerald-500",
        };
      case "Pending":
        return {
          value: "Pending",
          icon: Loader2,
          color: "bg-gradient-to-r from-amber-500 to-orange-500",
        };
      case "Failed":
        return {
          value: "Failed",
          icon: XCircle,
          color: "bg-gradient-to-r from-red-500 to-rose-500",
        };
      default:
        return {
          value: "N/A",
          icon: XCircle,
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
        };
    }
  })();

  const membershipInfo = (() => {
    switch (userInfo.membershipStatus) {
      case "Active":
        return {
          value: "Active",
          icon: CheckCircle,
          color: "bg-gradient-to-r from-teal-400 to-cyan-600",
        };
      case "Pending":
        return {
          value: "Pending",
          icon: Loader2,
          color: "bg-gradient-to-r from-amber-500 to-orange-500",
        };
      default:
        return {
          value: "Inactive",
          icon: XCircle,
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
        };
    }
  })();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
      <p className="mt-1 text-gray-600">Welcome back, {userInfo.fullName}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          title="ID Card"
          value="View Card"
          icon={FileText}
          color="bg-gradient-to-r from-cyan-500 to-blue-500"
          delay={0.1}
          href="/dashboard/generate-id"
        />
        <StatCard
          title="Appointment Letter"
          value="View Letter"
          icon={Calendar}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          delay={0.2}
          href="/dashboard/appointment-letter"
        />
        <StatCard
          title="Membership Payment"
          {...paymentInfo}
          delay={0.3}
          href="/dashboard/membership-status"
        />
        <StatCard
          title="Membership Status"
          {...membershipInfo}
          delay={0.4}
          href="/dashboard/membership-status"
        />
      </div>

      <div className="mt-8">
        <NoticeBoard title="Notice Board" notices={myNotices} color="#34495e" />
      </div>
    </div>
  );
}
