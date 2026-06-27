import { PageHeader, SectionCard } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaymentsTable } from "@/features/payments/PaymentTable";
import { Button } from "@/components/ui/button";
import { allPayments } from "@/services/mock/payments";
import { Plus } from "lucide-react";

export default function PaymentsPage() {
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

      <SectionCard title="All Payments" description={`${allPayments.length} transactions`}>
        <PaymentsTable data={allPayments} />
      </SectionCard>
    </div>
  );
}
