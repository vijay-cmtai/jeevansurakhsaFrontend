"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchReceipts,
  deleteReceipt,
  Receipt,
} from "@/lib/redux/features/receipts/receiptsSlice";
import { Trash2 } from "lucide-react";

export default function UserDonationReceiptsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { receipts, totalAmount, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.receipts
  );

  useEffect(() => {
    dispatch(fetchReceipts({ type: "MEMBER_DONATION" }));
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this receipt?")) {
      dispatch(deleteReceipt(id));
    }
  };

  const handleDownload = (receiptId: string) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"}/api/receipts/${receiptId}/download`;
    window.open(url, "_blank");
  };

  const columns = [
    { key: "select", label: <Checkbox />, render: () => <Checkbox /> },
    { key: "sr", label: "Sr.No.", render: (_: Receipt, i: number) => i + 1 },
    { key: "receiptNo", label: "Receipt No" },
    {
      key: "memberId",
      label: "Member Id",
      render: (row: Receipt) => row.user?.memberId || "N/A",
    },
    {
      key: "name",
      label: "Name / Email / Mobile",
      render: (row: Receipt) => (
        <div>
          <p>{row.user?.name}</p>
          <p className="text-xs text-gray-500">
            {row.user?.email} / {row.user?.mobile}
          </p>
        </div>
      ),
    },
    { key: "transactionId", label: "Transaction Id" },
    {
      key: "amount",
      label: "Amount",
      render: (row: Receipt) => `₹${row.amount}`,
    },
    { key: "paymentMode", label: "Mode" },
    {
      key: "details",
      label: "Details",
      render: () => <Button size="sm">View</Button>,
    },
    {
      key: "download",
      label: "Download",
      render: (row: Receipt) => (
        <Button size="sm" onClick={() => handleDownload(row._id)}>
          Download
        </Button>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: Receipt) => (
        <Button
          size="sm"
          variant="destructive"
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
      title="Active Users Donation Receipts"
      columns={columns}
      data={receipts}
      totalEntries={receipts.length}
      isLoading={listStatus === "loading"}
      totalLabel="Total Donation"
      totalValue={totalAmount}
    />
  );
}
