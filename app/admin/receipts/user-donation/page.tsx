"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable"; // Assuming you have this component
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fetchAllMemberDonations, // ✅ Use the new admin action
} from "@/lib/redux/features/payment/memberDonationSlice";
import { Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Type definition to match the slice
interface Donation {
  _id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  transactionId: string;
  receiptNo?: string;
  createdAt: string;
  member: { fullName: string; email: string; mobile: string; memberId: string };
}

// PDF Generation Helper
const generatePdfReceipt = (donation: Donation) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("Member Donation Receipt", 105, 20, { align: "center" });
  autoTable(doc, {
    startY: 30,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Receipt No:", donation.receiptNo || "N/A"],
      ["Date:", format(new Date(donation.createdAt), "dd MMM, yyyy")],
      ["Member ID:", donation.member.memberId],
      ["Member Name:", donation.member.fullName],
      [
        "Email / Mobile:",
        `${donation.member.email} / ${donation.member.mobile}`,
      ],
      ["Transaction ID:", donation.transactionId],
      ["Amount:", `₹ ${donation.amount.toFixed(2)}`],
      ["Status:", donation.status],
    ],
  });
  doc.save(`Member-Donation-Receipt-${donation.receiptNo || donation._id}.pdf`);
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Donation["status"] }) => {
  const styles = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
};

export default function AllMemberDonationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { allDonations, allDonationsStatus } = useSelector(
    (state: RootState) => state.memberDonation
  );

  useEffect(() => {
    // ✅ Dispatch the new admin-specific action
    dispatch(fetchAllMemberDonations());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      // You would need to create a deleteMemberDonation action if required
      console.log("Delete functionality to be implemented for ID:", id);
    }
  };

  const columns = [
    { key: "sr", label: "Sr.No.", render: (_: Donation, i: number) => i + 1 },
    {
      key: "receiptNo",
      label: "Receipt No",
      render: (row: Donation) => row.receiptNo || "N/A",
    },
    {
      key: "member",
      label: "Member Details",
      render: (row: Donation) => (
        <div>
          <p className="font-semibold">{row.member?.fullName || "N/A"}</p>
          <p className="text-xs text-gray-500">{row.member?.memberId}</p>
          <p className="text-xs text-gray-500">
            {row.member?.email} / {row.member?.mobile}
          </p>
        </div>
      ),
    },
    { key: "transactionId", label: "Transaction ID" },
    {
      key: "status",
      label: "Status",
      render: (row: Donation) => <StatusBadge status={row.status} />,
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: Donation) => `₹${row.amount.toFixed(2)}`,
    },
    {
      key: "download",
      label: "Download",
      render: (row: Donation) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => generatePdfReceipt(row)}
          disabled={row.status !== "SUCCESS"}
        >
          <Download size={16} className="mr-2" />
          Receipt
        </Button>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: Donation) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(row._id)}
          // disabled={actionStatus === "loading"} // You'd need a delete status in your slice
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ];

  // Calculate total amount from the fetched data
  const totalAmount = allDonations.reduce(
    (sum, donation) =>
      donation.status === "SUCCESS" ? sum + donation.amount : sum,
    0
  );

  return (
    <DataTable
      title="All Member Donations"
      columns={columns}
      data={allDonations || []}
      totalEntries={allDonations?.length || 0}
      isLoading={allDonationsStatus === "loading"}
      totalLabel="Total Successful Donation Amount"
      totalValue={totalAmount}
    />
  );
}
