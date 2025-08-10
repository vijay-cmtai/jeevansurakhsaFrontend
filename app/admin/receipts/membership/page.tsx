"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchReceipts,
  deleteReceipt,
  Receipt,
} from "@/lib/redux/features/receipts/receiptsSlice";

export default function MembershipReceiptsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { receipts, totalAmount, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.receipts
  );

  useEffect(() => {
    dispatch(fetchReceipts({ type: "MEMBERSHIP_FEE" }));
  }, [dispatch]);

  const handleDownload = (receiptId: string) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"}/api/receipts/${receiptId}/download`;
    window.open(url, "_blank");
  };

  const columns = [
    { key: "select", label: <Checkbox />, render: () => <Checkbox /> },
    { key: "sr", label: "Sr.No.", render: (_: Receipt, i: number) => i + 1 },
    {
      key: "memberName",
      label: "Member Name",
      render: (row: Receipt) => row.user?.name || "N/A",
    },
    {
      key: "memberId",
      label: "Member Id",
      render: (row: Receipt) => row.user?.memberId || "N/A",
    },
    { key: "receiptNo", label: "Receipt No." },
    {
      key: "amount",
      label: "Amount",
      render: (row: Receipt) => `₹${row.amount}`,
    },
    { key: "transactionId", label: "Transaction Id" },
    { key: "paymentMode", label: "Payment Mode" },
    {
      key: "date",
      label: "Date",
      render: (row: Receipt) => format(new Date(row.createdAt), "dd-MM-yyyy"),
    },
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
          Download Now
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      title="Membership Payment Receipt"
      columns={columns}
      data={receipts}
      totalEntries={receipts.length}
      isLoading={listStatus === "loading"}
      totalLabel="Total Member Fee"
      totalValue={totalAmount}
    />
  );
}
