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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// Column ke liye type structure
interface Column<T> {
  key: string;
  label: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
}

// Pagination state ke liye type structure (Redux se aayega)
interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Component ke Props ka type define karein
// Yahan pagination se jude naye props add kiye gaye hain
interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  totalEntries: number;
  isLoading?: boolean;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

// Generic type T ko use karein behtar type-safety ke liye
export function DataTable<T extends { _id: string }>({
  title,
  columns,
  data,
  totalEntries,
  isLoading = false,
  pagination,
  onPageChange,
  onLimitChange,
}: DataTableProps<T>) {
  // Pagination ki details props se nikal lein
  const currentPage = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const totalPages = Math.ceil(totalEntries / limit);

  const startEntry = totalEntries > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endEntry = Math.min(currentPage * limit, totalEntries);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

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
            {isLoading ? (
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
              data.map((row, rowIndex) => (
                <TableRow key={row._id}>
                  {columns.map((col) => (
                    <TableCell key={`${row._id}-${col.key}`}>
                      {col.render
                        ? col.render(row, rowIndex)
                        : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
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

      {/* --- PAGINATION FOOTER (YAHAN BADLAV KIYA GAYA HAI) --- */}
      {/* Yeh section neeche pagination controls dikhayega */}
      {totalEntries > 0 && pagination && onPageChange && onLimitChange && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm">
          {/* Info Text: "Showing 1 to 10 of 25 entries" */}
          <div className="text-muted-foreground">
            {`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
          </div>

          <div className="flex items-center gap-4">
            {/* Rows per page ka dropdown */}
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <Select
                value={String(limit)}
                onValueChange={(value) => onLimitChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page number aur Next/Previous buttons */}
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
