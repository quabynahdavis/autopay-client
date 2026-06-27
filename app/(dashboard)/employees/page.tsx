"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useCompanyId } from "@/contexts/AuthContext";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCompanyTeam } from "@/services/mock/employees";
import { getCompanyEmployees } from "@/services/mock/users";
import type { ManagedEmployee, EmploymentStatus } from "@/types/employee";
import { getCompanyById } from "@/lib/auth-store";
import { RequireAuth } from "@/components/auth/RequireAuth";

function EmployeesContent() {
  const companyId = useCompanyId();
  const { user } = useAuth();
  const company = getCompanyById(companyId);
  const team = useMemo(() => {
    const mockTeam = getCompanyTeam(companyId);
    const registered = getCompanyEmployees(companyId).map((u) => ({
      id: u.id, employeeId: u.employeeId ?? "—", companyId: u.companyId, name: u.name,
      email: u.email, department: "—", position: "Staff", manager: "—",
      status: "active" as EmploymentStatus, dateJoined: new Date().toISOString(),
    }));
    const emails = new Set(mockTeam.map((e) => e.email.toLowerCase()));
    return [...mockTeam, ...registered.filter((e) => !emails.has(e.email.toLowerCase()))];
  }, [companyId]);

  const columns: ColumnDef<ManagedEmployee>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "employeeId", header: "ID" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => (
      <Badge variant="success">{row.original.status.replace(/_/g, " ")}</Badge>
    )},
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader title="My Team" description={`People at ${company?.name ?? user?.companyName}`}
        actions={<Button onClick={() => toast.success("Company code: " + company?.code)}><Plus className="h-4 w-4" />Invite</Button>} />
      {company && (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium">Company code for employees</p>
          <p className="mt-1 text-2xl font-bold text-primary">{company.code}</p>
        </div>
      )}
      <SectionCard title="Team members" description={`${team.length} in your company`}>
        <DataTable columns={columns} data={team} searchKey="name" stickyHeader />
      </SectionCard>
    </div>
  );
}

export default function EmployeesPage() {
  return <RequireAuth portal="admin" permission="admin.employees"><EmployeesContent /></RequireAuth>;
}
