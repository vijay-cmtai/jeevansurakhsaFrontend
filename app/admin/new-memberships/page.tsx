"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation"; // <-- Step 1: useRouter ko import karein
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  Member,
  fetchNewMembers,
  verifyMember,
  deleteMember,
} from "@/lib/redux/features/members/membersSlice";

// Ek chhota helper component, taaki member ki jaankari saaf-suthre tareeke se dikhe
const MemberDetailsCell = ({ member }: { member: Member }) => (
  <div className="text-left">
    <p className="font-semibold">{member.fullName}</p>
    <p className="text-sm text-gray-500">
      Reg No: {member.registrationNo || "N/A"}
    </p>
    <p className="text-sm text-gray-500">{member.email}</p>
    <p className="text-sm text-gray-500">{member.phone}</p>
  </div>
);

export default function NewMembershipsPage() {
  // Redux aur Routing hooks ko initialize karein
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // <-- Step 2: useRouter ko initialize karein

  // Redux store se zaroori data nikalein
  const { newMembers, newMembersPagination, listStatus, actionStatus } =
    useSelector((state: RootState) => state.members);

  // Jab component pehli baar load ho, to backend se data fetch karein
  useEffect(() => {
    dispatch(fetchNewMembers({}));
  }, [dispatch]);

  // Frontend par data filter karein taaki sirf 'Pending' payment waale members dikhein
  const pendingPaymentMembers = (newMembers || []).filter(
    (member) => member.paymentStatus === "Pending"
  );

  // Member ko approve karne ka function
  const handleApprove = (memberId: string) => {
    if (
      confirm(
        "Are you sure you want to approve this member? Their status will become 'Active'."
      )
    ) {
      dispatch(verifyMember(memberId));
    }
  };

  // Member request ko reject (delete) karne ka function
  const handleReject = (memberId: string) => {
    if (
      confirm(
        "Are you sure you want to reject and delete this membership request? This action cannot be undone."
      )
    ) {
      dispatch(deleteMember(memberId));
    }
  };

  // DataTable ke liye columns define karein
  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: Member, index: number) =>
        (newMembersPagination.page - 1) * newMembersPagination.limit +
        index +
        1,
    },
    {
      key: "details",
      label: "Name / Reg. No / Email / Mobile",
      render: (row: Member) => <MemberDetailsCell member={row} />,
    },
    {
      key: "date",
      label: "Reg. Date",
      render: (row: Member) => format(new Date(row.createdAt), "dd-MM-yyyy"),
    },
    {
      key: "fee",
      label: "Fee",
      render: (row: Member) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.paymentStatus === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      key: "detailsBtn",
      label: "Details",
      render: (row: Member) => (
        <Button
          size="sm"
          variant="outline"
          // --- Step 3: onClick handler ko update karein ---
          onClick={() => router.push(`/admin/members/${row._id}`)}
        >
          View
        </Button>
      ),
    },
    {
      key: "action1",
      label: "Action",
      render: (row: Member) => (
        <Button
          size="sm"
          onClick={() => handleApprove(row._id)}
          disabled={actionStatus === "loading"}
        >
          {actionStatus === "loading" ? "Processing..." : "Approve"}
        </Button>
      ),
    },
    {
      key: "action2",
      label: "Action",
      render: (row: Member) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleReject(row._id)}
          disabled={actionStatus === "loading"}
        >
          {actionStatus === "loading" ? "Processing..." : "Reject"}
        </Button>
      ),
    },
  ];

  // Jab data fetch ho raha ho to loading state dikhayein
  if (listStatus === "loading") {
    return (
      <DataTable
        title="New Membership Request Data"
        columns={columns}
        data={[]}
        totalEntries={0}
        // isLoading={true}
      />
    );
  }

  return (
    <DataTable
      title="New Membership Request Data"
      columns={columns}
      data={pendingPaymentMembers}
      totalEntries={pendingPaymentMembers.length}
    />
  );
}
