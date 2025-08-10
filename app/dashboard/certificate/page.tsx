"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchMyCertificates,
  MyCertificate,
} from "@/lib/redux/features/memberCertificates/memberCertificatesSlice";
import { motion } from "framer-motion";
import { Award, XCircle, Loader2, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// A sub-component to display a single certificate card
const CertificateCard = ({ certificate }: { certificate: MyCertificate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-lg shadow-md border flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <div className="flex items-center gap-4 text-left">
      <Award className="h-10 w-10 text-yellow-500 flex-shrink-0" />
      <div>
        <h3 className="font-bold text-lg text-gray-800">
          {certificate.programName}
        </h3>
        <p className="text-sm text-gray-500">
          Issued on: {format(new Date(certificate.createdAt), "dd MMMM, yyyy")}
        </p>
        <p className="text-xs text-gray-400">
          Certificate No: {certificate.certificateNo}
        </p>
      </div>
    </div>
    <Button asChild className="w-full sm:w-auto">
      <a
        href={certificate.certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="mr-2 h-4 w-4" />
        View Certificate
      </a>
    </Button>
  </motion.div>
);

// The main page component
export default function CertificatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { myCertificates, listStatus, listError } = useSelector(
    (state: RootState) => state.memberCertificates
  );

  useEffect(() => {
    // Fetch certificates when the page loads
    dispatch(fetchMyCertificates());
  }, [dispatch]);

  const hasCertificates = myCertificates && myCertificates.length > 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">My Certificates</h1>
      <p className="mt-1 text-gray-600">
        View your achievement certificates here.
      </p>

      <div className="mt-8">
        {/* --- Loading State --- */}
        {listStatus === "loading" && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        )}

        {/* --- Error State --- */}
        {listStatus === "failed" && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Error Loading Certificates</h3>
              <p>{listError}</p>
            </div>
          </div>
        )}

        {/* --- Success State --- */}
        {listStatus === "succeeded" &&
          (hasCertificates ? (
            <div className="space-y-4">
              {myCertificates.map((cert) => (
                <CertificateCard key={cert._id} certificate={cert} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-2xl shadow-lg text-center border">
                <div className="mx-auto w-fit p-4 bg-gray-100 rounded-full">
                  <XCircle className="h-16 w-16 text-gray-400" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-500">
                  No Certificate Yet
                </h2>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  You currently have no certificates. They will appear here once
                  they are issued by an administrator.
                </p>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
