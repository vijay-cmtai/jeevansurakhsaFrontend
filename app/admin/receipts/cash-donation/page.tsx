"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Trash2, Download, PlusCircle, Loader2, Eye } from "lucide-react";
import {
  CashDonation,
  fetchCashDonations,
  deleteCashDonation, // ✅ Action is correctly imported
} from "@/lib/redux/features/donations/cashDonationsSlice";
import { format } from "date-fns";
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
        visibility: hidden !important;
      }
      .print-area,
      .print-area * {
        visibility: visible !important;
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
      }
      .receipt-container {
        transform: scale(0.92);
        box-shadow: none !important;
        border: 1px solid #ddd !important;
      }
      .no-print {
        display: none !important;
      }
    }
  `}</style>
);

const DonationReceipt = ({ donation }: { donation: CashDonation }) => {
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
        <header
          style={{ backgroundColor: colors.primaryGreen }}
          className="p-4 flex items-center justify-between text-white rounded-t-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full shadow-md">
              <Image src="/logo.jpg" alt="Logo" width={65} height={65} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-wide">
                Jeevan Suraksha
              </h1>
              <p className="text-md font-light">Social Security Collective</p>
              <p className="text-xs mt-2">
                NGO ID:TS/2025/0519895 | 80G Reg No:AADTH2289PF2025101
              </p>
              <p className="text-xs">
                📍 1-63, Amadabakula, Kothakota, Wanaparthy, Telangana, India –
                509381
              </p>
            </div>
          </div>
          <div className="bg-white p-1.5 rounded-lg shadow-md">
            <QRCodeSVG
              value={`Receipt No: ${donation.receiptNo}, Amount: ${donation.amount}`}
              size={85}
            />
          </div>
        </header>

        <div className="relative -mt-2 flex justify-center z-20">
          <span
            style={{ backgroundColor: colors.darkGrey }}
            className="text-white text-md font-bold px-10 py-2.5 rounded-lg shadow-lg"
          >
            CASH DONATION RECEIPT
          </span>
        </div>

        <main className="p-6">
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
                <th className="p-2 border-t border-b border-gray-300">Mode</th>
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
                  {donation.receiptNo}
                </td>
                <td className="p-2 border-b border-r border-gray-300 font-bold">
                  ₹{donation.amount.toLocaleString("en-IN")}
                </td>
                <td className="p-2 border-b border-r border-gray-300">Cash</td>
                <td className="p-2 border-b border-r border-gray-300 text-green-600 font-semibold">
                  Success
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
                Address
              </div>
              <div className="p-2.5 flex-1 bg-white">
                {donation.address || "N/A"}
              </div>
            </div>
          </div>
          <div
            style={{ backgroundColor: colors.darkGrey }}
            className="mt-1 text-white p-2.5 text-sm font-semibold flex justify-around"
          >
            <span>Bank: {donation.bankName || "HDFC Bank"}</span>
            <span>Branch: {donation.branchName || "Hi-Tech City"}</span>
            <span>PAN: {donation.panNumber || "AMVPM7764Q"}</span>
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
              <p className="text-xs text-gray-600">Jeevan Suraksha</p>
              <p className="text-xs text-gray-600">Authorised Signatory</p>
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
const DonorDetailsCell = ({ donation }: { donation: CashDonation }) => (
  <div className="text-left text-sm">
    <p className="font-semibold">{donation.name}</p>
    <p className="text-xs text-gray-500">
      {donation.email || "No Email"} / {donation.mobile}
    </p>
  </div>
);

export default function CashDonationReceiptsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    donations,
    pagination,
    totalDonationAmount,
    listStatus,
    actionStatus,
  } = useSelector((state: RootState) => state.cashDonations);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userIsAdmin = userInfo?.role === "Admin";

  const [receiptToPrint, setReceiptToPrint] = useState<CashDonation | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchCashDonations({}));
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
      dispatch(deleteCashDonation(donationId));
    }
  };

  const handleDownload = (donation: CashDonation) => {
    setReceiptToPrint(donation);
  };

  const columns = [
    {
      key: "select",
      label: <>{userIsAdmin && <Checkbox />}</>,
      render: () => <>{userIsAdmin && <Checkbox />}</>,
    },
    {
      key: "sr",
      label: "Sr No",
      render: (_: CashDonation, i: number) => i + 1,
    },
    { key: "receiptNo", label: "Receipt No" },
    {
      key: "name",
      label: "Name / Email / Mobile",
      render: (row: CashDonation) => <DonorDetailsCell donation={row} />,
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: CashDonation) => `₹${row.amount.toLocaleString("en-IN")}`,
    },
    {
      key: "mode",
      label: "Mode",
      render: (row: CashDonation) => row.bankName || "Cash",
    },
    {
      key: "paymentImage",
      label: "Payment Image",
      render: (row: CashDonation) =>
        row.paymentImageUrl ? (
          <a
            href={row.paymentImageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={row.paymentImageUrl}
              alt="Payment Proof"
              width={50}
              height={50}
              className="rounded object-cover"
            />
          </a>
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        ),
    },
    {
      key: "details",
      label: "Details",
      render: () => (
        <Button size="sm" variant="outline">
          <Eye size={16} />
        </Button>
      ),
    },
    {
      key: "download",
      label: "Download",
      render: (row: CashDonation) => (
        <Button
          size="sm"
          onClick={() => handleDownload(row)}
          disabled={!!receiptToPrint}
        >
          {receiptToPrint && receiptToPrint._id === row._id ? (
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
      render: (row: CashDonation) => (
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

  if (receiptToPrint) {
    return (
      <>
        <PrintStyles />
        <div className="print-area">
          <DonationReceipt donation={receiptToPrint} />
        </div>
      </>
    );
  }

  return (
    <div className="p-4 sm:p-6 no-print">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Total Cash Donations:{" "}
          <span className="text-green-600">
            ₹{totalDonationAmount.toLocaleString("en-IN")}
          </span>
        </h1>
        {userIsAdmin && (
          <Button onClick={() => router.push("/admin/cash-donation/receive")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Receive New Donation
          </Button>
        )}
      </div>
      <DataTable
        title="Cash Donation Receipts"
        columns={columns}
        data={donations}
        totalEntries={pagination?.totalRecords || donations.length}
        isLoading={listStatus === "loading"}
      />
    </div>
  );
}
