// 📁 File: app/admin/all-users/page.tsx (or similar path)

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import {
  Member,
  fetchAllMembers,
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

const StatusBadge = ({ status }: { status: Member["membershipStatus"] }) => {
  const statusStyles = {
    Active: "bg-green-100 text-green-800",
    Blocked: "bg-red-100 text-red-800",
    Inactive: "bg-yellow-100 text-yellow-800",
    Pending: "bg-blue-100 text-blue-800",
  };
  return (
    <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>
      {status}
    </Badge>
  );
};

export default function AllUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState("");

  const { allMembers, allMembersPagination, listStatus, actionStatus } =
    useSelector((state: RootState) => state.members);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";

  useEffect(() => {
    dispatch(fetchAllMembers({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleBlock = (memberId: string, currentStatus: string) => {
    if (currentStatus === "Blocked") {
      if (confirm("Are you sure you want to unblock this member?")) {
        dispatch(changeMemberStatusByAdmin({ memberId, status: "Active" }));
      }
    } else {
      const reason = prompt(
        "Please enter the reason for blocking this member:"
      );
      if (reason !== null) {
        dispatch(
          changeMemberStatusByAdmin({
            memberId,
            status: "Blocked",
            notes: reason,
          })
        );
      }
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
        (allMembersPagination.page - 1) * allMembersPagination.limit +
        index +
        1,
    },
    {
      key: "details",
      label: "Reg. No / Name / Email / Mobile",
      render: (row: Member) => <MemberDetailsCell member={row} />,
    },
    {
      key: "regDate",
      label: "Reg. Date",
      render: (row: Member) => format(new Date(row.createdAt), "dd-MM-yyyy"),
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
      render: (row: Member) => <StatusBadge status={row.membershipStatus} />,
    },
    {
      key: "actionA",
      label: "Action A",
      render: (row: Member) => (
        <Button
          size="sm"
          className={
            row.membershipStatus === "Blocked"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }
          onClick={() => handleBlock(row._id, row.membershipStatus)}
          disabled={actionStatus === "loading"}
        >
          {row.membershipStatus === "Blocked" ? "Unblock" : "Block Now"}
        </Button>
      ),
    },
    {
      key: "actionB",
      label: "Action B",
      render: (row: Member) => (
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.push(`/admin/members/${row._id}/edit`)}
          >
            <Edit size={16} />
          </Button>
          {userIsAdmin && (
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500"
              onClick={() => handleDelete(row._id)}
              disabled={actionStatus === "loading"}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-4 bg-white border-b flex items-center gap-4">
        <h3 className="font-semibold text-gray-700">Filter by Status:</h3>
        <Button
          variant={statusFilter === "Active" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Active")}
        >
          Active
        </Button>
        <Button
          variant={statusFilter === "Blocked" ? "destructive" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Blocked")}
        >
          Blocked
        </Button>
        <Button
          variant={statusFilter === "Inactive" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Inactive")}
        >
          Inactive
        </Button>
        <Button
          variant={statusFilter === "Pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("Pending")}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("")}
        >
          Show All
        </Button>
      </div>
      <DataTable
        title="All User Data"
        columns={columns}
        data={allMembers}
        totalEntries={allMembersPagination.total}
        isLoading={listStatus === "loading"}
      />
    </>
  );
}
