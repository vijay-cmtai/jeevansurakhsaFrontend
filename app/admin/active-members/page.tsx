"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit } from "lucide-react";
import {
  Member,
  fetchActiveMembers,
  deleteMember,
  changeMemberStatusByAdmin,
  toggleSelection,
  toggleSelectAll,
} from "@/lib/redux/features/members/membersSlice";

const MemberDetailsCell = ({ member }: { member: Member }) => (
  <div className="text-left text-sm">
    <span className="font-semibold">{member.registrationNo || "N/A"}</span>
    <span className="text-gray-600"> / {member.fullName}</span>
    <span className="text-gray-600"> / {member.email}</span>
    <span className="text-gray-600"> / {member.phone}</span>
  </div>
);

export default function ActiveMembersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    activeMembers,
    activeMembersPagination,
    listStatus,
    actionStatus,
    selectedIds,
  } = useSelector((state: RootState) => state.members);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";

  useEffect(() => {
    dispatch(fetchActiveMembers({}));
  }, [dispatch]);

  const handleBlock = (memberId: string) => {
    const reason = prompt("Please enter the reason for blocking this member:");
    if (reason !== null) {
      dispatch(
        changeMemberStatusByAdmin({
          memberId,
          status: "Blocked",
          notes: reason,
        })
      );
    }
  };

  const handleDeactivate = (memberId: string) => {
    if (confirm("Are you sure you want to deactivate this member?")) {
      dispatch(changeMemberStatusByAdmin({ memberId, status: "Inactive" }));
    }
  };

  const handleDelete = (memberId: string) => {
    if (confirm("Are you sure you want to permanently delete this member?")) {
      dispatch(deleteMember(memberId));
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const columns = [
    {
      key: "select",
      label: (
        <>
          {userIsAdmin && (
            <Checkbox
              onCheckedChange={() => {
                const allIdsOnPage = activeMembers.map((m) => m._id);
                dispatch(toggleSelectAll(allIdsOnPage));
              }}
              checked={
                activeMembers.length > 0 &&
                activeMembers.every((m) => selectedIds.includes(m._id))
              }
            />
          )}
        </>
      ),
      render: (row: Member) => (
        <>
          {userIsAdmin && (
            <Checkbox
              checked={selectedIds.includes(row._id)}
              onCheckedChange={() => dispatch(toggleSelection(row._id))}
            />
          )}
        </>
      ),
    },
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: Member, index: number) =>
        (activeMembersPagination.page - 1) * activeMembersPagination.limit +
        index +
        1,
    },
    {
      key: "details",
      label: "Reg.No / Name / Email / Mobile",
      render: (row: Member) => <MemberDetailsCell member={row} />,
    },
    {
      key: "date",
      label: "Reg. Date",
      render: (row: Member) => format(new Date(row.createdAt), "dd-MM-yyyy"),
    },
    {
      key: "view",
      label: "View",
      render: (row: Member) => (
        <div className="flex gap-1.5">
          <Button
            size="sm"
            onClick={() => handleNavigation(`/admin/members/${row._id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            onClick={() =>
              handleNavigation(`/admin/members/${row._id}/appointment-letter`)
            }
          >
            Appointment Letter
          </Button>
          <Button
            size="sm"
            onClick={() =>
              handleNavigation(`/admin/members/${row._id}/id-card`)
            }
          >
            ID Card
          </Button>
          <Button
            size="sm"
            onClick={() =>
              handleNavigation(`/admin/members/${row._id}/receipt`)
            }
          >
            Receipt
          </Button>
        </div>
      ),
    },
    {
      key: "statusAction",
      label: "Action",
      render: (row: Member) => (
        <>
          {userIsAdmin && (
            <div className="flex gap-1.5">
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 px-2.5"
                onClick={() => handleDeactivate(row._id)}
                disabled={actionStatus === "loading"}
              >
                Deactivate
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 px-3.5"
                onClick={() => handleBlock(row._id)}
                disabled={actionStatus === "loading"}
              >
                Block
              </Button>
            </div>
          )}
        </>
      ),
    },
    {
      key: "editDeleteAction",
      label: "Action",
      render: (row: Member) => (
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleNavigation(`/admin/members/${row._id}/edit`)}
            className="h-8 w-8"
          >
            <Edit size={16} />
          </Button>
          {userIsAdmin && (
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 h-8 w-8"
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

  if (listStatus === "loading") {
    return (
      <DataTable
        title="Active Members Data"
        columns={columns}
        data={[]}
        totalEntries={0}
        isLoading={true}
      />
    );
  }

  return (
    <DataTable
      title="Active Members Data"
      columns={columns}
      data={activeMembers}
      totalEntries={activeMembersPagination.total}
    />
  );
}
