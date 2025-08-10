// app/dashboard/receipt/donation/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const donations: any[] = [
  // Add donation data here if any
];

export default function DonationReceiptPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Donation Payment Receipt
      </h1>
      <p className="mt-1 text-gray-600">
        Thank you for your support! Here is your donation history.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 bg-white p-6 rounded-xl shadow-lg border"
      >
        {donations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{/* Map through donations here */}</TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600">
              You Have No Donated Receipts
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your donation history will appear here.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
