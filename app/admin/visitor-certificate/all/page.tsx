"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Loader2 } from "lucide-react";
import {
  fetchVisitorCertificates,
  deleteVisitorCertificate,
  downloadVisitorCertificate,
  VisitorCertificate,
} from "@/lib/redux/features/certificates/visitorCertificatesSlice";

export default function AllVisitorCertificatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { certificates, pagination, listStatus, actionStatus, downloadStatus } =
    useSelector((state: RootState) => state.visitorCertificates);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userIsAdmin = userInfo?.role === "Admin";

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchVisitorCertificates({}));
  }, [dispatch]);

  const handleDelete = (certificateId: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      dispatch(deleteVisitorCertificate(certificateId));
    }
  };

  const handleDownload = (certificate: VisitorCertificate) => {
    setDownloadingId(certificate._id);
    const fileName = `certificate-${certificate.name.replace(/\s+/g, "-")}.pdf`;

    dispatch(
      downloadVisitorCertificate({ certificateId: certificate._id, fileName })
    )
      .then((result) => {
        if (downloadVisitorCertificate.rejected.match(result)) {
          alert(`Download failed: ${result.payload}`);
        }
      })
      .finally(() => {
        setDownloadingId(null);
      });
  };

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: VisitorCertificate, index: number) =>
        (pagination.page - 1) * 10 + index + 1,
    },
    {
      key: "certificateNo",
      label: "Certificate No",
      render: (row: VisitorCertificate) => (
        <span className="font-mono">{row.certificateNo}</span>
      ),
    },
    {
      key: "details",
      label: "Name / Email / Mobile",
      render: (row: VisitorCertificate) => (
        <div>
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-gray-500">
            {row.email || "N/A"} / {row.mobile}
          </p>
        </div>
      ),
    },
    { key: "fatherName", label: "Father Name" },
    { key: "programName", label: "Program Name" },
    {
      key: "download",
      label: "Download",
      render: (row: VisitorCertificate) => {
        const isDownloading =
          downloadStatus === "loading" && downloadingId === row._id;
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownload(row)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (row: VisitorCertificate) => (
        <>
          {userIsAdmin && (
            <Button
              size="icon"
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
      title="All Visitor Certificate"
      columns={columns}
      data={certificates}
      totalEntries={pagination.total}
      isLoading={listStatus === "loading"}
    />
  );
}
