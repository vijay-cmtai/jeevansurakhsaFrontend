"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Download } from "lucide-react";
import {
  VisitorDonation,
  fetchAllVisitorDonations,
  deleteVisitorDonation,
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StatusBadge = ({ status }: { status: VisitorDonation["status"] }) => {
  const styles = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
};

// 🔻🔻🔻 यह फंक्शन बदला गया है 🔻🔻🔻
const generatePdfReceipt = async (donation: VisitorDonation) => {
  const doc = new jsPDF();

  const imageResponse = await fetch("/logo.jpg");
  const imageBlob = await imageResponse.blob();
  const imageBase64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });

  doc.addImage(imageBase64, "JPEG", 85, 15, 40, 40);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Jeevan Suraksha", 105, 65, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "A Social Security Collective, An Initiative of Health Guard Foundation.",
    105,
    72,
    { align: "center" }
  );

  autoTable(doc, {
    startY: 85,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Receipt No:", donation.receiptNo || "N/A"],
      [
        "Date of Donation:",
        format(new Date(donation.createdAt), "dd MMM, yyyy"),
      ],
      ["Type:", "Visitor Donation"],
      ["Donor Name:", donation.name],
      ["Donor Email:", donation.email || "N/A"],
      ["Donor Mobile:", donation.mobile],
      ["Transaction ID:", donation.transactionId],
      ["Donation Amount:", `₹ ${donation.amount.toFixed(2)}`],
      ["Payment Status:", donation.status],
      ["PAN Number:", donation.panNumber || "N/A"],
    ],
    headStyles: { fillColor: [45, 55, 72] },
    styles: { cellPadding: 2.5, fontSize: 10 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(10);
  doc.text(
    "This is a computer-generated receipt and does not require a signature.",
    105,
    finalY + 15,
    {
      align: "center",
    }
  );

  doc.save(
    `Visitor-Donation-Receipt-${donation.receiptNo || donation._id}.pdf`
  );
};
// 🔺🔺🔺 बदलाव यहाँ समाप्त होता है 🔺🔺🔺

export default function AllVisitorDonationPage() {
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
    if (confirm("Are you sure you want to delete this donation record?")) {
      dispatch(deleteVisitorDonation(donationId));
    }
  };

  const columns = [
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
      render: (row: VisitorDonation) => `₹${row.amount.toFixed(2)}`,
    },
    { key: "paymentMode", label: "Payment Mode", render: () => "Online" },
    {
      key: "download",
      label: "Download",
      render: (row: VisitorDonation) => (
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => generatePdfReceipt(row)}
          disabled={row.status !== "SUCCESS"}
        >
          <Download className="mr-2 h-4 w-4" />
          Receipt
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
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </>
      ),
    },
  ];

  const totalAmount = donations.reduce(
    (sum, donation) =>
      donation.status === "SUCCESS" ? sum + donation.amount : sum,
    0
  );

  return (
    <DataTable
      title="All Visitor Donations"
      columns={columns}
      data={donations || []}
      totalEntries={donations?.length || 0}
      isLoading={listStatus === "loading"}
      totalLabel="Total Successful Donation"
      totalValue={totalAmount}
    />
  );
}
