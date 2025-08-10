"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Download, Eye, Loader2 } from "lucide-react";
import {
  VisitorDonation,
  fetchAllVisitorDonations,
  deleteVisitorDonation,
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";

const StatusBadge = ({ status }: { status: VisitorDonation["status"] }) => {
  const styles = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
};

export default function AllVisitorDonationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    donations,
    listStatus,
    status: actionStatus,
  } = useSelector((state: RootState) => state.visitorDonation);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userIsAdmin = userInfo?.role === "Admin";
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllVisitorDonations());
  }, [dispatch]);

  const handleDelete = (donationId: string) => {
    if (confirm("Are you sure you want to delete this donation record?")) {
      dispatch(deleteVisitorDonation(donationId));
    }
  };

  const handleDownload = (donation: VisitorDonation) => {
    alert("Download functionality needs a dedicated thunk in the slice.");
  };

  const handleView = (donation: VisitorDonation) => {
    alert(
      "View functionality needs a modal and a 'selectDonation' action in the slice."
    );
  };

  const columns = [
    {
      key: "select",
      label: <>{userIsAdmin && <Checkbox />}</>,
      render: () => <>{userIsAdmin && <Checkbox />}</>,
    },
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: VisitorDonation, i: number) => i + 1,
    },
    {
      key: "receiptNo",
      label: "Receipt No",
      render: (row: VisitorDonation) => row.receiptNo || "N/A",
    },
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
      render: (row: VisitorDonation) => (
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-500"
          onClick={() => handleView(row)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
    {
      key: "download",
      label: "Download",
      render: (row: VisitorDonation) => {
        const isDownloading = downloadingId === row._id;
        return (
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleDownload(row)}
            disabled={isDownloading || row.status !== "SUCCESS"}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        );
      },
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
              <Trash2 className="h-4 w-4" />
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
