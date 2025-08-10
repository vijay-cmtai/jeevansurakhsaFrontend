"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ShieldX } from "lucide-react";
import {
  User,
  fetchActiveUsers,
  deleteUser,
  changeUserStatus,
  selectUser,
} from "@/lib/redux/features/users/usersSlice";

export default function ActiveUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { activeUsers, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.users
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";

  useEffect(() => {
    dispatch(fetchActiveUsers());
  }, [dispatch]);

  const handleBlock = (id: string) => {
    if (confirm("Are you sure you want to block this user?")) {
      dispatch(changeUserStatus({ id, status: "Blocked" }));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user permanently?")) {
      dispatch(deleteUser(id));
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
      key: "regDate",
      label: "Reg. Date",
      render: (row: User) =>
        row.createdAt ? format(new Date(row.createdAt), "dd-MM-yyyy") : "N/A",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: User) => (
        <div className="flex items-center gap-1">
          {userIsAdmin && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => handleBlock(row._id)}
              disabled={actionStatus === "loading"}
            >
              <ShieldX size={14} className="mr-2" />
              Block
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              dispatch(selectUser(row));
              router.push(`/admin/users/edit/${row._id}`);
            }}
          >
            <Edit size={16} />
          </Button>
          {userIsAdmin && (
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:bg-red-50"
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
    <DataTable
      title="Active Dashboard Users"
      columns={columns}
      data={activeUsers}
      totalEntries={activeUsers.length}
      isLoading={listStatus === "loading"}
    />
  );
}
