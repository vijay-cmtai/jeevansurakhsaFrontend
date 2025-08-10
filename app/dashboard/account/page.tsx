"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getMemberProfile } from "@/lib/redux/features/auth/authSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { format, isValid } from "date-fns";
import Link from "next/link";
import { Nominee } from "@/lib/redux/features/members/membersSlice";

// --- Reusable UI Components to Match the New Design ---
const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-[#2d3748] text-white text-center py-2.5 rounded-t-md mt-4 first:mt-0">
    <h3 className="font-semibold text-lg">{title}</h3>
  </div>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right break-all">
      {value || "N/A"}
    </span>
  </div>
);

const DetailContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-b-md border border-t-0 border-gray-200">
    {children}
  </div>
);

const NomineeCard = ({
  nominee,
  index,
}: {
  nominee: Nominee;
  index: number;
}) => (
  <div>
    <h4 className="font-semibold text-gray-600 mb-2 pl-1">Nominee {index}</h4>
    <div className="bg-white rounded-lg border border-gray-200">
      <DetailRow label="Name" value={nominee.name} />
      <DetailRow label="Relation" value={nominee.relation} />
      <DetailRow label="Age" value={String(nominee.age)} />
      <DetailRow label="Gender" value={nominee.gender} />
      <DetailRow label="Percentage" value={`${nominee.percentage}%`} />
    </div>
  </div>
);

// --- Main Page Component ---
export default function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, status, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // If userInfo is missing OR if it's incomplete (e.g., missing address details),
    // fetch the full, fresh profile from the server.
    if (!userInfo || !userInfo.address) {
      dispatch(getMemberProfile());
    }
  }, [dispatch, userInfo]);

  const formattedDob =
    userInfo?.dateOfBirth && isValid(new Date(userInfo.dateOfBirth))
      ? format(new Date(userInfo.dateOfBirth), "dd-MM-yyyy")
      : "N/A";

  if (status === "loading" || !userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 bg-red-50 p-4 text-center">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Could not load your profile.</p>
        <p className="text-sm">{error || "Please try logging in again."}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="text-center mb-4">
          <Image
            src={
              userInfo.profileImageUrl ||
              "https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
            }
            alt="Profile Picture"
            width={60}
            height={60}
            className="rounded-full mx-auto p-1 bg-white border object-cover"
          />
        </div>

        <SectionHeader title="Profile Details" />

        <div>
          <SectionHeader title="State Information" />
          <DetailContainer>
            <DetailRow label="State:" value={userInfo.state} />
            <DetailRow label="District:" value={userInfo.district} />
          </DetailContainer>
        </div>

        <div>
          <SectionHeader title="Date of Birth" />
          <DetailContainer>
            <DetailRow label="Date Of Birth" value={formattedDob} />
          </DetailContainer>
        </div>

        <div>
          <SectionHeader title="Personal Details" />
          <DetailContainer>
            <DetailRow label="Full Name" value={userInfo.fullName} />
            <DetailRow label="Mobile" value={userInfo.phone} />
            <DetailRow label="Email" value={userInfo.email} />
            <DetailRow label="PAN Number" value={userInfo.panNumber} />
          </DetailContainer>
        </div>

        <div>
          <SectionHeader title="Address Details" />
          <DetailContainer>
            <DetailRow
              label="House Number"
              value={userInfo.address?.houseNumber}
            />
            <DetailRow label="Street" value={userInfo.address?.street} />
            <DetailRow
              label="City/Village"
              value={userInfo.address?.cityVillage}
            />
            <DetailRow label="Pincode" value={userInfo.address?.pincode} />
          </DetailContainer>
        </div>

        <div>
          <SectionHeader title="Employment Details" />
          <DetailContainer>
            <DetailRow
              label="Employment Type"
              value={userInfo.employment?.type}
            />
            <DetailRow
              label="Department"
              value={userInfo.employment?.department}
            />
            <DetailRow
              label="Company Name"
              value={userInfo.employment?.companyName}
            />
            <DetailRow
              label="Contribution Plan"
              value={userInfo.employment?.contributionPlan}
            />
          </DetailContainer>
        </div>

        {userInfo.nominees && userInfo.nominees.length > 0 && (
          <div>
            <SectionHeader title="Nominee Details" />
            <div className="p-4 bg-gray-50 rounded-b-md border border-t-0 border-gray-200 space-y-4">
              {userInfo.nominees.map((nominee, index) => (
                <NomineeCard key={index} nominee={nominee} index={index + 1} />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6 mt-6 border-t">
          <Button variant="outline" className="w-full h-11" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/dashboard/profile">Edit Profile</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
