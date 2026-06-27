"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Payment } from "@/types/payment";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "recipientName",
    header: "Name",
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
  },
  {
    accessorKey: "paymentType",
    header: "Payment Type",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.paymentType === "bank" ? "Bank" : "MoMo"}
      </Badge>
    ),
  },
  {
    accessorKey: "bankOrProvider",
    header: "Bank / MoMo",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} showProgress={row.original.status === "processing"} />
    ),
  },
  {
    id: "validation",
    header: "Validation",
    cell: ({ row }) => {
      const validation = row.original.validation;
      if (!validation) return <span className="text-muted-foreground">—</span>;
      return validation.valid ? (
        <Check className="h-4 w-4 text-success" aria-label="Valid" />
      ) : (
        <span className="flex items-center gap-1 text-danger">
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs">{validation.errors?.[0]}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];

export function PaymentsTable({
  data,
  searchKey = "recipientName",
}: {
  data: Payment[];
  searchKey?: string;
}) {
  return (
    <DataTable
      columns={paymentColumns}
      data={data}
      searchKey={searchKey}
      searchPlaceholder="Search by name or account..."
      stickyHeader
    />
  );
}

export function PaymentTableLink({ data }: { data: Payment[] }) {
  return (
    <div>
      <PaymentsTable data={data} />
      <div className="mt-4 text-right">
        <Link href="/payments" className="text-sm font-medium text-primary hover:underline">
          View all payments →
        </Link>
      </div>
    </div>
  );
}
