"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchEmployeeProfile,
  fetchSalaryPayments,
  fetchNotifications,
} from "@/services/api/employees";
import { useApiData } from "@/hooks/useApiData";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Landmark, Wallet } from "lucide-react";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? "";

  const { data: profile, loading: profileLoading } = useApiData(
    () => fetchEmployeeProfile(employeeId),
    [employeeId]
  );
  const { data: payments, loading: paymentsLoading } = useApiData(
    () => fetchSalaryPayments(employeeId),
    [employeeId]
  );
  const { data: notifications, loading: notificationsLoading } = useApiData(
    () => fetchNotifications(employeeId),
    [employeeId]
  );

  const loading = profileLoading || paymentsLoading || notificationsLoading;
  const filteredNotifications = (notifications ?? []).filter(
    (n) => n.type === "salary_paid" || n.type === "payment_failed" || n.type === "announcement"
  );
  const latestPaid = (payments ?? []).find((p) => p.status === "paid");
  const pendingPay = (payments ?? []).find((p) => p.status === "pending");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        title={`Hello, ${profile?.firstName ?? user?.name?.split(" ")[0] ?? "there"}`}
        description={user?.companyName ?? "Your workplace"}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Last payment"
            value={latestPaid ? formatCurrency(latestPaid.netSalary) : "—"}
            subtitle={latestPaid ? `${latestPaid.month} ${latestPaid.year}` : "No payment yet"}
            icon={Wallet}
            variant="success"
          />
          <StatCard
            title="Coming soon"
            value={pendingPay ? formatCurrency(pendingPay.netSalary) : "None"}
            subtitle={pendingPay ? `${pendingPay.month} ${pendingPay.year}` : undefined}
            icon={Wallet}
            variant="warning"
          />
        </div>
      )}

      {!loading && filteredNotifications.length > 0 && (
        <SectionCard title="Messages">
          <ul className="space-y-3">
            {filteredNotifications.slice(0, 3).map((n) => (
              <li key={n.id} className="rounded-lg bg-muted/40 p-3">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="Quick links">
        <div className="grid gap-3">
          <Button variant="outline" className="h-auto justify-start gap-3 py-4" asChild>
            <Link href="/employee/payments">
              <Wallet className="h-5 w-5 text-primary" />
              See my payment history
            </Link>
          </Button>
          <Button variant="outline" className="h-auto justify-start gap-3 py-4" asChild>
            <Link href="/employee/banking">
              <Landmark className="h-5 w-5 text-primary" />
              Update bank or MoMo
            </Link>
          </Button>
        </div>
      </SectionCard>

      {!loading && (payments ?? []).length > 0 && (
        <SectionCard title="Recent payments">
          {(payments ?? []).slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border-b border-border py-3 last:border-0"
            >
              <span className="text-sm">
                {p.month} {p.year}
              </span>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(p.netSalary)}</p>
                <Badge variant={p.status === "paid" ? "success" : "warning"}>{p.status}</Badge>
              </div>
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  );
}
