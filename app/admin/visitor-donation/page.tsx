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
import { Trash2, Download } from "lucide-react"; // ✅ Import the Download icon
// ✅ Step 1: Import the PDF generation libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// Status Badge Component (No changes needed)
const StatusBadge = ({ status }: { status: VisitorDonation["status"] }) => {
  const styles = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
};

// ✅ Step 2: Create the helper function to generate the PDF receipt
const generatePdfReceipt = (donation: VisitorDonation) => {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
        title: `Receipt - ${donation.receiptNo || donation.transactionId}`,
        subject: 'Visitor Donation Receipt',
        author: 'Jeevan Suraksha Foundation',
    });

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Visitor Donation Receipt", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Jeevan Suraksha Foundation", 105, 30, { align: "center" });

    // Donation Details Table using autoTable
    autoTable(doc, {
        startY: 40,
        theme: "grid",
        head: [['Field', 'Details']],
        body: [
            ['Receipt No:', donation.receiptNo || 'N/A'],
            ['Date of Donation:', format(new Date(donation.createdAt), "dd MMM, yyyy")],
            ['Donor Name:', donation.name],
            ['Donor Email:', donation.email || 'N/A'],
            ['Donor Mobile:', donation.mobile],
            ['Transaction ID:', donation.transactionId],
            ['Donation Amount:', `₹ ${donation.amount.toFixed(2)}`],
            ['Payment Status:', donation.status],
            ['PAN Number:', donation.panNumber || 'N/A'],
        ],
        styles: { fontSize: 11, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    });

    // Footer Text
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(10);
    doc.text("Thank you for your generous contribution.", 105, finalY + 15, { align: "center" });
    doc.text("This is a computer-generated receipt and does not require a signature.", 105, finalY + 22, { align: "center" });

    // Save the PDF
    doc.save(`Visitor-Donation-Receipt-${donation.receiptNo || donation._id}.pdf`);
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
    { key: "receiptNo", label: "Receipt No", render: (row: VisitorDonation) => row.receiptNo || 'N/A' },
    {
      key: "details",
      label: "Name / Email / Mobile",
      render: (row: VisitorDonation) => (
        <div>
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email || "N/A"} / {row.mobile}</p>
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
      key: "detailsBtn",
      label: "Details",
      render: () => (
        <Button size="sm" variant="outline" className="text-green-600 border-green-500">
          View
        </Button>
      ),
    },
    {
      key: "download",
      label: "Download",
      // ✅ Step 3: Update the render function for the download button
      render: (row: VisitorDonation) => (
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
          // Call the generatePdfReceipt function on click
          onClick={() => generatePdfReceipt(row)}
          // Disable the button if the donation was not successful
          disabled={row.status !== "SUCCESS"}
        >
          <Download size={16} />
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
              <Trash2 size={16} />
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
