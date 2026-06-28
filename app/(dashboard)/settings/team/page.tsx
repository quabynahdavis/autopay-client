"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { SettingsLayout } from "@/features/settings/SettingsLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTeamMembers } from "@/services/api/settings";
import { useApiData } from "@/hooks/useApiData";
import type { TeamMember } from "@/types/user";
import { getRoleLabel, type UserRole } from "@/types/auth";
import { formatDate } from "@/lib/utils";

const roleDescriptions: Partial<Record<UserRole, string>> = {
  company_admin: "Full access to dashboard, batch processing, approvals, and team management",
  employee: "Self-service portal for payments and banking only",
};

const columns: ColumnDef<TeamMember>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline">{getRoleLabel(row.original.role)}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "warning"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => formatDate(row.original.lastActive),
  },
];

export default function TeamSettingsPage() {
  const { data: teamMembers, loading } = useApiData(fetchTeamMembers, []);

  return (
    <SettingsLayout>
      <PageHeader
        title="Team Members"
        description="Manage team access and roles"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" },
          { label: "Team Members" },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        }
      />
      <SectionCard title="Team Directory" description="Role management">
        {loading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <DataTable columns={columns} data={teamMembers ?? []} searchKey="name" stickyHeader />
        )}
      </SectionCard>
      <SectionCard title="Role Permissions" description="Overview of access levels">
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
            <div key={role} className="rounded-xl border border-border p-4">
              <p className="font-medium">{getRoleLabel(role)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {roleDescriptions[role]}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </SettingsLayout>
  );
}
