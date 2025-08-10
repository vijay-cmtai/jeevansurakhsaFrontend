// 📁 File: app/admin/users/blocked/page.tsx

"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2, ShieldCheck } from "lucide-react"; // ShieldCheck icon for Unblock
import {
  User, // ✅ Interface ka naam 'Manager' se 'User' karein
  fetchBlockedUsers, // ✅ 'fetchBlockedManagers' se 'fetchBlockedUsers'
  deleteUser, // ✅ 'deleteManager' se 'deleteUser'
  changeUserStatus, // ✅ 'changeManagerStatus' naam theek hai
} from "@/lib/redux/features/users/usersSlice";

export default function BlockedUsersPage() {
  // Component ka naam bhi update karein
  const dispatch = useDispatch<AppDispatch>();

  // ✅✅✅ ERROR FIX YAHAN HAI ✅✅✅
  // state.managers ko state.users se badlein
  const { blockedUsers, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchBlockedUsers()); // ✅ Sahi function call karein
  }, [dispatch]);

  const handleUnblock = (id: string) => {
    if (confirm("Are you sure you want to unblock this user?")) {
      dispatch(changeUserStatus({ id, status: "Active" }));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user permanently?")) {
      dispatch(deleteUser(id)); // ✅ Sahi function call karein
    }
  };

  const columns = [
    { key: "sr", label: "Sr.No.", render: (_: User, i: number) => i + 1 },
    {
      key: "details",
      label: "Name / Email / Role",
      render: (row: User) => (
        <div>
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              row.role === "Admin"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {row.role}
          </span>
        </div>
      ),
    },
    {
      key: "blockedDate",
      label: "Blocked Date",
      render: (row: User) =>
        row.blockedAt ? format(new Date(row.blockedAt), "dd-MM-yyyy") : "N/A",
    },
    {
      key: "action",
      label: "Actions",
      render: (row: User) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleUnblock(row._id)}
            disabled={actionStatus === "loading"}
          >
            <ShieldCheck size={14} className="mr-2" />
            Unblock
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-500 hover:bg-red-50"
            onClick={() => handleDelete(row._id)}
            disabled={actionStatus === "loading"}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Blocked Dashboard Users" // Title update karein
      columns={columns}
      data={blockedUsers} // ✅ 'blockedManagers' se 'blockedUsers'
      totalEntries={blockedUsers.length} // ✅ 'blockedManagers' se 'blockedUsers'
      isLoading={listStatus === "loading"}
    />
  );
}
