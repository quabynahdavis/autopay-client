"use client";

import Link from "next/link";
import { Upload, Wallet, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ApprovalQueuePreview } from "@/features/dashboard/ApprovalQueuePreview";
import { Button } from "@/components/ui/button";
import { dashboardStats } from "@/services/mock/payments";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user, can } = useAuth();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`}
        description={user?.companyName ?? "Your company"}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Paid this month"
          value={dashboardStats.successful}
          subtitle={formatCurrency(dashboardStats.totalPayments.amount)}
          icon={Wallet}
          variant="success"
        />
        <StatCard
          title="Waiting to pay"
          value={dashboardStats.pending}
          icon={Wallet}
          variant="warning"
        />
      </div>

      <SectionCard title="What do you want to do?">
        <div className="grid gap-3 sm:grid-cols-2">
          {can("admin.upload") && (
            <Button variant="outline" className="h-auto justify-start gap-3 py-4" asChild>
              <Link href="/upload">
                <Upload className="h-5 w-5 text-primary" />
                <span>Send money to many people</span>
              </Link>
            </Button>
          )}
          {can("admin.approval") && (
            <Button variant="outline" className="h-auto justify-start gap-3 py-4" asChild>
              <Link href="/approval">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Approve payments</span>
              </Link>
            </Button>
          )}
          <Button variant="outline" className="h-auto justify-start gap-3 py-4" asChild>
            <Link href="/payments">
              <Wallet className="h-5 w-5 text-primary" />
              <span>See all payments</span>
            </Link>
          </Button>
          {can("admin.employees") && (
            <Button variant="outline" className="h-auto justify-start gap-3 py-4" asChild>
              <Link href="/employees">
                <Wallet className="h-5 w-5 text-primary" />
                <span>See my team</span>
              </Link>
            </Button>
          )}
        </div>
      </SectionCard>

      <ApprovalQueuePreview />
    </div>
  );
}
