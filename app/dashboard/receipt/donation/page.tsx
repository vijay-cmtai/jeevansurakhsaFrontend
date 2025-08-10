"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMyDonationHistory } from "@/lib/redux/features/payment/memberDonationSlice";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Type definition for our donation data
interface Donation {
  _id: string;
  transactionId: string;
  receiptNo?: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
  member: {
    fullName: string;
    email: string;
  };
}

// Extend jsPDF with autoTable for type safety
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

// Helper function to generate the PDF receipt
const generatePdfReceipt = (donation: Donation) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Donation Receipt", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Jeevan Suraksha Foundation", 105, 30, { align: "center" });

  // Donation Details
  doc.autoTable({
    startY: 40,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Receipt No:", donation.receiptNo || "N/A"],
      [
        "Date of Donation:",
        format(new Date(donation.createdAt), "dd MMM, yyyy"),
      ],
      ["Donor Name:", donation.member.fullName],
      ["Donor Email:", donation.member.email],
      ["Transaction ID:", donation.transactionId],
      // ✅ FIX: Currency symbol ko template literal ke andar rakha
      ["Donation Amount:", `₹ ${donation.amount.toFixed(2)}`],
      ["Payment Status:", donation.status],
    ],
    styles: { fontSize: 11 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(10);
  doc.text(
    "Thank you for your generous contribution. This is a computer-generated receipt.",
    105,
    finalY + 15,
    { align: "center", maxWidth: 180 }
  );

  doc.save(`Donation-Receipt-${donation.receiptNo || donation._id}.pdf`);
};

export default function DonationReceiptPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { history, fetchStatus, error } = useSelector(
    (state: RootState) => state.memberDonation
  );

  useEffect(() => {
    dispatch(fetchMyDonationHistory());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            Success
          </Badge>
        );
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (fetchStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (fetchStatus === "failed") {
    return (
      <div className="text-center p-12 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <AlertCircle className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold">Failed to Load Donations</h3>
        <p className="mt-2 text-sm">
          {(error as string) || "An unknown error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">My Donation History</h1>
      <p className="mt-1 text-gray-600">
        Thank you for your support! Here is a list of your past donations.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-lg border"
      >
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* ✅ FIX: TypeScript ko bataya ki 'history' Donation[] type ka hai */}
                {(history as Donation[]).map((donation) => (
                  <TableRow key={donation._id}>
                    <TableCell>
                      {format(new Date(donation.createdAt), "dd MMM, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {donation.receiptNo || "N/A"}
                    </TableCell>
                    {/* ✅ FIX: Currency symbol ka syntax theek kiya */}
                    <TableCell className="text-right font-semibold">
                      ₹{donation.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generatePdfReceipt(donation)}
                        disabled={donation.status !== "SUCCESS"}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700">
              No Donations Found
            </h3>
            <p className="mt-2 text-gray-500">
              Your donation history will appear here once you make a donation.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
