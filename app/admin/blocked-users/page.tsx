// File: components/pages/BlockedUsersPage.tsx

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  Member,
  fetchBlockedMembers,
  deleteMember,
  changeMemberStatusByAdmin,
} from "@/lib/redux/features/members/membersSlice";

const MemberDetailsCell = ({ member }: { member: Member }) => (
  <div className="text-left text-sm">
    <p className="font-semibold">{member.registrationNo || "N/A"}</p>
    <p className="text-gray-600">
      {member.fullName} / {member.email} / {member.phone}
    </p>
  </div>
);

export default function BlockedUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { blockedMembers, blockedMembersPagination, listStatus, actionStatus } =
    useSelector((state: RootState) => state.members);

  useEffect(() => {
    dispatch(fetchBlockedMembers({ page: blockedMembersPagination.page }));
  }, [dispatch, blockedMembersPagination.page]);

  const handleUnblock = (memberId: string) => {
    if (confirm("Are you sure you want to unblock this member?")) {
      dispatch(changeMemberStatusByAdmin({ memberId, status: "Active" }));
    }
  };

  const handleDelete = (memberId: string) => {
    if (confirm("Are you sure you want to permanently delete this member?")) {
      dispatch(deleteMember(memberId));
    }
  };

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: Member, index: number) =>
        (blockedMembersPagination.page - 1) * blockedMembersPagination.limit +
        index +
        1,
    },
    {
      key: "details",
      label: "Reg. No / Name / Email / Mobile",
      render: (row: Member) => <MemberDetailsCell member={row} />,
    },
    {
      key: "blockingDate",
      label: "Blocking Date",
      render: (row: Member) =>
        row.blockedAt ? format(new Date(row.blockedAt), "dd-MM-yyyy") : "N/A",
    },
    {
      key: "view",
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
      render: () => <Badge variant="destructive">Blocked</Badge>,
    },
    {
      key: "reason",
      label: "Reason",
      render: (row: Member) => (
        <p className="text-xs">{row.adminNotes || "No reason provided"}</p>
      ),
    },
    {
      key: "blockBy",
      label: "Block By",
      render: (row: Member) => (
        <p className="text-xs">
          {/* This is now robust and checks multiple properties */}
          {row.blockedBy?.fullName || (row.blockedBy as any)?.name || "Admin"}
        </p>
      ),
    },
    {
      key: "action1",
      label: "Action",
      render: (row: Member) => (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => handleUnblock(row._id)}
          disabled={actionStatus === "loading"}
        >
          Unblock
        </Button>
      ),
    },
    {
      key: "action2",
      label: "Action",
      render: (row: Member) => (
        <Button
          size="icon"
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={() => handleDelete(row._id)}
          disabled={actionStatus === "loading"}
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      title="All Blocked User Data"
      columns={columns}
      data={blockedMembers}
      totalEntries={blockedMembersPagination.total}
      isLoading={listStatus === "loading"}
    />
  );
}
