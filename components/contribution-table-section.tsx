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
export function ContributionTableSection() {
  const tableData = [
    { members: "1,000", contribution: "500", total: "500,000" },
    { members: "5,000", contribution: "300", total: "1,500,000" },
    { members: "10,000", contribution: "200", total: "2,000,000" },
    { members: "50,000", contribution: "100", total: "5,000,000" },
    { members: "100,000", contribution: "75", total: "7,500,000" },
    { members: "200,000", contribution: "50", total: "10,000,000" },
    { members: "300,000", contribution: "35", total: "10,500,000" },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-lg font-semibold text-blue-600 mb-2 tracking-wide">
            Illustration Table
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contribution Calculation Based on Membership Growth
          </h2>
          <p className="text-md text-gray-600 max-w-3xl mx-auto">
            The total amount collected per case depends on the number of active
            members contributing. Below is an estimate of how the per-member
            contribution reduces as membership increases:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/80"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70">
                <TableHead className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">
                  Total Members
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider text-right">
                  Contribution Per Member (₹)
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider text-right">
                  Total Collected Fund (₹)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  className="odd:bg-white even:bg-gray-50/50 border-t border-gray-200/60"
                >
                  <TableCell className="px-6 py-4 font-medium text-gray-800">
                    {row.members}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 text-right">
                    {row.contribution}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-blue-700 text-right">
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </section>
  );
}
