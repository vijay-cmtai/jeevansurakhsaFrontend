"use client";

import { useEffect, useState } from "react";
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
  deleteCashDonation,
  downloadCashDonationReceipt,
} from "@/lib/redux/features/donations/cashDonationsSlice";

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
    downloadStatus,
  } = useSelector((state: RootState) => state.cashDonations);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userIsAdmin = userInfo?.role === "Admin";
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCashDonations({}));
  }, [dispatch]);

  const handleDelete = (donationId: string) => {
    if (confirm("Are you sure you want to delete this donation record?")) {
      dispatch(deleteCashDonation(donationId));
    }
  };

  const handleDownload = (donationId: string, receiptNo: string) => {
    if (downloadingId) return;
    setDownloadingId(donationId);
    const fileName = `receipt-${receiptNo}.pdf`;
    dispatch(downloadCashDonationReceipt({ donationId, fileName })).finally(
      () => setDownloadingId(null)
    );
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
      key: "paymentMode",
      label: "Mode",
      render: (row: CashDonation) => row.mode || "Cash",
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
      render: (row: CashDonation) => {
        const isDownloading = downloadingId === row._id;
        return (
          <Button
            size="sm"
            onClick={() => handleDownload(row._id, row.receiptNo)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
          </Button>
        );
      },
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
        totalEntries={pagination?.totalRecords || donations.length}
        isLoading={listStatus === "loading"}
      />
    </div>
  );
}
