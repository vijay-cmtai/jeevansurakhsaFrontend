"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";
import {
  fetchAllReceipts,
  deleteReceipt,
  Receipt,
} from "@/lib/redux/features/receipts/receiptsSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const generatePdfReceipt = async (receipt: Receipt) => {
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
      ["Receipt No:", receipt.receiptNo],
      ["Date:", format(new Date(receipt.createdAt), "dd MMM, yyyy")],
      ["Member ID:", receipt.member?.memberId || "N/A"],
      ["Member Name:", receipt.member?.fullName || "N/A"],
      [
        "Email / Mobile:",
        `${receipt.member?.email || "N/A"} / ${receipt.member?.mobile || "N/A"}`,
      ],
      ["Receipt Type:", receipt.receiptType.replace("_", " ")],
      ["Amount Paid:", `₹ ${receipt.amount.toFixed(2)}`],
    ],
    headStyles: { fillColor: [45, 55, 72] }, // Dark header for better look
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

  doc.save(`Receipt-${receipt.receiptNo}.pdf`);
};

export default function AllMemberReceiptsAdminPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { allReceipts, totalAmount, listStatus, actionStatus, error } =
    useSelector((state: RootState) => state.receipts);

  useEffect(() => {
    dispatch(fetchAllReceipts());
  }, [dispatch]);

  const handleDelete = (receiptId: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this receipt record?"
      )
    ) {
      dispatch(deleteReceipt(receiptId));
    }
  };

  const columns = [
    { key: "sr", label: "Sr.No.", render: (_: Receipt, i: number) => i + 1 },
    { key: "receiptNo", label: "Receipt No." },
    {
      key: "member",
      label: "Member Details",
      render: (row: Receipt) => (
        <div>
          <p className="font-semibold">{row.member?.fullName || "N/A"}</p>
          <p className="text-xs text-gray-500">
            {row.member?.memberId || row.member?._id}
          </p>
          <p className="text-xs text-gray-500">{row.member?.email}</p>
        </div>
      ),
    },
    {
      key: "receiptType",
      label: "Type",
      render: (row: Receipt) => <TypeBadge type={row.receiptType} />,
    },
    {
      key: "date",
      label: "Date",
      render: (row: Receipt) => format(new Date(row.createdAt), "dd-MM-yyyy"),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: Receipt) => `₹${row.amount.toFixed(2)}`,
    },
    {
      key: "download",
      label: "Download",
      render: (row: Receipt) => (
        <Button
          size="sm"
          onClick={() => generatePdfReceipt(row)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download size={16} className="mr-2" />
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
      title="All Member Receipts"
      columns={columns}
      data={allReceipts || []}
      totalEntries={allReceipts?.length || 0}
      isLoading={listStatus === "loading"}
      totalLabel="Total Amount Received"
      totalValue={totalAmount}
    />
  );
}
