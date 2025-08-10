"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  VisitorDonation,
  fetchAllVisitorDonations,
  deleteVisitorDonation,
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";
import { Trash2 } from "lucide-react";

const StatusBadge = ({ status }: { status: VisitorDonation["status"] }) => {
  const styles = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
};

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    donations,
    listStatus,
    status: actionStatus,
  } = useSelector((state: RootState) => state.visitorDonation);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";

  useEffect(() => {
    dispatch(fetchAllVisitorDonations());
  }, [dispatch]);

  const handleDelete = (donationId: string) => {
    if (confirm("Are you sure?")) {
      dispatch(deleteVisitorDonation(donationId));
    }
  };

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: VisitorDonation, i: number) => i + 1,
    },
    { key: "receiptNo", label: "Receipt No" },
    {
      key: "details",
      label: "Name / Email / Mobile",
      render: (row: VisitorDonation) => (
        <div>
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-gray-500">
            {row.email || "N/A"} / {row.mobile}
          </p>
        </div>
      ),
    },
    { key: "transactionId", label: "Transaction Id" },
    {
      key: "status",
      label: "Status",
      render: (row: VisitorDonation) => <StatusBadge status={row.status} />,
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: VisitorDonation) => `₹${row.amount}`,
    },
    { key: "paymentMode", label: "Payment Mode", render: () => "Online" },
    {
      key: "detailsBtn",
      label: "Details",
      render: () => (
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-500"
        >
          View
        </Button>
      ),
    },
    {
      key: "download",
      label: "Download",
      render: () => (
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
          Download
        </Button>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: VisitorDonation) => (
        <>
          {userIsAdmin && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(row._id)}
              disabled={actionStatus === "loading"}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <DataTable
      title="All Visitor Donation"
      columns={columns}
      data={donations || []}
      totalEntries={donations?.length || 0}
      isLoading={listStatus === "loading"}
    />
  );
}
