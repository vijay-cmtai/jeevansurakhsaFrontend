"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMemberById } from "@/lib/redux/features/members/membersSlice";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Shield icon yahan se hata diya gaya hai

// Helper component to display a row of data
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="flex justify-between border-b px-4 py-2 text-sm">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

// Main component
export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const memberId = params.memberId as string;

  const {
    selectedMember: member,
    listStatus,
    listError,
  } = useSelector((state: RootState) => state.members);

  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberById(memberId));
    }
  }, [dispatch, memberId]);

  if (listStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (listStatus === "failed" || !member) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{listError || "Member not found."}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 p-4 text-center border-b">
          {/* Shield icon ko Image component se replace kar diya gaya hai */}
          <Image
            src="/logo.jpg" // Path to your logo in the public folder
            alt="Logo"
            width={64} // Corresponds to h-16
            height={64} // Corresponds to w-16
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">Profile Details</h1>
        </div>

        {/* Sections */}
        <div className="p-6 space-y-6">
          <Section title="State Information">
            <DetailRow label="State" value={member.state} />
            <DetailRow label="District" value={member.district} />
          </Section>

          <Section title="Date of Birth">
            <DetailRow
              label="Date of Birth"
              value={format(new Date(member.dateOfBirth), "dd-MM-yyyy")}
            />
          </Section>

          <Section title="Personal Details">
            <DetailRow label="Full Name" value={member.fullName} />
            <DetailRow label="Mobile" value={member.phone} />
            <DetailRow label="Email" value={member.email} />
            <DetailRow label="PAN Number" value={member.panNumber} />
            <ImageDisplay label="PAN Card Photo" src={member.panImageUrl} />
            <ImageDisplay label="User Profile" src={member.profileImageUrl} />
          </Section>

          <Section title="Address Details">
            <DetailRow
              label="House Number"
              value={member.address?.houseNumber}
            />
            <DetailRow label="Street" value={member.address?.street} />
            <DetailRow
              label="City/Village"
              value={member.address?.cityVillage}
            />
            <DetailRow label="Pincode" value={member.address?.pincode} />
          </Section>

          <Section title="Employment Details">
            <DetailRow
              label="Employment Type"
              value={member.employment?.type}
            />
            <DetailRow
              label="Department"
              value={member.employment?.department}
            />
            <DetailRow
              label="Company Name"
              value={member.employment?.companyName}
            />
            <DetailRow
              label="Contribution Plan"
              value={member.employment?.contributionPlan}
            />
          </Section>

          <Section title="Nominee Details">
            {member.nominees?.map((nominee, index) => (
              <div
                key={index}
                className="border p-3 rounded-md bg-gray-50 mb-2"
              >
                <p className="font-bold">
                  Nominee #{index + 1}: {nominee.name}
                </p>
                <div className="grid grid-cols-2 text-xs mt-1">
                  <p>
                    <strong>Relation:</strong> {nominee.relation}
                  </p>
                  <p>
                    <strong>Gender:</strong> {nominee.gender}
                  </p>
                  <p>
                    <strong>Age:</strong> {nominee.age}
                  </p>
                  <p>
                    <strong>Share:</strong> {nominee.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </Section>

          <div className="flex gap-4 pt-6">
            <Button
              className="w-full"
              onClick={() => router.push("/admin/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for structure
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="bg-gray-700 text-white font-bold text-center py-2 rounded-t-md">
      {title}
    </h2>
    <div className="border border-t-0 rounded-b-md">{children}</div>
  </div>
);

const ImageDisplay = ({
  label,
  src,
}: {
  label: string;
  src: string | undefined;
}) => (
  <div className="flex justify-between border-b px-4 py-2 items-center">
    <span className="font-semibold text-gray-600">{label}:</span>
    {src ? (
      <Image
        src={src}
        alt={label}
        width={80}
        height={80}
        className="object-contain border rounded-md"
      />
    ) : (
      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500 border rounded-md">
        No Image
      </div>
    )}
  </div>
);
