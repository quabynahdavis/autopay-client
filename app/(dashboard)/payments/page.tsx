"use client";

import { useState, useCallback } from "react";
import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaymentsTable } from "@/features/payments/PaymentTable";
import { CreatePaymentDialog } from "@/features/payments/CreatePaymentDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPayments } from "@/services/api/payments";
import { useApiData } from "@/hooks/useApiData";
import { Plus } from "lucide-react";

export default function PaymentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: payments, loading, refetch } = useApiData(fetchPayments, []);

  const handleSuccess = useCallback(() => {
    // Refetch after a short delay to let the simulation run
    setTimeout(() => refetch?.(), 3000);
  }, [refetch]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Payments"
        description="View and manage all payment transactions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payments" },
        ]}
        actions={
          <Button id="create-payment-btn" onClick={() => setDialogOpen(true)}>
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

      <CreatePaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
