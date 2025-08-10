"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react"; // Loading icon ke liye

// Props ka type define karein aur 'isLoading' ko add karein
type DataTableProps = {
  title: string;
  columns: {
    key: string;
    label: React.ReactNode;
    render?: (row: any, index: number) => React.ReactNode;
  }[];
  data: any[];
  totalEntries: number;
  isLoading?: boolean; // isLoading ko optional prop banayein
};

export function DataTable({
  title,
  columns,
  data,
  totalEntries,
  isLoading = false, // Default value false set karein
}: DataTableProps) {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          {/* Aap yahan search aur filter buttons add kar sakte hain */}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* --- YAHAN SABSE BADA BADLAV HAI --- */}
            {isLoading ? (
              // Agar isLoading true hai, to loading indicator dikhayein
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    <span className="text-gray-600">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              // Agar data hai, to use map karke rows banayein
              data.map((row, rowIndex) => (
                <TableRow key={row._id || rowIndex}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row, rowIndex) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Agar data nahi hai aur loading bhi nahi ho rahi, to 'No data' message dikhayein
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No data available in table
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (agar zaroorat ho to) */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-gray-600">
          Showing {data.length} of {totalEntries} entries
        </div>
        {/* Yahan aap pagination buttons add kar sakte hain */}
      </div>
    </div>
  );
}
