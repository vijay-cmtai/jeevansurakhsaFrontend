"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchDashboardStats } from "@/lib/redux/features/dashboard/dashboardSlice";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserX,
  Receipt,
  HandHeart,
  Banknote,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}

const StatCard = ({
  title,
  value,
  label,
  icon: Icon,
  color,
  delay,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`relative rounded-xl p-5 text-white shadow-lg overflow-hidden ${color}`}
  >
    <div className="relative z-10">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          {label && <p className="text-xs opacity-80">({label})</p>}
        </div>
        <div className="p-2 bg-white/20 rounded-full">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
    <Icon className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
  </motion.div>
);

const SectionTitle = ({ text }: { text: string }) => (
  <div className="relative my-6 text-center">
    <span className="bg-gray-100 px-4 text-sm font-semibold uppercase text-gray-500 tracking-wider">
      {text}
    </span>
  </div>
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDashboardStats());
    }
  }, [status, dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        <span className="ml-4 text-gray-600">Loading Dashboard Data...</span>
      </div>
    );
  }

  if (status === "failed" || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 p-4 rounded-lg">
        <AlertCircle className="h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold">Failed to Load Dashboard</h2>
        <p className="mt-2">{error || "An unknown error occurred."}</p>
        <button
          onClick={() => dispatch(fetchDashboardStats())}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="mt-1 text-gray-600">Welcome back!</p>

      <div className="mt-8 space-y-8">
        <div>
          <SectionTitle text="Member" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Members"
              value={stats.members.total}
              icon={Users}
              color="bg-gradient-to-tr from-cyan-500 to-blue-600"
              delay={0.1}
            />
            <StatCard
              title="New Memberships"
              label="Pending Payment"
              value={stats.members.new}
              icon={UserPlus}
              color="bg-gradient-to-tr from-purple-500 to-pink-600"
              delay={0.2}
            />
            <StatCard
              title="Active Members"
              value={stats.members.active}
              icon={ShieldCheck}
              color="bg-gradient-to-tr from-teal-400 to-cyan-500"
              delay={0.3}
            />
            <StatCard
              title="Blocked Members"
              value={stats.members.blocked}
              icon={UserX}
              color="bg-gradient-to-tr from-orange-500 to-red-600"
              delay={0.4}
            />
          </div>
        </div>

        <div>
          <SectionTitle text="Donation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Membership Fee"
              label="From Paid Members"
              value={formatCurrency(stats.donations.membershipFee)}
              icon={Banknote}
              color="bg-gradient-to-tr from-cyan-500 to-blue-600"
              delay={0.1}
            />
            <StatCard
              title="Users Donation"
              label="From Active Members"
              value={formatCurrency(stats.donations.userDonation)}
              icon={HandHeart}
              color="bg-gradient-to-tr from-purple-500 to-pink-600"
              delay={0.2}
            />
            <StatCard
              title="Visitor Donation"
              label="Via Donation Page"
              value={formatCurrency(stats.donations.visitorDonation)}
              icon={HandHeart}
              color="bg-gradient-to-tr from-teal-400 to-cyan-500"
              delay={0.3}
            />
            <StatCard
              title="Cash Donation"
              label="Added by Admin"
              value={formatCurrency(stats.donations.cashDonation)}
              icon={Banknote}
              color="bg-gradient-to-tr from-orange-500 to-red-600"
              delay={0.4}
            />
          </div>
        </div>

        <div>
          <SectionTitle text="Receipts" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Membership Receipts"
              value={stats.receipts.membership}
              icon={Receipt}
              color="bg-gradient-to-tr from-cyan-500 to-blue-600"
              delay={0.1}
            />
            <StatCard
              title="User Donation Receipts"
              value={stats.receipts.userDonation}
              icon={Receipt}
              color="bg-gradient-to-tr from-purple-500 to-pink-600"
              delay={0.2}
            />
            <StatCard
              title="Visitor Donation Receipts"
              value={stats.receipts.visitor}
              icon={Receipt}
              color="bg-gradient-to-tr from-teal-400 to-cyan-500"
              delay={0.3}
            />
            <StatCard
              title="Cash Donation Receipts"
              value={stats.receipts.cash}
              icon={Receipt}
              color="bg-gradient-to-tr from-orange-500 to-red-600"
              delay={0.4}
            />
          </div>
        </div>

        <div>
          <SectionTitle text="Managers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Managers"
              label="Active & Blocked"
              value={stats.managers.total}
              icon={Users}
              color="bg-gradient-to-tr from-cyan-500 to-blue-600"
              delay={0.1}
            />
            <StatCard
              title="Blocked Managers"
              value={stats.managers.blocked}
              icon={UserX}
              color="bg-gradient-to-tr from-purple-500 to-pink-600"
              delay={0.2}
            />
            <StatCard
              title="Visitor Certificates"
              label="(Placeholder)"
              value={0}
              icon={Award}
              color="bg-gradient-to-tr from-teal-400 to-cyan-500"
              delay={0.3}
            />
            <StatCard
              title="User Certificates"
              label="(Placeholder)"
              value={0}
              icon={Award}
              color="bg-gradient-to-tr from-orange-500 to-red-600"
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
