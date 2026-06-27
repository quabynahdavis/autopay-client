"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { auditLogs } from "@/services/mock/audit";
import type { AuditLog } from "@/types/audit";
import { formatDate } from "@/lib/utils";

const auditStatusVariant: Record<
  AuditLog["status"],
  "success" | "danger" | "warning"
> = {
  success: "success",
  failed: "danger",
  warning: "warning",
};

const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "user", header: "User" },
  { accessorKey: "action", header: "Action" },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => formatDate(row.original.timestamp),
  },
  { accessorKey: "ipAddress", header: "IP Address" },
  { accessorKey: "device", header: "Device" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={auditStatusVariant[row.original.status]}>
        {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      </Badge>
    ),
  },
];

export default function AuditLogsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Audit Logs"
        description="Track all user actions and system events"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Audit Logs" },
        ]}
      />

      <SectionCard title="Activity Log" description={`${auditLogs.length} entries`}>
        <DataTable
          columns={columns}
          data={auditLogs}
          searchKey="user"
          searchPlaceholder="Search by user or action..."
          stickyHeader
        />
      </SectionCard>
    </div>
  );
}
