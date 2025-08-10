"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchEligibleMembers } from "@/lib/redux/features/memberCertificates/memberCertificatesSlice";
import { Member } from "@/lib/redux/features/members/membersSlice";

const MemberDetailsCell = ({ member }: { member: Member }) => (
  <div className="text-left text-sm">
    <p className="font-semibold">{member.registrationNo || "N/A"}</p>
    <p>
      {member.fullName} / {member.email} / {member.phone}
    </p>
  </div>
);

export default function GenerateCertificatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { eligibleMembers, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.memberCertificates
  );

  useEffect(() => {
    dispatch(fetchEligibleMembers());
  }, [dispatch]);

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: Member, index: number) => index + 1,
    },
    {
      key: "details",
      label: "Reg. No / Name / Email / Mobile",
      render: (row: Member) => <MemberDetailsCell member={row} />,
    },
    {
      key: "regDate",
      label: "Reg Date",
      render: (row: Member) => format(new Date(row.createdAt), "dd-MM-yyyy"),
    },
    {
      key: "verifyDate",
      label: "Verify Date",
      render: (row: Member) => format(new Date(row.updatedAt), "dd-MM-yyyy"),
    },
    {
      key: "detailsBtn",
      label: "Details",
      render: (row: Member) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/admin/members/${row._id}`)}
        >
          View
        </Button>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Active
        </Badge>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: Member) => (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          // --- UPDATED: Navigate to the new form page ---
          onClick={() => router.push(`/admin/generate-certificate/${row._id}`)}
        >
          Generate
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      title="Generate Certificate"
      columns={columns}
      data={eligibleMembers}
      totalEntries={eligibleMembers.length}
      isLoading={listStatus === "loading"}
    />
  );
}
