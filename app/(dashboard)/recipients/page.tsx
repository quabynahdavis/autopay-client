"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { PageHeader, EmptyState, SectionCard } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recipients } from "@/services/mock/payments";
import { Plus } from "lucide-react";

type Recipient = (typeof recipients)[number];

const columns: ColumnDef<Recipient>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "accountNumber", header: "Account Number" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.type === "bank" ? "Bank" : "MoMo"}</Badge>
    ),
  },
  { accessorKey: "provider", header: "Bank / Provider" },
  { accessorKey: "department", header: "Department" },
];

export default function RecipientsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Recipients"
        description="Manage payment recipients for your organization"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Recipients" },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Add Recipient
          </Button>
        }
      />

      <SectionCard title="Recipient Directory" description={`${recipients.length} recipients`}>
        {recipients.length > 0 ? (
          <DataTable columns={columns} data={recipients} searchKey="name" searchPlaceholder="Search recipients..." stickyHeader />
        ) : (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="No recipients yet"
            description="Add recipients to start making bulk payments."
            actionLabel="Add Recipient"
            actionHref="/recipients"
          />
        )}
      </SectionCard>
    </div>
  );
}
