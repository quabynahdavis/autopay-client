"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchEmployees } from "@/services/api/employees";
import { fetchCompanyProfile } from "@/services/api/settings";
import { useApiData } from "@/hooks/useApiData";
import type { ManagedEmployee } from "@/types/employee";
import { RequireAuth } from "@/components/auth/RequireAuth";

function EmployeesContent() {
  const { user } = useAuth();
  const { data: team, loading: teamLoading } = useApiData(fetchEmployees, []);
  const { data: company } = useApiData(fetchCompanyProfile, []);

  const columns: ColumnDef<ManagedEmployee>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "employeeId", header: "ID" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="success">{row.original.status.replace(/_/g, " ")}</Badge>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="My Team"
        description={`People at ${company?.name ?? user?.companyName}`}
        actions={
          <Button onClick={() => toast.success("Company code: " + (company?.code ?? ""))}>
            <Plus className="h-4 w-4" />
            Invite
          </Button>
        }
      />
      {company && (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium">Company code for employees</p>
          <p className="mt-1 text-2xl font-bold text-primary">{company.code}</p>
        </div>
      )}
      <SectionCard title="Team members" description={`${team?.length ?? 0} in your company`}>
        {teamLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <DataTable columns={columns} data={team ?? []} searchKey="name" stickyHeader />
        )}
      </SectionCard>
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <RequireAuth portal="admin" permission="admin.employees">
      <EmployeesContent />
    </RequireAuth>
  );
}
