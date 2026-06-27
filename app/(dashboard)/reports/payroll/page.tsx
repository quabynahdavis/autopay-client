"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { reportNavigation } from "@/constants/navigation";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const payrollData = [
  { department: "Operations", employees: 45, amount: 225000, status: "Completed" },
  { department: "Sales", employees: 28, amount: 140000, status: "Completed" },
  { department: "IT", employees: 15, amount: 97500, status: "Pending" },
  { department: "Finance", employees: 12, amount: 72000, status: "Completed" },
  { department: "HR", employees: 8, amount: 48000, status: "Completed" },
];

export default function PayrollReportsPage() {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Payroll Reports"
        description="Employee payroll payment summaries"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Reports", href: "/reports" },
          { label: "Payroll" },
        ]}
      />

      <nav className="flex flex-wrap gap-2" aria-label="Report sections">
        {reportNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <FilterBar onExport={(f) => toast.success(`Payroll report exported as ${f.toUpperCase()}`)} />

      <SectionCard title="June 2026 Payroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((row) => (
              <TableRow key={row.department}>
                <TableCell className="font-medium">{row.department}</TableCell>
                <TableCell>{row.employees}</TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
