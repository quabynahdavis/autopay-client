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

const vendorData = [
  { vendor: "Golden Harvest Ltd", payments: 12, amount: 485000, lastPayment: "2026-06-25" },
  { vendor: "Tech Solutions GH", payments: 8, amount: 125000, lastPayment: "2026-06-27" },
  { vendor: "Northern Traders Co.", payments: 5, amount: 78000, lastPayment: "2026-06-26" },
  { vendor: "Accra Supplies Ltd", payments: 15, amount: 210000, lastPayment: "2026-06-24" },
];

export default function VendorReportsPage() {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Vendor Payments"
        description="Vendor payment history and summaries"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Reports", href: "/reports" },
          { label: "Vendor Payments" },
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

      <FilterBar onExport={(f) => toast.success(`Vendor report exported as ${f.toUpperCase()}`)} />

      <SectionCard title="Vendor Payment Summary">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Payments</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Last Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorData.map((row) => (
              <TableRow key={row.vendor}>
                <TableCell className="font-medium">{row.vendor}</TableCell>
                <TableCell>{row.payments}</TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>{row.lastPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
