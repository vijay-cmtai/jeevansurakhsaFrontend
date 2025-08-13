"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Trash2 } from "lucide-react";
import {
  fetchGeneratedCertificates,
  deleteCertificate,
  GeneratedCertificate,
} from "@/lib/redux/features/memberCertificates/memberCertificatesSlice";
import { Member } from "@/lib/redux/features/members/membersSlice";
import axiosInstance from "@/lib/axios";

const safeFormatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isValid(date) ? format(date, "dd-MM-yyyy, hh:mm a") : "Invalid Date";
};

const MemberDetailsCell = ({ member }: { member: Member | undefined }) => {
  if (!member) {
    return <div className="text-red-500">Member Data Missing</div>;
  }
  return (
    <div>
      <p className="font-semibold">{member.fullName || "N/A"}</p>
      <p className="text-xs text-gray-500">
        Reg: {member.registrationNo || "N/A"}
      </p>
    </div>
  );
};

export default function ActiveCertificatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { generatedCertificates, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.memberCertificates
  );

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (listStatus === "idle") {
      dispatch(fetchGeneratedCertificates());
    }
  }, [dispatch, listStatus]);

  const handleDelete = (certId: string) => {
    if (confirm("Are you sure you want to delete this certificate record?")) {
      dispatch(deleteCertificate(certId));
    }
  };

  // ✅ Fixed download function using axiosInstance
  const handleDownloadCertificate = async (
    certificate: GeneratedCertificate
  ) => {
    setDownloadingId(certificate._id);
    try {
      console.log("Downloading certificate:", certificate._id);

      // ✅ Use axiosInstance which handles auth automatically
      const response = await axiosInstance.get(
        `/api/admin/member-certificates/download/${certificate._id}`,
        {
          responseType: "blob", // ✅ Critical for PDF download
        }
      );

      console.log("Download response received, size:", response.data.size);

      // Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });

      if (blob.size === 0) {
        throw new Error("Received empty file");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `Certificate-${certificate.member?.registrationNo || certificate.certificateNo}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("Download completed successfully");
    } catch (error: any) {
      console.error("Download failed:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        // Optionally redirect to login
        // router.push('/admin/login');
      } else if (error.response?.status === 404) {
        alert("Certificate not found.");
      } else if (error.response?.status === 403) {
        alert(
          "Access denied. You don't have permission to download this certificate."
        );
      } else if (
        error.code === "ECONNREFUSED" ||
        error.code === "ERR_NETWORK"
      ) {
        alert(
          "Cannot connect to server. Please check if the backend server is running."
        );
      } else {
        alert(
          `Failed to download certificate: ${error.response?.data?.message || error.message}`
        );
      }
    } finally {
      setDownloadingId(null);
    }
  };

  // ✅ View certificate function (optional - opens in new tab)
  const handleViewCertificate = async (certificate: GeneratedCertificate) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/member-certificates/view/${certificate._id}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, "_blank");

      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error: any) {
      console.error("View failed:", error);
      alert(
        `Failed to view certificate: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const columns = [
    {
      key: "sr",
      label: "Sr.No.",
      render: (_: GeneratedCertificate, index: number) => index + 1,
    },
    {
      key: "details",
      label: "Member Details",
      render: (row: GeneratedCertificate) => (
        <MemberDetailsCell member={row.member} />
      ),
    },
    {
      key: "programName",
      label: "Program Name",
      render: (row: GeneratedCertificate) => row.programName || "N/A",
    },
    {
      key: "certificateNo",
      label: "Certificate No",
      render: (row: GeneratedCertificate) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.certificateNo}
        </Badge>
      ),
    },
    {
      key: "generatedBy",
      label: "Generated By",
      render: (row: GeneratedCertificate) =>
        (row.generatedBy && row.generatedBy.name) || "N/A",
    },
    {
      key: "generatedAt",
      label: "Generated At",
      render: (row: GeneratedCertificate) => (
        <span className="text-xs text-gray-600">
          {safeFormatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: GeneratedCertificate) => {
        const isDownloading = downloadingId === row._id;
        const isDeleting = actionStatus === "loading";

        return (
          <div className="flex flex-col gap-1.5 items-stretch min-w-[120px]">
            {/* View Button */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleViewCertificate(row)}
              disabled={isDownloading || isDeleting}
              className="text-xs"
            >
              👁️ View
            </Button>

            {/* Download Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadCertificate(row)}
              disabled={isDownloading || isDeleting}
              className="text-xs"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </>
              )}
            </Button>

            {/* Delete Button */}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(row._id)}
              disabled={isDownloading || isDeleting}
              className="text-xs"
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  const dataToShow = generatedCertificates || [];

  // ✅ Loading state
  if (listStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (listStatus === "failed") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load certificates</p>
          <Button
            onClick={() => dispatch(fetchGeneratedCertificates())}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <DataTable
        title="All Generated Member Certificates"
        columns={columns}
        data={dataToShow}
        totalEntries={dataToShow.length}
        isLoading={listStatus === "loading"}
      />

      {/* ✅ Additional info for debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Debug Info: API URL: {process.env.NEXT_PUBLIC_API_URL} | Total
          Certificates: {dataToShow.length} | Status: {listStatus}
        </div>
      )}
    </div>
  );
}
