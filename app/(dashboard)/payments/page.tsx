"use client";

import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaymentsTable } from "@/features/payments/PaymentTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPayments } from "@/services/api/payments";
import { useApiData } from "@/hooks/useApiData";
import { Plus } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments, loading } = useApiData(fetchPayments, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Payments"
        description="View and manage all payment transactions"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Payments" },
        ]}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Create Payment
          </Button>
        }
      />

      <FilterBar />

      <SectionCard
        title="All Payments"
        description={`${payments?.length ?? 0} transactions`}
      >
        {loading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <PaymentsTable data={payments ?? []} />
        )}
      </SectionCard>
    </div>
  );
}
