"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getEmployeePayments } from "@/services/mock/employees";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EmployeePaymentsPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "EMP-1042";
  const payments = getEmployeePayments(employeeId);
  const [year, setYear] = useState("2026");

  const filtered = payments.filter((p) => String(p.year) === year);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Payment History" description="Salary, bonuses, and deductions" />

      <div className="flex flex-wrap gap-4">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard title="Salary Payments">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Payslip</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.month} {p.year}
                  </TableCell>
                  <TableCell>{formatCurrency(p.grossSalary)}</TableCell>
                  <TableCell>{formatCurrency(p.bonus)}</TableCell>
                  <TableCell>{formatCurrency(p.allowances)}</TableCell>
                  <TableCell>{formatCurrency(p.deductions)}</TableCell>
                  <TableCell>{formatCurrency(p.tax)}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(p.netSalary)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "paid" ? "success" : p.status === "pending" ? "warning" : "danger"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status === "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success(`Payslip for ${p.month} ${p.year} downloaded`)}
                        aria-label="Download payslip"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
