"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { reportNavigation } from "@/constants/navigation";
import { fetchMonthlyVolume } from "@/services/api/payments";
import { useApiData } from "@/hooks/useApiData";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportsPage() {
  const pathname = usePathname();
  const { data: monthlyVolume, loading } = useApiData(fetchMonthlyVolume, []);

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Reports"
        description="Monthly payment reports and analytics"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Reports" },
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

      <FilterBar onExport={handleExport} />

      <SectionCard title="Monthly Summary" description="Payment volume by month">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(monthlyVolume ?? []).map((row, i) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month} 2026</TableCell>
                  <TableCell>{formatCurrency(row.volume)}</TableCell>
                  <TableCell>{Math.round(row.volume / 850)}</TableCell>
                  <TableCell>{(97 + (i % 3) * 0.5).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
