"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  checkDonationStatus,
  resetDonationState,
} from "@/lib/redux/features/visitordonations/visitorDonationSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Home, Download, Gift, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

// Type definition (no changes needed)
interface DonationStatus {
  status: "SUCCESS" | "PENDING" | "FAILED";
  receiptNo?: string;
  amount: number;
  createdAt: string;
  donorName?: string;
}

// PDF Generation Helper (no changes needed)
const generatePdfReceipt = (donation: DonationStatus, orderId: string) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Visitor Donation Receipt", 105, 20, { align: "center" });
    // ... rest of the PDF generation code
    autoTable(doc, {
        startY: 40,
        theme: "grid",
        head: [['Field', 'Details']],
        body: [
          ['Receipt No:', donation.receiptNo || 'N/A'],
          ['Date:', format(new Date(donation.createdAt), "dd MMM, yyyy")],
          ['Donor Name:', donation.donorName || 'Valued Supporter'],
          ['Transaction ID:', orderId],
          ['Amount:', `₹ ${donation.amount.toFixed(2)}`],
          ['Status:', donation.status],
        ],
    });
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(10);
    doc.text("Thank you for your generous contribution.", 105, finalY + 15, { align: "center" });
    doc.save(`Donation-Receipt-${donation.receiptNo || orderId}.pdf`);
};


// --- UI Sub-components for each status ---

const StatusCard = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none bg-white dark:bg-slate-800">
            {children}
        </Card>
    </div>
);

const LoadingState = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <Loader2 className="h-14 w-14 animate-spin text-blue-500" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{text}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please do not close or refresh this page.</p>
    </div>
);

const SuccessState = ({ donation, orderId }: { donation: DonationStatus, orderId: string }) => (
    <>
        <CardHeader className="items-center text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-t-2xl">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <CheckCircle className="h-20 w-20 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mt-4">Thank You!</h1>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-center">
            <p className="text-slate-600 dark:text-slate-300">
                Dear {donation.donorName || 'Valued Supporter'}, your generous donation of <strong className="text-slate-800 dark:text-slate-100">₹{donation.amount}</strong> has been received successfully.
            </p>
            <div className="text-left bg-slate-100 dark:bg-slate-700 p-4 rounded-lg text-sm space-y-2 mt-4">
                <div className="flex justify-between"><strong className="text-slate-500 dark:text-slate-400">Receipt No:</strong> <span>{donation.receiptNo || "Generated"}</span></div>
                <div className="flex justify-between"><strong className="text-slate-500 dark:text-slate-400">Transaction ID:</strong> <span>{orderId}</span></div>
                <div className="flex justify-between"><strong className="text-slate-500 dark:text-slate-400">Date:</strong> <span>{format(new Date(donation.createdAt), "dd MMM, yyyy")}</span></div>
            </div>
            <Button onClick={() => generatePdfReceipt(donation, orderId)} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
                <Download className="h-5 w-5 mr-2" /> Download Receipt
            </Button>
        </CardContent>
        <CardFooter className="p-6 border-t dark:border-slate-700">
            <Button className="w-full" variant="ghost" asChild>
                <Link href="/"><Home className="h-4 w-4 mr-2" /> Back to Home</Link>
            </Button>
        </CardFooter>
    </>
);

const FailedState = ({ error }: { error: string | null }) => (
    <>
        <CardHeader className="items-center text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-t-2xl">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <XCircle className="h-20 w-20 text-red-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-red-700 dark:text-red-400 mt-4">Payment Failed</h1>
        </CardHeader>
        <CardContent className="p-6 text-center">
            <p className="text-slate-600 dark:text-slate-300">Unfortunately, your transaction could not be completed. No amount was charged from your account.</p>
            {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">Reason: {error}</p>}
        </CardContent>
        <CardFooter className="p-6 border-t dark:border-slate-700">
            <Button className="w-full" variant="secondary" asChild>
                <Link href="/donate"><Gift className="h-4 w-4 mr-2" /> Try Donating Again</Link>
            </Button>
        </CardFooter>
    </>
);


export default function DonationStatusClient() {
  // --- Logic and State Management (No changes needed) ---
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { error, currentDonationStatus } = useSelector(
    (state: RootState) => state.visitorDonation
  );

  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => { dispatch(resetDonationState()); }, [dispatch]);

  useEffect(() => {
    if (orderId && isPolling) {
      dispatch(checkDonationStatus(orderId));
      const interval = setInterval(() => dispatch(checkDonationStatus(orderId)), 3500);
      const timeout = setTimeout(() => { setIsPolling(false); clearInterval(interval); }, 30000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    } else { setIsPolling(false); }
  }, [dispatch, orderId, isPolling]);

  useEffect(() => {
    if (currentDonationStatus?.status === "SUCCESS" || currentDonationStatus?.status === "FAILED") {
      setIsPolling(false);
    }
  }, [currentDonationStatus]);
  
  // --- Main Render Logic ---
  if (!orderId) {
    return <StatusCard><FailedState error="No transaction ID found in the URL." /></StatusCard>;
  }
  
  const donation = currentDonationStatus as DonationStatus | null;
  
  return (
    <StatusCard>
      <AnimatePresence mode="wait">
        <motion.div
          key={donation?.status || "loading"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {(() => {
            if (error) {
              return <FailedState error={error} />;
            }
            switch (donation?.status) {
              case "SUCCESS":
                return <SuccessState donation={donation} orderId={orderId} />;
              case "FAILED":
                return <FailedState error="The payment gateway reported a failure." />;
              case "PENDING":
                return <LoadingState text="Payment is Processing..." />;
              default:
                return <LoadingState text="Verifying Payment..." />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    </StatusCard>
  );
}
