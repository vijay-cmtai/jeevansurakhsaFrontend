// app/dashboard/receipt/membership/page.tsx
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

const payments = [
  { id: "INV001", date: "2025-07-31", amount: "₹100.00", status: "Success" },
  { id: "INV002", date: "2024-07-31", amount: "₹100.00", status: "Success" },
];

export default function MembershipReceiptPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Membership Payment Receipt
      </h1>
      <p className="mt-1 text-gray-600">
        Here is a history of your membership payments.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 bg-white p-6 rounded-xl shadow-lg border"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "Success" ? "default" : "destructive"
                    }
                    className="bg-green-500"
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
