"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  CashDonation,
  fetchCashDonations,
  deleteCashDonation,
  downloadCashDonationReceipt,
} from "@/lib/redux/features/donations/cashDonationsSlice";
import { Eye, Trash2, Download, PlusCircle, Loader2 } from "lucide-react";
import Image from "next/image";

const DonorDetailsCell = ({ donation }: { donation: CashDonation }) => (
  <div className="text-left text-sm">
    <p className="font-semibold">{donation.name}</p>
    <p className="text-xs text-gray-500">{donation.email || "No Email"}</p>
    <p className="text-xs text-gray-500">{donation.mobile}</p>
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
    downloadStatus,
    downloadError,
  } = useSelector((state: RootState) => state.cashDonations);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const userIsAdmin = userInfo?.role === "Admin";

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCashDonations({}));
  }, [dispatch]);

  useEffect(() => {
    if (downloadStatus === "failed" && downloadError) {
      alert(`Download failed: ${downloadError}`);
    }
  }, [downloadStatus, downloadError]);

  const handleDelete = (donationId: string) => {
    if (confirm("Are you sure you want to delete this donation record?")) {
      dispatch(deleteCashDonation(donationId));
    }
  };

  const handleDownload = (donationId: string, receiptNo: string) => {
    if (downloadStatus === "loading") return;

    setDownloadingId(donationId);
    const fileName = `receipt-${receiptNo}.pdf`;

    dispatch(downloadCashDonationReceipt({ donationId, fileName })).finally(
      () => {
        setDownloadingId(null);
      }
    );
  };

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: CashDonation, index: number) =>
        (pagination.page - 1) * 10 + index + 1,
    },
    {
      key: "receiptNo",
      label: "Receipt No",
      render: (row: CashDonation) => (
        <span className="font-mono">{row.receiptNo}</span>
      ),
    },
    {
      key: "donor",
      label: "Donor Details",
      render: (row: CashDonation) => <DonorDetailsCell donation={row} />,
    },
    {
      key: "amount",
      label: "Amount (₹)",
      render: (row: CashDonation) => `₹${row.amount.toLocaleString("en-IN")}`,
    },
    {
      key: "date",
      label: "Donation Date",
      render: (row: CashDonation) =>
        format(new Date(row.createdAt), "dd-MM-yyyy"),
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
      key: "actions",
      label: "Actions",
      render: (row: CashDonation) => {
        const isDownloading = downloadingId === row._id;

        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => alert("Viewing details for " + row.name)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="text-blue-600 border-blue-500"
              onClick={() => handleDownload(row._id, row.receiptNo)}
              disabled={isDownloading || downloadStatus === "loading"}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
            {userIsAdmin && (
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(row._id)}
                disabled={actionStatus === "loading"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6">
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
        totalEntries={pagination.totalRecords}
        isLoading={listStatus === "loading"}
      />
    </div>
  );
}
