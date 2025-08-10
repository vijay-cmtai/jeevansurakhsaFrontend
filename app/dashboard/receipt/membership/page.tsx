"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
// ✅ Import the correct MEMBER action and type from your slice
import {
  fetchMyReceipts,
  Receipt,
} from "@/lib/redux/features/receipts/receiptsSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Reusable Type Badge component
const TypeBadge = ({ type }: { type: Receipt["receiptType"] }) => {
  const styles = {
    REGISTRATION: "bg-blue-100 text-blue-800",
    MEMBER_DONATION: "bg-purple-100 text-purple-800",
  };
  return (
    <Badge className={styles[type] || "bg-gray-100"}>
      {type.replace("_", " ")}
    </Badge>
  );
};

// Helper function to generate PDF receipt
const generatePdfReceipt = (receipt: Receipt, userInfo: any) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Receipt", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("Jeevan Suraksha Foundation", 105, 30, { align: "center" });

  autoTable(doc, {
    startY: 40,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Receipt No:", receipt.receiptNo],
      ["Date:", format(new Date(receipt.createdAt), "dd MMM, yyyy")],
      ["Member Name:", userInfo?.fullName || "N/A"],
      ["Registration No:", userInfo?.registrationNo || "N/A"],
      ["Receipt Type:", receipt.receiptType.replace("_", " ")],
      ["Amount Paid:", `₹ ${receipt.amount.toFixed(2)}`],
    ],
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(10);
  doc.text("This is a computer-generated receipt.", 105, finalY + 15, {
    align: "center",
  });

  doc.save(`Receipt-${receipt.receiptNo}.pdf`);
};

export default function MyReceiptsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Select the correct state properties for the member page
  const { myReceipts, myReceiptsStatus, error } = useSelector(
    (state: RootState) => state.receipts
  );
  // Get user info to display in the PDF
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // ✅ Dispatch the member-specific action to fetch their own receipts
    dispatch(fetchMyReceipts());
  }, [dispatch]);

  if (myReceiptsStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (myReceiptsStatus === "failed") {
    return (
      <div className="text-center p-12 bg-red-50 text-red-700 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold">Error</h3>
        <p className="mt-2 text-sm">
          {error || "Failed to load your receipts."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Receipts</h1>
          <p className="mt-1 text-gray-600">
            Here is a list of all your generated receipts.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => dispatch(fetchMyReceipts())}
          disabled={myReceiptsStatus === "loading"}
        >
          <RefreshCw
            className={`h-4 w-4 ${myReceiptsStatus === "loading" ? "animate-spin" : "mr-2"}`}
          />
          {myReceiptsStatus !== "loading" && "Refresh"}
        </Button>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myReceipts && myReceipts.length > 0 ? (
              myReceipts.map((receipt) => (
                <TableRow key={receipt._id}>
                  <TableCell className="font-medium">
                    {receipt.receiptNo}
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={receipt.receiptType} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(receipt.createdAt), "dd MMM, yyyy")}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{receipt.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      onClick={() => generatePdfReceipt(receipt, userInfo)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  You have no receipts yet. Your registration and donation
                  receipts will appear here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
