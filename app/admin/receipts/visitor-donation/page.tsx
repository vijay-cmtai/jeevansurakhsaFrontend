// File: components/AllVisitorDonationPage.js

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  VisitorDonation,
  fetchAllVisitorDonations,
  deleteVisitorDonation,
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";
import { Download, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ToWords } from "to-words";

// ... (keep all sub-components: PrintStyles, VisitorDonationReceipt, StatusBadge)
// Interface
interface Donation extends VisitorDonation {}

// Print Styles Component
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

// Receipt Design Component
const VisitorDonationReceipt = ({ donation }: { donation: Donation }) => {
  const colors = {
    primaryGreen: "#338547",
    darkerGreen: "#235d31",
    darkGrey: "#2d3748",
  };
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: { currency: true, ignoreDecimal: true },
  });
  const amountInWords = toWords.convert(donation.amount);

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
                  <p>NGO ID: TS/2025/0519895 | PAN No: AADTH2289P</p>
                  <p>80G Reg. No. AADTH2289PF2025101</p>
                  <p>
                    📍 1-63, Amadabakula, Kothakota, Wanaparthy, Telangana,
                    India – 509381
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-1.5 rounded-lg shadow-md">
              <QRCodeSVG
                value={`Receipt No: ${donation.receiptNo}, Amount: ${donation.amount}`}
                size={85}
              />
            </div>
          </header>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 -mt-10">
            <span
              style={{ backgroundColor: colors.darkGrey }}
              className="text-white text-md font-bold px-10 py-2.5 rounded-lg shadow-lg "
            >
              VISITOR DONATION RECEIPT
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
                  {donation.receiptNo || "N/A"}
                </td>
                <td className="p-2 border-b border-r border-gray-300 font-bold">
                  ₹{donation.amount.toLocaleString("en-IN")}
                </td>
                <td className="p-2 border-b border-r border-gray-300 text-green-600 font-semibold">
                  {donation.status}
                </td>
                <td className="p-2 border-b border-r border-gray-300">
                  {format(new Date(donation.createdAt), "dd-MM-yyyy")}
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
              <div className="p-2.5 flex-1 bg-white">{donation.name}</div>
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
                Contact
              </div>
              <div className="p-2.5 flex-1 bg-white">
                {donation.email || "N/A"} / {donation.mobile}
              </div>
            </div>
          </div>
          <div
            style={{ backgroundColor: colors.darkGrey }}
            className="mt-1 text-white p-2.5 text-sm font-semibold flex justify-around"
          >
            <span>PAN: {donation.panNumber || "N/A"}</span>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div>
              <h3 className="font-bold text-xl text-gray-800">
                Thank You For Your Generous Contribution
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
            Donations made to "Jeevan Suraksha" are eligible for the benefit of
            deduction under Section 80G of the Income Tax Act, 1961. Amount
            donated: ₹{donation.amount.toLocaleString("en-IN")}. Authorized by
            "Jeevan Suraksha".
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

const StatusBadge = ({ status }: { status: Donation["status"] }) => {
  const styles = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
};

// Main Component
export default function AllVisitorDonationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    donations,
    listStatus,
    actionStatus, // ✅ Get the new actionStatus from the state
  } = useSelector((state: RootState) => state.visitorDonation);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userIsAdmin = userInfo?.role === "Admin";
  const [receiptToPrint, setReceiptToPrint] = useState<Donation | null>(null);

  useEffect(() => {
    dispatch(fetchAllVisitorDonations());
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

  const handleDelete = (donationId: string) => {
    if (confirm("Are you sure you want to delete this donation record?")) {
      dispatch(deleteVisitorDonation(donationId));
    }
  };

  const handleDownload = (donation: Donation) => {
    setReceiptToPrint(donation);
  };

  const columns = [
    // ... (keep all other columns)
    { key: "sr", label: "Sr.No.", render: (_: Donation, i: number) => i + 1 },
    {
      key: "receiptNo",
      label: "Receipt No",
      render: (row: Donation) => row.receiptNo || "N/A",
    },
    {
      key: "details",
      label: "Name / Email / Mobile",
      render: (row: Donation) => (
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
      render: (row: Donation) => <StatusBadge status={row.status} />,
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: Donation) => `₹${row.amount.toLocaleString("en-IN")}`,
    },
    { key: "paymentMode", label: "Payment Mode", render: () => "Online" },
    {
      key: "download",
      label: "Download",
      render: (row: Donation) => (
        <Button
          size="sm"
          onClick={() => handleDownload(row)}
          disabled={!!receiptToPrint || row.status !== "SUCCESS"}
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
      render: (row: Donation) => (
        <>
          {userIsAdmin && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(row._id)}
              disabled={actionStatus === "loading"} // This now works correctly
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
    <div>
      <PrintStyles />
      {receiptToPrint ? (
        <div className="print-area">
          <VisitorDonationReceipt donation={receiptToPrint} />
        </div>
      ) : (
        <div className="p-4 sm:p-6 no-print">
          <DataTable
            title="All Visitor Donations"
            columns={columns}
            data={donations || []}
            totalEntries={donations?.length || 0}
            isLoading={listStatus === "loading"}
            totalLabel="Total Successful Donation"
            totalValue={totalAmount}
          />
        </div>
      )}
    </div>
  );
}
