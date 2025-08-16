"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Loader2 } from "lucide-react";
import {
  fetchAllReceipts,
  deleteReceipt,
  Receipt,
} from "@/lib/redux/features/receipts/receiptsSlice";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ToWords } from "to-words";

const PrintStyles = () => (
  <style jsx global>{`
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background-color: white !important;
      }
      body * {
        visibility: hidden;
      }
      .no-print {
        display: none !important;
      }
      .print-area,
      .print-area * {
        visibility: visible;
      }
      .print-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: 100% !important;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 2rem;
        background-color: white !important;
      }
      .receipt-container {
        transform: scale(0.92);
        box-shadow: none !important;
        border: 1px solid #ddd !important;
        position: relative !important;
        left: auto !important;
        top: auto !important;
      }
    }
  `}</style>
);

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

const MembershipReceipt = ({ receipt }: { receipt: Receipt }) => {
  const colors = {
    primaryGreen: "#338547",
    darkerGreen: "#235d31",
    darkGrey: "#2d3748",
  };
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: { currency: true, ignoreDecimal: true },
  });
  const amountInWords = toWords.convert(receipt.amount);
  const receiptTitle = "REGISTRATION FEE RECEIPT";

  return (
    <div className="receipt-container w-[820px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden font-sans relative">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/watermark.png"
          alt="Watermark"
          width={350}
          height={350}
          className="opacity-10"
        />
      </div>
      <div className="relative z-10">
        <div className="relative">
          <header
            style={{ backgroundColor: colors.primaryGreen }}
            className="p-4 flex items-center justify-between text-white rounded-t-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-[65px] h-[65px] bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-wide">
                  Jeevan Suraksha
                </h1>
                <p className="text-md font-light">Social Security Collective</p>
                <div className="text-xs mt-1 leading-tight space-y-0.5">
                  <p>80G Reg. No. AADTH2289PF2025101</p>
                  <p>
                    📍 1-63, Amadabakula, Kothakota, Wanaparthy, Telangana,
                    India – 509381
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-1.5 rounded-lg shadow-md mt-5">
              <QRCodeSVG value={`Receipt: ${receipt.receiptNo}`} size={85} />
            </div>
          </header>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <span
              style={{ backgroundColor: colors.darkGrey }}
              className="text-white text-md font-bold px-10 py-2.5 rounded-lg shadow-lg"
            >
              {receiptTitle}
            </span>
          </div>
        </div>

        <main className="p-6 pt-12">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr
                style={{ backgroundColor: colors.darkerGreen, color: "#fff" }}
              >
                <th className="p-2 border-l border-t border-b border-gray-300">
                  Receipt No
                </th>
                <th className="p-2 border-t border-b border-gray-300">
                  Amount
                </th>
                <th className="p-2 border-t border-b border-gray-300">
                  Payment Status
                </th>
                <th className="p-2 border-t border-b border-r border-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="p-2 border-l border-b border-r border-gray-300 font-medium">
                  {receipt.receiptNo}
                </td>
                <td className="p-2 border-b border-r border-gray-300 font-bold">
                  ₹{receipt.amount.toLocaleString("en-IN")}
                </td>
                <td className="p-2 border-b border-r border-gray-300 text-green-600 font-semibold">
                  Success
                </td>
                <td className="p-2 border-b border-r border-gray-300">
                  {format(new Date(receipt.createdAt), "dd-MM-yyyy")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-1 text-sm">
            <div className="flex border border-gray-300 border-t-0">
              <div
                style={{ backgroundColor: colors.darkerGreen }}
                className="w-48 text-white font-bold p-2.5"
              >
                Received From
              </div>
              <div className="p-2.5 flex-1 bg-white">
                {receipt.member?.fullName || "N/A"} (ID:{" "}
                {receipt.member?.memberId || "N/A"})
              </div>
            </div>
            <div className="flex border border-gray-300 border-t-0">
              <div
                style={{ backgroundColor: colors.darkerGreen }}
                className="w-48 text-white font-bold p-2.5"
              >
                Rupees(in words)
              </div>
              <div className="p-2.5 flex-1 bg-white capitalize">
                {amountInWords}
              </div>
            </div>
            <div className="flex border border-gray-300 border-t-0">
              <div
                style={{ backgroundColor: colors.darkerGreen }}
                className="w-48 text-white font-bold p-2.5"
              >
                Address
              </div>
              <div className="p-2.5 flex-1 bg-white">
                {receipt.member?.address || "N/A"}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-end">
            <div>
              <h3 className="font-bold text-xl text-gray-800">
                Thank You For Your Contribution
              </h3>
            </div>
            <div className="text-center">
              <Image
                src="/signature.png"
                alt="Signature"
                width={150}
                height={50}
              />
              <p className="border-t border-black mt-1 pt-1 font-bold text-sm">
                Krishnaiah Panuganti
              </p>
              <p className="text-xs text-gray-600">(Chief Relations Officer)</p>
            </div>
          </div>
        </main>

        <div className="px-6 pb-4">
          <div
            style={{ backgroundColor: "#f0f2f5" }}
            className="p-3 text-xs text-center border border-gray-300 rounded-md"
          >
            This is a system generated receipt. For queries, contact
            info@jeevansuraksha.org. Amount received: ₹
            {receipt.amount.toLocaleString("en-IN")}.
          </div>
        </div>

        <footer
          style={{ backgroundColor: colors.darkGrey }}
          className="p-3 text-white text-center text-sm font-semibold rounded-b-lg"
        >
          📞 +91 78160 58717 | 📧 info@jeevansuraksha.org | 🌐
          www.jeevansuraksha.org
        </footer>
      </div>
    </div>
  );
};

export default function AllMemberReceiptsAdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { allReceipts, totalAmount, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.receipts
  );
  const [receiptToPrint, setReceiptToPrint] = useState<Receipt | null>(null);

  useEffect(() => {
    dispatch(fetchAllReceipts());
  }, [dispatch]);

  useEffect(() => {
    if (receiptToPrint) {
      const timer = setTimeout(() => {
        window.print();
        setReceiptToPrint(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [receiptToPrint]);

  const handleDelete = (receiptId: string) => {
    if (confirm("Are you sure?")) {
      dispatch(deleteReceipt(receiptId));
    }
  };

  const handleDownload = (receipt: Receipt) => {
    setReceiptToPrint(receipt);
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
      render: (row: Receipt) => `₹${row.amount.toLocaleString("en-IN")}`,
    },
    {
      key: "download",
      label: "Download",
      render: (row: Receipt) => (
        <Button
          size="sm"
          onClick={() => handleDownload(row)}
          disabled={!!receiptToPrint}
        >
          {receiptToPrint?._id === row._id ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Download size={16} />
          )}
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
    <div>
      <PrintStyles />
      {receiptToPrint ? (
        <div className="print-area">
          <MembershipReceipt receipt={receiptToPrint} />
        </div>
      ) : (
        <div className="p-4 sm:p-6 no-print">
          <DataTable
            title="All Member Receipts"
            columns={columns}
            data={allReceipts || []}
            totalEntries={allReceipts?.length || 0}
            isLoading={listStatus === "loading"}
            totalLabel="Total Amount Received"
            totalValue={totalAmount}
          />
        </div>
      )}
    </div>
  );
}
